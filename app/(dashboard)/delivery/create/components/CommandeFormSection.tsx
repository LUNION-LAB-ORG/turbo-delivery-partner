import Tesseract from 'tesseract.js';
import { TrashIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import 'react-phone-number-input/style.css';
import { Restaurant } from '@/types/models';
import { Input } from '@/components/ui/input';
import { Button, Switch } from '@heroui/react';
import { AddressFields } from './AddressFields';
import { DeliveryFee } from '@/types/restaurant';
import { useState, useEffect, useRef } from "react";
import { InputPhone } from '@/components/ui/form-ui/input-phone';
import { Camera, Upload, X, FileText, Loader2 } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Options de mode de paiement
const modePaiementOptions = [
    { label: 'Espèce', value: 'ESPECE' },
    { label: 'Wave', value: 'WAVE' },
];

interface CommandeFormSectionProps {
    index: number;
    form: any;
    remove: (index: number) => void;
    handleAddressSelect: (index: number, type: 'lieuRecuperation' | 'lieuLivraison') => void;
    restaurant: Restaurant;
    fraisLivraisons: DeliveryFee[];
}

export const CommandeFormSection = ({ index, form, remove, handleAddressSelect, restaurant, fraisLivraisons }: CommandeFormSectionProps) => {
    const [isScanning, setIsScanning] = useState(false);
    const [scannedImage, setScannedImage] = useState<string | null>(null);
    const [extractedText, setExtractedText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        form.setValue(`commandes.${index}.modePaiement`, modePaiementOptions[0]?.value ?? "");
    }, [form, index, modePaiementOptions]);
      

    /** --------------------- CAMERA --------------------- */
    const startCamera = async () => {
        setError('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
            streamRef.current = stream;
            setIsScanning(true);
        } catch (err: any) {
            setError(err.message || 'Impossible d\'accéder à la caméra');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }
        setIsScanning(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) {
            setError('Erreur lors de la capture de l\'image');
            return;
        }
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setError('Impossible d\'initialiser le canvas');
            return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
            if (blob) {
                const imageUrl = URL.createObjectURL(blob);
                setScannedImage(imageUrl);
                await processImage(blob);
                stopCamera();
            }
        }, 'image/jpeg', 0.9);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(file);
            setScannedImage(imageUrl);
            await processImage(file);
        }
    };

    const resetScanner = () => {
        setScannedImage(null);
        setExtractedText('');
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    /** --------------------- OCR & OpenAI --------------------- */
    const extractText = async (imageUrl: string): Promise<string> => {
        const { data } = await Tesseract.recognize(imageUrl, 'fra', { logger: (m) => true });
        return data.text;
    };

    const analyzeWithOpenAI = async (prompt: string): Promise<string> => {
        setIsProcessing(true);
        try {
            const res = await fetch('/api/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
                return '';
            }
            return JSON.stringify(data.result || {});
        } catch (err: any) {
            setError(err.message || 'Erreur serveur');
            return '';
        } finally {
            setIsProcessing(false);
        }
    };

    function extractJsonFromString(str: string) {
        // Cherche un bloc ```json ... ```
        const match = str.match(/```json([\s\S]*?)```/i);
        if (!match) return null; // Aucun JSON trouvé
    
        try {
            return JSON.parse(match[1]); // On parse le contenu trouvé
        } catch (error) {
            console.log("Erreur parsing JSON:", error);
            return null;
        }
    }

    /** --------------------- EXTRACTION AUTOMATIQUE --------------------- */
    const fillFormFromText = (jsonString: string) => {
        try {
            const data = extractJsonFromString(JSON.parse(jsonString));
            const numeroCommande = data.numero_commande || '';
            const contact = data.numero_telephone || '';
            const fraisLivraison = parseInt(data.frais_livraison || '0', 10);
            const zoneSelectionnee = fraisLivraisons.find((zone) => zone.prix == fraisLivraison);
            const total = parseInt(data.total_commande || '0', 10);
        
            setExtractedText(
                `Voici les données extraites : N° Commande: ${numeroCommande ?? 'Aucune Donnée'} | N° Telephone: ${contact ?? 'Aucune Donnée'} | Frais Livraison: ${fraisLivraison ?? 'Aucune Donnée'} | Total Commande: ${total ?? 'Aucune Donnée'}`
            );
           
            // Mets à jour le form avec la nouvelle liste
            form.setValue(`commandes.${index}.prix`, total);
            form.setValue(`commandes.${index}.numero`, numeroCommande);
            form.setValue(`commandes.${index}.zoneId`, zoneSelectionnee?.id);
            form.setValue(`commandes.${index}.destinataire.contact`, contact);
        } catch (err) {
            console.error('Erreur lors du parsing du JSON OpenAI:', err);
            setError("Impossible d'interpréter la réponse OpenAI");
        }
    };

    const processImage = async (imageBlob: File | Blob) => {
        setIsProcessing(true);
        setError('');
        try {
            const imageUrl = URL.createObjectURL(imageBlob);
            let extractedTextResult = await extractText(imageUrl);
            URL.revokeObjectURL(imageUrl);
            extractedTextResult = `Prompt: Extrait à partir de ce texte et retourne en json: le numéro commande, 
                le numéro téléphone (Si Ce numéro contient le code pays supprime et precède par +225, sinon precède par +225), 
                le frais livraison et le total commande(Si Y’a deux codes, Prends celui précédé du terme «Facture» ou «code Check ou Check» ou «N°». Si le frais de livraison est identifié avant le total commande, total commande = total commande - frais de livraison, sinon total commande = total commande) : ${extractedTextResult}`;
            const resultJson = await analyzeWithOpenAI(extractedTextResult);
            fillFormFromText(resultJson);
        } catch (err: any) {
            setError(err.message || 'Erreur lors du traitement de l\'image');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Card className="p-3 space-y-3 bg-background border-l-4 border-l-primary">
            <div className="flex justify-between items-center bg-muted/50 dark:bg-muted p-2 rounded-lg">
                <h3 className="text-base font-semibold text-primary">Commande {index + 1}</h3>
                {index > 0 && (
                    <Button type="button" variant="bordered" color="danger" size="sm" onClick={() => remove(index)} className="hover:bg-destructive/10 dark:hover:bg-destructive/20 h-6 min-h-0">
                        <TrashIcon className="h-3 w-3" />
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-3 space-y-3">
                    {!scannedImage && !isScanning && (
                        <div 
                            onClick={() => fileInputRef.current?.click()} 
                            className="text-center py-4 bg-gray-50 rounded-lg cursor-pointer">
                                
                            {/* Icône cliquable */}
                            <Camera className="h-16 w-16 mx-auto text-primary mb-2 hover:text-primary transition-colors" />
                        
                            <h3 className="text-lg font-semibold text-gray-700">Scanner ou uploader un ticket</h3>
                            <p className="text-gray-600 mb-4">
                                Cliquez sur l’icône caméra pour capturer ou uploader un ticket.
                            </p>                       
                        </div>                      
                    )}
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        capture="environment"
                        accept="image/*" 
                        onChange={handleFileUpload}
                        className="hidden" 
                    />

                    {/* Scanner */}
                    {isScanning && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Scanner le document</h3>
                                    <button onClick={stopCamera} className="text-gray-500 hover:text-gray-700">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <div className="relative">
                                    <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                                    <div className="absolute inset-0 border-4 border-dashed border-primary rounded-lg pointer-events-none"></div>
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button onClick={capturePhoto} className="flex-1 bg-primary text-white py-3 px-4 rounded-md hover:bg-primary transition-colors flex items-center justify-center gap-2">
                                        <Camera className="h-5 w-5" /> Capturer
                                    </button>
                                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                                        <Upload className="h-5 w-5" /> Upload
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <canvas ref={canvasRef} className="hidden" />
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

                    {/* Erreurs */}
                    {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

                    {/* Image et texte */}
                    {scannedImage && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Camera className="h-5 w-5" /> Ticket Scanné</h3>
                                <img src={scannedImage} alt="Document scanné" className="w-full rounded-lg border shadow-md" />
                                <button onClick={resetScanner} className="mt-3 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 w-full">Scanner un autre ticket</button>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><FileText className="h-5 w-5" /> Données extraites {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}</h3>
                                { isProcessing ? (
                                    <div className="bg-gray-50 border rounded-lg p-4 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                                        <p className="text-gray-600">Extraction du texte en cours...</p>
                                    </div>
                                ) : (
                                    extractedText && (
                                        <div className="bg-gray-50 border rounded-lg p-4">
                                            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{extractedText}</pre>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="lg:col-span-2 space-y-3">
                    <div className="bg-card p-2 rounded-lg shadow-sm border border-border grid grid-cols-1 md:grid-cols-2 gap-2">
                        <FormField
                            control={form.control}
                            name={`commandes.${index}.prix`}
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-sm">Montant Commande</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" min="0" step="0.01" onChange={(e) => field.onChange(parseFloat(e.target.value))} className="h-8" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`commandes.${index}.numero`}
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-sm">N° Commande</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="h-8" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="bg-card p-3 rounded-lg shadow-sm border border-border space-y-2">
                        <h4 className="font-semibold text-green-600 dark:text-green-400">Destinataire</h4>
                        <div className="grid grid-cols-1 gap-2">
                            <FormField
                                control={form.control}
                                name={`commandes.${index}.destinataire.contact`}
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-sm">N° Client</FormLabel>
                                        <FormControl>
                                            <InputPhone
                                                value={field.value ?? ''}
                                                setValue={(value: any) => field.onChange(value)}
                                                variant="bordered"
                                                isInvalid={!!form.formState.errors?.commandes?.[index]?.destinataire?.contact}
                                                errorMessage={form.formState.errors?.commandes?.[index]?.destinataire?.contact?.message}
                                                className="min-h-8"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="bg-green-50/50 dark:bg-green-950/30 p-2 rounded-lg shadow-sm border border-green-100 dark:border-green-900">
                            <AddressFields index={index} type="lieuLivraison" label="Aidez-nous à localiser le client" form={form} handleAddressSelect={handleAddressSelect} />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="bg-card p-2 rounded-lg shadow-sm border border-border space-y-2">
                        <div className="bg-primary/5 dark:bg-primary/10 p-2 rounded-lg">
                            <AddressFields index={index} type="lieuRecuperation" label="Lieu de récupération" form={form} handleAddressSelect={handleAddressSelect} />
                        </div>

                        <FormField
                            control={form.control}
                            name={`commandes.${index}.zoneId`}
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-sm">Zone de livraison</FormLabel>
                                    <select
                                        {...field}
                                        className="w-full h-8 border rounded px-2 text-sm"
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    >
                                        {fraisLivraisons?.map((zone) => (
                                            <option key={zone.id} value={zone.id}>
                                                {zone.name}
                                            </option>
                                        ))}
                                    </select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="bg-card p-2 rounded-lg shadow-sm border border-border space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Autres Informations</h4>
                        <div className="grid grid-cols-1 gap-2">
                            <FormField
                                control={form.control}
                                name={`commandes.${index}.modePaiement`}
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-sm">Mode de Paiement</FormLabel>
                                        <select
                                            {...field}
                                            className="h-8 w-full border rounded px-2"
                                        >
                                            {modePaiementOptions.map((mode) => (
                                            <option key={mode.value} value={mode.value}>
                                                {mode.label}
                                            </option>
                                            ))}
                                        </select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`commandes.${index}.livraisonPaye`}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-2 shadow-sm bg-muted/50 dark:bg-muted">
                                        <FormLabel className="text-sm">Total + livraison incluse</FormLabel>
                                        <FormControl>
                                            <Switch
                                                isSelected={field.value}
                                                onChange={field.onChange} 
                                                id={`livraisonPaye-${index}`}
                                                aria-label="Frais Livraison Inclus"
                                                className="scale-75"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default CommandeFormSection;

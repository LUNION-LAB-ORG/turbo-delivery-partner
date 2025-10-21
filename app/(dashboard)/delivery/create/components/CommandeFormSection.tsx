import Select from 'react-select';
import Tesseract from 'tesseract.js';
import { useWatch } from "react-hook-form";
import { Card } from '@/components/ui/card';
import 'react-phone-number-input/style.css';
import { Restaurant } from '@/types/models';
import { Input } from '@/components/ui/input';
import { Button, Switch } from '@heroui/react';
import { AddressFields } from './AddressFields';
import { DeliveryFee } from '@/types/restaurant';
import { useState, useEffect, useRef } from "react";
import { InputPhone } from '@/components/ui/form-ui/input-phone';
import { TrashIcon, Camera, FileText, Loader2 } from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
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
    const [isModalOpen, setIsModalOpen] = useState(false);

    /** Initialisation des valeurs par défaut */
    useEffect(() => {
        form.setValue(`commandes.${index}.modePaiement`, modePaiementOptions[0]?.value ?? "");
        form.setValue(`commandes.${index}.statut`, "EN_ATTENTE_RECUPERATION"); // Déjà prête par défaut
    }, [form, index]);

    /** --------------------- CAMERA --------------------- */
    const startCamera = async () => {
        setError('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
            streamRef.current = stream;
            setIsScanning(true);
        } catch (err: any) {
            setError(err.message || "Impossible d'accéder à la caméra");
        }
    };
    const stopCamera = () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        setIsScanning(false);
    };
    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
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
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
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
        const { data } = await Tesseract.recognize(imageUrl, 'fra', { logger: () => null });
        return data.text;
    };
    const analyzeWithOpenAI = async (prompt: string): Promise<string> => {
        setIsProcessing(true);
        try {
            const res = await fetch('/api/analyze-prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            if (data.error) setError(data.error);
            return JSON.stringify(data.result || {});
        } catch (err: any) {
            setError(err.message || "Erreur serveur");
            return '';
        } finally { setIsProcessing(false); }
    };
    const extractJsonFromString = (str: string) => {
        const match = str.match(/```json([\s\S]*?)```/i);
        if (!match) return null;
        try { return JSON.parse(match[1]); } catch { return null; }
    };

    const fillFormFromText = (jsonString: string) => {
        try {
            const data = extractJsonFromString(JSON.parse(jsonString));

            const numeroCommande = data.numero_commande || '';
            const contact = data.numero_telephone || '';
            const fraisLivraison = parseInt(data.frais_livraison || '0', 10);
            const total = parseInt(data.total_commande || '0', 10);

            // 🔍 Trouve la zone correspondante
            const zoneSelectionnee = fraisLivraisons.find(z => z.prix == fraisLivraison);

            // ✅ Affiche un résumé visuel
            setExtractedText(
                `N° Commande: ${numeroCommande} | N° Tel: ${contact} | Frais Livraison: ${fraisLivraison} | Total: ${total}`
            );

            // ✅ Remplit les champs du formulaire
            form.setValue(`commandes.${index}.prix`, total);
            form.setValue(`commandes.${index}.numero`, numeroCommande);
            form.setValue(`commandes.${index}.destinataire.contact`, contact);

            // ✅ Renseigne automatiquement l’adresse de livraison
            if (zoneSelectionnee) {
                form.setValue(`commandes.${index}.lieuLivraison.address`, zoneSelectionnee.zone ?? "");
                form.setValue(`commandes.${index}.zoneId`, String(zoneSelectionnee?.id ?? ""));
            }

        } catch (err) {
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
            extractedTextResult = `Prompt: Extrait à partir de ce texte et retourne le numero_commande, le numero_telephone(prefixe tjrs par +225 s'il n'y a pas de prefix), frais_livraison et le total_commande = total_commande - frais_livraison, si les frais_livraison sont detectés avant le total commande, sinon total_commande = total_commande + frais_livraison en json: ${extractedTextResult}`;
            const resultJson = await analyzeWithOpenAI(extractedTextResult);
            fillFormFromText(resultJson);
        } catch (err: any) { setError(err.message || 'Erreur lors du traitement de l\'image'); }
        finally { setIsProcessing(false); }
    };

    return (
        <>
            <Card className="p-4 space-y-4 rounded-xl bg-background border-l-4 border-l-primary shadow-md">
                {/* Header avec scanner à droite */}
                <div className="flex justify-between items-center bg-muted/30 dark:bg-muted p-3 rounded-md">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-primary">Commande {index + 1}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Bouton scanner compact */}
                        <Button
                            type="button"
                            variant="ghost"
                            color="primary"
                            size="sm"
                            onPress={() => setIsModalOpen(true)}
                            className="flex items-center gap-1 h-7 min-h-0"
                        >
                            <Camera className="h-4 w-4" />
                            <span>Scanner</span>
                        </Button>


                        {/* Supprimer commande */}
                        {index > 0 && (
                            <Button
                                type="button"
                                variant="bordered"
                                color="danger"
                                size="sm"
                                onPress={() => remove(index)}
                                className="h-7 min-h-0"
                            >
                                <TrashIcon className="h-3 w-3" />
                            </Button>
                        )}
                    </div>

                    {/* Input invisible pour uploader l’image */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        capture="environment"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </div>

                {/* Scanner */}
                {(isScanning || scannedImage || error) && (
                    <div className="mt-2 space-y-2">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md">
                                {error}
                            </div>
                        )}

                        {scannedImage && (
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <img
                                        src={scannedImage}
                                        alt="Document scanné"
                                        className="w-full rounded-lg border shadow-sm"
                                    />
                                    <Button
                                        variant="bordered"
                                        className="mt-2 w-full"
                                        onPress={resetScanner}
                                    >
                                        Scanner un autre ticket
                                    </Button>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <FileText className="h-5 w-5" /> Données extraites
                                    </h4>
                                    {isProcessing ? (
                                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                            <p className="mt-2 text-gray-500">Extraction en cours...</p>
                                        </div>
                                    ) : (
                                        extractedText && (
                                            <pre className="bg-gray-50 p-4 rounded-lg text-sm font-mono text-gray-800 break-words overflow-x-auto">
                                                {extractedText}
                                            </pre>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Infos Commande */}
                    <div className="grid grid-cols-1 gap-2 rounded-md shadow-sm">
                        <Card className="p-4 space-y-4 rounded-md bg-card border border-border shadow-sm">
                            <h3 className="text-lg font-semibold text-primary mb-3">Infos Commande</h3>

                            {/* Montant Commande */}
                            <FormField
                                control={form.control}
                                name={`commandes.${index}.prix`}
                                render={({ field }) => {
                                    // Fonction pour formater le montant (espaces entre milliers)
                                    const formatMontant = (value: string | number) => {
                                        const num = parseFloat(String(value).replace(/\s/g, ''));
                                        if (isNaN(num)) return '';
                                        return num.toLocaleString('fr-FR');
                                    };

                                    // Fonction appelée à chaque saisie
                                    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                        const inputValue = e.target.value.replace(/\s/g, '');
                                        if (!/^\d*$/.test(inputValue)) return;

                                        const numericValue = inputValue ? parseFloat(inputValue) : 0;
                                        field.onChange(numericValue);
                                    };

                                    return (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Montant Commande</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={formatMontant(field.value ?? '')}
                                                    placeholder="Ex: 2 000"
                                                    className="w-full h-10"
                                                    onChange={handleChange}
                                                    onBlur={(e) => e.target.value = formatMontant(field.value ?? '')}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />

                            {/* N° Commande */}
                            <FormField control={form.control} name={`commandes.${index}.numero`} render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>N° Commande</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-full h-10" placeholder="Ex: 12345" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Statut Commande */}
                            <div className="bg-green-50/50 p-2 rounded-md border border-green-200">
                                <FormField
                                    control={form.control}
                                    name={`commandes.${index}.statut`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Statut Commande</FormLabel>
                                            <FormControl>
                                                <div
                                                    className="flex items-center gap-2 cursor-pointer select-none"
                                                    onClick={() =>
                                                        field.onChange(
                                                            field.value === "EN_PREPARATION"
                                                                ? "EN_ATTENTE_RECUPERATION"
                                                                : "EN_PREPARATION"
                                                        )
                                                    }
                                                >
                                                    <Switch
                                                        isSelected={field.value === "EN_ATTENTE_RECUPERATION"}
                                                        onChange={() =>
                                                            field.onChange(
                                                                field.value === "EN_PREPARATION"
                                                                    ? "EN_ATTENTE_RECUPERATION"
                                                                    : "EN_PREPARATION"
                                                            )
                                                        }
                                                        className="scale-90"
                                                    />
                                                    <span className="font-medium">
                                                        {field.value === "EN_PREPARATION" ? "En Préparation" : "Déjà Prête"}
                                                    </span>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="bg-green-50/50 p-2 rounded-md border border-green-200">
                                <AddressFields
                                    index={0}
                                    type="lieuRecuperation"
                                    label="Lieu de récupération"
                                    form={form}
                                    defaultAddress={{
                                        address: restaurant?.idLocation,
                                        latitude: restaurant?.latitude,
                                        longitude: restaurant?.longitude,
                                        readOnly: true, // 🔒 empêche modification
                                    }}
                                />
                            </div>

                            {form.watch(`commandes.${index}.statut`) === "EN_PREPARATION" && (
                                <FormField
                                    control={form.control}
                                    name={`commandes.${index}.tempsPreparation`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel>Temps de préparation (minutes)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    {...field}
                                                    value={field.value ?? 0}
                                                    onChange={(e) => field.onChange(Number(e.target.value))} // ⚡ convertit en number
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            )}
                        </Card>
                    </div>

                    {/* Destinataire */}
                    <div className="rounded-md shadow-sm space-y-4">
                        <Card className="p-4 space-y-5 rounded-md bg-card border border-border shadow-sm">
                            <h3 className="text-lg font-semibold text-green-600 mb-3">Destinataire / Client</h3>
                            <FormField control={form.control} name={`commandes.${index}.destinataire.contact`} render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>N° Téléphone</FormLabel>
                                    <FormControl>
                                        <InputPhone value={field.value ?? ''} setValue={field.onChange} className="h-10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name={`commandes.${index}.zoneId`} render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>Zone de livraison</FormLabel>
                                    <Select
                                        value={fraisLivraisons.map(z => ({ value: z.id, label: z.name })).find(z => z.value === field.value) || null}
                                        onChange={(option: any) => field.onChange(option?.value ?? "")}
                                        options={fraisLivraisons.map(z => ({ value: z.id, label: z.name }))}
                                        placeholder="-- Sélectionnez une zone --"
                                        isClearable
                                    />
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {/* Mode de Paiement */}
                            <FormField control={form.control} name={`commandes.${index}.modePaiement`} render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel>Mode de Paiement</FormLabel>
                                    <select {...field} className="w-full h-10 border rounded px-2">
                                        {modePaiementOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                    </select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="bg-green-50/50 p-2 rounded-md border border-green-200">
                                <AddressFields index={index} type="lieuLivraison" label="Adresse de Livraison" form={form} />
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name={`commandes.${index}.zoneId`}
                        render={({ field }) => {
                            // ✅ On observe en direct les valeurs nécessaires
                            const montantCommande = useWatch({
                                control: form.control,
                                name: `commandes.${index}.prix`,
                            });

                            const zoneId = useWatch({
                                control: form.control,
                                name: `commandes.${index}.zoneId`,
                            });

                            // ✅ Zone sélectionnée et calculs
                            const zoneSelectionnee = fraisLivraisons.find(z => z.id === zoneId);
                            const montant = parseFloat(montantCommande || 0) || 0;
                            const fraisLivraison =
                                typeof zoneSelectionnee?.prix === "number"
                                    ? zoneSelectionnee.prix
                                    : parseFloat(zoneSelectionnee?.prix ?? "0");

                            const totalCommande = montant + fraisLivraison;

                            return montant > 0 ? (
                                <FormItem className="space-y-2">
                                    <div className="bg-green-50/50 p-2 rounded-md border border-green-200 font-medium text-gray-800">
                                        <p>Montant Commande : {montant.toLocaleString()} XOF</p>
                                        <p>
                                            Frais Livraison ({zoneSelectionnee?.name ?? "--"}) :{" "}
                                            {(zoneSelectionnee?.prix ?? 0).toLocaleString()} XOF
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            Total : {totalCommande.toLocaleString()} XOF
                                        </p>
                                    </div>
                                </FormItem>
                            ) : (<></>);
                        }}
                    />

                    <FormField control={form.control} name={`commandes.${index}.livraisonPaye`} render={({ field }) => (
                        <FormItem className="flex justify-between items-center p-2 border rounded-lg bg-muted/50">
                            <FormLabel>Ce client a déjà reglé sa facture (Commande & Livraison)</FormLabel>
                            <FormControl>
                                <Switch isSelected={field.value} onChange={field.onChange} className="scale-75" />
                            </FormControl>
                        </FormItem>
                    )} />
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        Choisir une méthode de scan
                    </ModalHeader>
                    <ModalBody>
                        <p className="text-sm text-gray-600 mb-3">
                            Vous pouvez soit prendre une photo avec la caméra, soit uploader un ticket existant.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                color="primary"
                                className="flex-1"
                                onPress={async () => {
                                    setIsModalOpen(false);
                                    await startCamera();
                                }}
                            >
                                <Camera className="w-4 h-4 mr-2" />
                                Scanner via Caméra
                            </Button>

                            <Button
                                variant="bordered"
                                className="flex-1"
                                onPress={() => {
                                    setIsModalOpen(false);
                                    fileInputRef.current?.click();
                                }}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Uploader une image
                            </Button>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={() => setIsModalOpen(false)}>
                            Annuler
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CommandeFormSection;

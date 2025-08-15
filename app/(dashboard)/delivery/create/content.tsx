'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, Camera, Upload, X, FileText, Loader2 } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@heroui/react';
import { AllCommandeSchema, FormValues } from '@/src/schemas/courses.schema';
import { CommandeFormSection } from './components/CommandeFormSection';
import { MapComponent } from '../component/MapComponent';
import { Restaurant } from '@/types/models';
import { addCourseExterne } from '@/src/actions/courses.actions';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import { MarkerData } from '@/types';
import { ROUTE_COLORS } from '@/data';
import { DeliveryFee } from '@/types/restaurant';
import Tesseract from 'tesseract.js';

export interface CourseExterneFormProps {
  initialData?: FormValues;
  isEditing?: boolean;
  restaurant: Restaurant;
  fraisLivraisons: DeliveryFee[];
}

const CourseExterneForm = ({ initialData, isEditing = false, restaurant, fraisLivraisons }: CourseExterneFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(AllCommandeSchema),
    defaultValues: initialData || {
      commandes: [
        {
          numero: '',
          destinataire: { contact: '' },
          lieuRecuperation: {
            address: restaurant.localisation ?? '',
            longitude: restaurant.longitude ?? 0,
            latitude: restaurant.latitude ?? 0,
          },
          lieuLivraison: { address: '', longitude: 0, latitude: 0 },
          modePaiement: 'ESPECE',
          prix: 0,
          livraisonPaye: false,
          zoneId: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'commandes' });

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
      const zoneSelectionnee = fraisLivraisons.find((zone) => zone.prix === fraisLivraison);
      const total = parseInt(data.total_commande || '0', 10);

      setExtractedText(`Voici les données extraites : Numero Commande: ${numeroCommande ?? 'Aucune Donnée'} | Numero Telephone: ${contact ?? 'Aucune Donnée'} | Frais Livraison: ${fraisLivraison ?? 'Aucune Donnée'} | Total Commande: ${total ?? 'Aucune Donnée'}`);
      form.setValue('commandes.0.numero', numeroCommande);
      form.setValue('commandes.0.destinataire.contact', contact);
      form.setValue('commandes.0.prix', total);
      form.setValue('commandes.0.zoneId', zoneSelectionnee?.id ?? '');
    } catch (err) {
      console.error('Erreur lors du parsing du JSON OpenAI:', err);
      setError('Impossible d\'interpréter la réponse OpenAI');
    }
  };

  const processImage = async (imageBlob: File | Blob) => {
    setIsProcessing(true);
    setError('');
    try {
      const imageUrl = URL.createObjectURL(imageBlob);
      const extractedTextResult = await extractText(imageUrl);
      URL.revokeObjectURL(imageUrl);

      const resultJson = await analyzeWithOpenAI(extractedTextResult);
      fillFormFromText(resultJson);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du traitement de l\'image');
    } finally {
      setIsProcessing(false);
    }
  };

  /** --------------------- FORMULAIRE & MAP --------------------- */
  const handleAddressSelect = useCallback(
    (index: number, type: 'lieuRecuperation' | 'lieuLivraison') => {
      const autocomplete = new google.maps.places.Autocomplete(document.getElementById(`${type}-${index}`) as HTMLInputElement, {});
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          form.setValue(`commandes.${index}.${type}.latitude`, lat);
          form.setValue(`commandes.${index}.${type}.longitude`, lng);
          form.setValue(`commandes.${index}.${type}.address`, place.formatted_address || '');
        }
      });
    },
    [form]
  );

  useEffect(() => {
    const updatedMarkers = fields
      .map((field, index) => {
        const startLat = form.watch(`commandes.${index}.lieuRecuperation.latitude`);
        const startLng = form.watch(`commandes.${index}.lieuRecuperation.longitude`);
        const endLat = form.watch(`commandes.${index}.lieuLivraison.latitude`);
        const endLng = form.watch(`commandes.${index}.lieuLivraison.longitude`);
        if (isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng)) return null;
        return { start: { lat: startLat, lng: startLng }, end: { lat: endLat, lng: endLng }, color: ROUTE_COLORS[index % ROUTE_COLORS.length] };
      })
      .filter((marker): marker is MarkerData => marker !== null);
    setMarkers(updatedMarkers);
  }, [fields, form]);

  const handleSubmitForm = async (formData: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await addCourseExterne(formData, restaurant.id);
      if (result.status === 'success') {
        toast.success(result.message);
        router.push('/delivery');
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Erreur serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  /** --------------------- JSX --------------------- */
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto p-2 bg-white space-y-6">
            {/* Titre */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-red-600">Nouvelle demande de coursier</h1>
                <div className="text-sm text-gray-600">Mes Courses / Nouvelle demande de coursier</div>
            </div>

            {!scannedImage && !isScanning && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Scanner ou uploader un document
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Cliquez sur un des boutons ci-dessous pour capturer ou uploader un document.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button 
                            onClick={startCamera}
                            className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary transition-colors flex items-center gap-2"
                        >
                            <Camera className="h-5 w-5" /> Ouvrir la caméra
                        </button>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <Upload className="h-5 w-5" /> Choisir un fichier
                        </button>
                    </div>
                </div>
            )}
            <input 
                ref={fileInputRef}
                type="file" 
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
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Camera className="h-5 w-5" /> Document scanné</h3>
                        <img src={scannedImage} alt="Document scanné" className="w-full rounded-lg border shadow-md" />
                        <button onClick={resetScanner} className="mt-3 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 w-full">Scanner un autre document</button>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><FileText className="h-5 w-5" /> Données extraites {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}</h3>
                        {isProcessing ? (
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

          {/* Formulaire */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
                {fields.map((field, index) => (
                  <CommandeFormSection key={field.id} index={index} form={form} remove={remove} handleAddressSelect={handleAddressSelect} restaurant={restaurant} fraisLivraisons={fraisLivraisons} />
                ))}

                <Button type="button" onClick={() => append({
                  numero: '',
                  destinataire: { contact: '' },
                  lieuRecuperation: { address: restaurant.localisation ?? '', longitude: restaurant.longitude ?? 0, latitude: restaurant.latitude ?? 0 },
                  lieuLivraison: { address: '', longitude: 0, latitude: 0 },
                  modePaiement: 'ESPECE',
                  prix: 0,
                  livraisonPaye: false,
                  zoneId: '',
                })} className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 transition-colors">
                  <PlusIcon className="h-4 w-4" /> Ajouter une commande
                </Button>

                <MapComponent markers={markers} restaurant={restaurant} />

                <SubmitButton color="primary" className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors" disabled={isSubmitting}>
                  {isSubmitting ? 'Envoi en cours...' : isEditing ? 'Mettre à jour' : 'Créer'}
                </SubmitButton>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseExterneForm;

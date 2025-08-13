'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, ScanIcon } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Camera, Upload, X, FileText, Loader2 } from 'lucide-react';
import { BreadcrumbItem, Breadcrumbs, Button } from '@heroui/react';
import { AllCommandeSchema, FormValues } from '@/src/schemas/courses.schema';
import { CommandeFormSection } from './components/CommandeFormSection';
import { MapComponent } from '../component/MapComponent';
import { Restaurant } from '@/types/models';
import { addCourseExterne } from '@/src/actions/courses.actions';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import { MarkerData } from '@/types';
import { ROUTE_COLORS } from '@/data';
import { DeliveryFee } from '@/types/restaurant';
import Tesseract from "tesseract.js";

// Liste de 20 couleurs distinctes

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

    // Fonction pour démarrer la caméra
    const startCamera = async () => {
        try {
            setError('');
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsScanning(true);
        } catch (err) {
            setError('Impossible d\'accéder à la caméra. Veuillez autoriser l\'accès ou utiliser l\'upload de fichier.');
        }
    };

    // Fonction pour arrêter la caméra
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsScanning(false);
    };

    // Fonction pour capturer une photo
    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (!video || !canvas) {
            setError('Erreur lors de la capture de l\'image');
            return;
        }

        // Vérifier que la vidéo est prête et a des dimensions valides
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            setError('La vidéo n\'est pas encore prête. Veuillez réessayer.');
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            setError('Impossible d\'initialiser le contexte canvas');
            return;
        }

        // Définir les dimensions du canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Dessiner l'image de la vidéo sur le canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convertir en blob avec une meilleure gestion d'erreur
        try {
            canvas.toBlob((blob) => {
                if (!blob) {
                    setError('Erreur lors de la création de l\'image. Veuillez réessayer.');
                    return;
                }
                const imageUrl = URL.createObjectURL(blob);
                setScannedImage(imageUrl);
                processImage(blob);
                stopCamera();
            }, 'image/jpeg', 0.9);
        } catch (error) {
            console.error('Erreur canvas.toBlob:', error);
            setError('Erreur lors de la capture. Veuillez réessayer.');
        }
    };

    // Fonction pour traiter l'upload de fichier
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(file);
            setScannedImage(imageUrl);
            processImage(file);
        }
    };

    // Fonction pour extraire le texte avec Tesseract.js
    async function extractText(imageUrl: string) {
        const { data: { text } } = await Tesseract.recognize(imageUrl, "fra"); // ou "eng"
        return text;
    }

    // Fonction pour traiter l'image et extraire le texte
    const processImage = async (imageBlob: File | Blob) => {
        setIsProcessing(true);
        setError('');
        
        try {
            // Créer une URL pour l'image
            const imageUrl = URL.createObjectURL(imageBlob);
            
            // Extraire le texte avec Tesseract.js
            const extractedTextResult = await extractText(imageUrl);
            
            // Nettoyer l'URL de l'objet
            URL.revokeObjectURL(imageUrl);
            
            setExtractedText(extractedTextResult);
        } catch (err) {
            console.error('Erreur OCR:', err);
            setError('Erreur lors de l\'extraction du texte. Veuillez réessayer.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Fonction pour recommencer
    const resetScanner = () => {
        setScannedImage(null);
        setExtractedText('');
        setError('');
        if (fileInputRef.current) {
        fileInputRef.current.value = '';
        }
    };

    const router = useRouter();
    // console.log(restaurant);
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
                    lieuLivraison: {
                        address: '',
                        longitude: 0,
                        latitude: 0,
                    },
                    modePaiement: 'ESPECE',
                    prix: 0,
                    livraisonPaye: false,
                    zoneId: '',
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'commandes',
    });


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

                    // recherche les deux adresses
                    const othersMarker = markers.filter((m, ind) => ind != index);
                    const currentMarket = markers[index];
                    setMarkers([
                        ...othersMarker,
                        {
                            start: { lat: type == 'lieuRecuperation' ? lat : currentMarket.start.lat, lng: type == 'lieuRecuperation' ? lng : currentMarket.start.lng },
                            end: { lat: type == 'lieuLivraison' ? lat : currentMarket.end.lat, lng: type == 'lieuLivraison' ? lng : currentMarket.end.lng },
                            color: currentMarket.color,
                        },
                    ]);
                }
            });
        },
        [form, markers],
    );
    // Suivre les changements de champs pour mettre à jour les marqueurs
    useEffect(() => {
        const updatedMarkers = fields
            .map((field, index) => {
                const startLat = form.watch(`commandes.${index}.lieuRecuperation.latitude`);
                const startLng = form.watch(`commandes.${index}.lieuRecuperation.longitude`);
                const endLat = form.watch(`commandes.${index}.lieuLivraison.latitude`);
                const endLng = form.watch(`commandes.${index}.lieuLivraison.longitude`);

                if (isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng)) {
                    return null;
                }
                return {
                    start: { lat: startLat, lng: startLng },
                    end: { lat: endLat, lng: endLng },
                    color: ROUTE_COLORS[index % ROUTE_COLORS.length],
                };
            })
            .filter((marker): marker is MarkerData => marker !== null);

        setMarkers(updatedMarkers);
    }, [fields, form]);

    const [state, formAction] = useFormState(
        async (prevState: any, formData: FormData) => {
            
            const result = await addCourseExterne(form.getValues(), restaurant.id);
            
            if (result.status === 'success') {
                toast.success(result.message);
                router.push('/delivery');
            } else {
                toast.error(result.message);
            }

            return result;
        },
        {
            data: null,
            message: '',
            errors: {},
            status: 'idle',
            code: undefined,
        },
    );

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-red-600">Nouvelle demande de coursier</h1>
                    <button 
                        onClick={startCamera}
                        className="bg-primary text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Camera className="h-5 w-5" /> 
                        Scan
                    </button>
                </div>

                <div className="text-sm text-gray-600">
                    <span>Mes Courses</span> / <span>Nouvelle demande de coursier</span>
                </div>
            </div>

            {/* Interface de scan */}
            {isScanning && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Scanner le document</h3>
                        <button 
                            onClick={stopCamera}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    
                    <div className="relative">
                        <video 
                            ref={videoRef}
                            autoPlay 
                            playsInline
                            className="w-full rounded-lg"
                        />
                        <div className="absolute inset-0 border-4 border-dashed border-primary rounded-lg pointer-events-none"></div>
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                        <button 
                            onClick={capturePhoto}
                            className="flex-1 bg-primary text-white py-3 px-4 rounded-md hover:bg-primary transition-colors flex items-center justify-center gap-2"
                        >
                            <Camera className="h-5 w-5" />
                            Capturer
                        </button>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Upload className="h-5 w-5" />
                            Upload
                        </button>
                    </div>
                </div>
                </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
            <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                className="hidden" 
            />

            {/* Affichage des erreurs */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                    {error}
                </div>
            )}

            {/* Affichage de l'image scannée */}
            {scannedImage && (
                <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Document scanné
                    </h3>
                    <img 
                    src={scannedImage} 
                    alt="Document scanné" 
                    className="w-full rounded-lg border shadow-md"
                    />
                    <button 
                        onClick={resetScanner}
                        className="mt-3 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors w-full"
                    >
                        Scanner un autre document
                    </button>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Texte extrait
                        {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                    </h3>
                    
                    {isProcessing ? (
                    <div className="bg-gray-50 border rounded-lg p-4 text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                        <p className="text-gray-600">Extraction du texte en cours...</p>
                    </div>
                    ) : extractedText ? (
                    <div className="bg-gray-50 border rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                            {extractedText}
                        </pre>
                        <div className="mt-4 flex gap-2">
                            <button 
                                onClick={() => navigator.clipboard.writeText(extractedText)}
                                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm"
                            >
                                Copier le texte
                            </button>
                            <button 
                                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                            >
                                Remplir automatiquement
                            </button>
                        </div>
                    </div>
                    ) : null}
                </div>
                </div>
            )}

            {/* Instructions */}
            {!scannedImage && !isScanning && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Scanner un document
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Cliquez sur le bouton "Scan" pour capturer un document avec votre caméra
                    </p>
                    <div className="flex justify-center gap-4">
                        <button 
                            onClick={startCamera}
                            className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary transition-colors flex items-center gap-2"
                        >
                            <Camera className="h-5 w-5" />
                            Ouvrir la caméra
                        </button>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gray-600 text-white py-2 px-6 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <Upload className="h-5 w-5" />
                            Choisir un fichier
                        </button>
                    </div>
                </div>
            )}

            {/* Form Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <Form {...form}>
                    <form action={formAction} className="space-y-6">
                        {fields.map((field, index) => (
                            <CommandeFormSection
                                key={field.id}
                                index={index}
                                form={form}
                                remove={remove}
                                handleAddressSelect={handleAddressSelect}
                                restaurant={restaurant}
                                fraisLivraisons={fraisLivraisons}
                            />
                        ))}

                        {/* Add Command Button */}
                        <Button
                            type="button"
                            variant="bordered"
                            className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 transition-colors"
                            onClick={() =>
                                append({
                                    numero: '',
                                    destinataire: { contact: '' },
                                    lieuRecuperation: {
                                        address: restaurant.localisation ?? '',
                                        longitude: restaurant.longitude ?? 0,
                                        latitude: restaurant.latitude ?? 0,
                                    },
                                    lieuLivraison: {
                                        address: '',
                                        longitude: 0,
                                        latitude: 0,
                                    },
                                    modePaiement: 'ESPECE',
                                    prix: 0,
                                    livraisonPaye: false,
                                    zoneId: '',
                                })
                            }
                        >
                            <PlusIcon className="h-4 w-4" />
                            Ajouter une commande
                        </Button>

                        {/* Map Component */}
                        <div className="py-4">
                            <MapComponent markers={markers} restaurant={restaurant} />
                        </div>

                        {/* Submit Button */}
                        <SubmitButton
                            color="primary"
                            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Envoi en cours...' : isEditing ? 'Mettre à jour' : 'Créer'}
                        </SubmitButton>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CourseExterneForm;

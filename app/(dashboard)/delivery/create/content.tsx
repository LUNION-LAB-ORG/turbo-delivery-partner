'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@heroui/react';
import { AllCommandeSchema, FormValues } from '@/src/schemas/courses.schema';
import { CommandeFormSection } from './components/CommandeFormSection';
import { Restaurant } from '@/types/models';
import { addCourseExterne } from '@/src/actions/courses.actions';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import { MarkerData } from '@/types';
import { ROUTE_COLORS } from '@/data';
import { DeliveryFee } from '@/types/restaurant';

export interface CourseExterneFormProps {
    initialData?: FormValues;
    isEditing?: boolean;
    restaurant: Restaurant;
    fraisLivraisons: DeliveryFee[];
}

const CourseExterneForm = ({ initialData, isEditing = false, restaurant, fraisLivraisons }: CourseExterneFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [markers, setMarkers] = useState<MarkerData[]>([]);

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
                    zoneId: fraisLivraisons.length > 0 ? String(fraisLivraisons[0].id) : "",
                    statut: 'EN_ATTENTE_RECUPERATION',       // statut par défaut
                    tempsPreparation: 15,           // temps par défaut 15 min
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({ control: form.control, name: 'commandes' });

    const handleAddressSelect = useCallback(
        (index: number, type: 'lieuRecuperation' | 'lieuLivraison') => {
            const autocomplete = new google.maps.places.Autocomplete(
                document.getElementById(`${type}-${index}`) as HTMLInputElement,
                {}
            );
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
            // On transforme tempsPreparation en cookedAt côté front
            const commandesAvecCookedAt = formData.commandes.map(cmd => {
                let cookedAt: string | null = null;
                if (cmd.statut === 'EN_PREPARATION' && cmd.tempsPreparation) {
                    cookedAt = new Date(Date.now() + cmd.tempsPreparation * 60000).toISOString();
                }
                return { ...cmd, cookedAt };
            });

            const payload = { ...formData, commandes: commandesAvecCookedAt };
            const result = await addCourseExterne(payload, restaurant.id);
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

    return (
        <div className="w-full min-h-screen bg-background">
            <div className="container mx-auto px-2 sm:px-2 lg:px-2 xl:px-4 py-4 sm:py-4 lg:py-">
                <div className="max-w-4xl mx-auto p-2 bg-white space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-red-600">Demande de TURBOY</h1>
                        <div className="text-sm text-gray-600">Mes Courses / Nouvelle Demande de TURBOY</div>
                    </div>

                    <div className="bg-white p-2 rounded-md shadow-sm">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
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

                                <Button
                                    type="button"
                                    onClick={() => append({
                                        numero: '',
                                        destinataire: { contact: '' },
                                        lieuRecuperation: { address: restaurant.localisation ?? '', longitude: restaurant.longitude ?? 0, latitude: restaurant.latitude ?? 0 },
                                        lieuLivraison: { address: '', longitude: 0, latitude: 0 },
                                        modePaiement: 'ESPECE',
                                        prix: 0,
                                        livraisonPaye: false,
                                        zoneId: fraisLivraisons.length > 0 ? String(fraisLivraisons[0].id) : "",
                                        statut: 'EN_ATTENTE_RECUPERATION',
                                        tempsPreparation: 15, // valeur par défaut
                                    })}
                                    className="w-full flex items-center justify-center rounded-md gap-2 border border-gray-300 hover:bg-gray-50 transition-colors"
                                >
                                    <PlusIcon className="h-4 w-4" /> Nouvelle Commande dans la Course
                                </Button>

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
            </div>
        </div>
    );
};

export default CourseExterneForm;

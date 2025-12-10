'use client';

import Link from 'next/link';
import { useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { Collection } from '@/types/models';
import { useRouter } from 'next/navigation';
import { title } from '@/components/primitives';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDish } from '@/src/actions/restaurant.actions';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';

import { createDishSchema, type _createDishSchema } from '@/src/schemas/restaurants.schema';

// **Import du composant AccompagnementsForm**
import AccompagnementsForm from './components/accompagnement-form';
import OptionsForm from './components/option-form';

export default function CreateDishPage({ collections }: { collections: Collection[] }) {
    const router = useRouter();

    const [state, formAction] = useFormState(
        async (_: any, formData: FormData) => {
            const result = await addDish(formData);

            if (result.status === 'success') {
                toast.success(result.message);
                router.push(`/plats/dish/${result.data?.id}`);
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

    const {
        formState: { errors },
    } = useForm<_createDishSchema>({
        resolver: zodResolver(createDishSchema),
        defaultValues: {
            collectionId: '',
            libelle: '',
            description: '',
            price: '',
            cookTime: '',
            imageUrl: undefined,
        },
    });

    const collectionOptions = collections.map(c => ({
        value: c.id,
        label: c.libelle.toUpperCase(),
    }));

    return (
        <div className="w-full h-full pb-2 px-2 flex flex-1 flex-col gap-4 lg:gap-6">
            {/* Header + Add Button */}
            <div className="flex items-center justify-between">
                <h1 className={title({ size: 'h3', class: 'text-primary' })}>Ajout d'un plat</h1>
            </div>

            <form action={formAction} className="space-y-6">
                {/* Upload image centré */}
                <div className="flex justify-center">
                    <div className="flex flex-col items-center">
                        <button
                            type="button"
                            className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 text-sm"
                        >
                            <PhotoIcon className="w-8 h-8" />
                        </button>
                        <div className="mt-2 font-semibold">Télécharger une image</div>
                    </div>
                </div>

                {/* Bloc principaux champs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sélectionner une collection
                        </label>
                        <Select
                            options={collectionOptions}
                            placeholder="Sélectionner une collection"
                            className="text-sm"
                            classNamePrefix="react-select"
                            onChange={(selectedOption) => {
                                console.log('Collection sélectionnée :', selectedOption?.value);
                            }}
                            isClearable
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom du plat
                        </label>
                        <input
                            name="libelle"
                            type="text"
                            className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Nom du plat"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prix du plat
                        </label>
                        <input
                            name="price"
                            type="number"
                            className="w-full h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="0,00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Temps de cuisson
                        </label>
                        <div className="relative">
                            <input
                                name="cookTime"
                                type="text"
                                className="w-full h-11 rounded-md border border-gray-300 px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="1h30min"
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
                                ⏱
                            </span>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description du plat
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Décrivez le plat"
                        />
                    </div>
                </div>

                {/* Section Accompagnements : ici on insère le composant */}
                <AccompagnementsForm />

                {/* Section Options */}
                <OptionsForm />

                <div className="flex justify-end pt-4">
                    <SubmitButton className="px-10 h-11 rounded-full bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white text-sm font-medium">
                        Publier
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}

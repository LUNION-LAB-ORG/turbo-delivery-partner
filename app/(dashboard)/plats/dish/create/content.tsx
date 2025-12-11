'use client';

import Link from 'next/link';
import { useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { title } from '@/components/primitives';
import { addDish } from '@/src/actions/restaurant.actions';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import { Collection } from '@/types/models';

// Sous-formulaires
import AccompagnementsForm from './components/accompagnement-form';
import OptionsForm from './components/option-form';

type OptionValue = {
    label: string;
    price: string;
};

type Option = {
    label: string;
    min: string;
    required: boolean;
    values: OptionValue[];
};

type Accompagnement = {
    label: string;
    price: string; // string → le parent convertira en number
};

export default function CreateDishPage({ collections }: { collections: Collection[] }) {
    const router = useRouter();

    // États venant des sous-composants
    const [accompagnements, setAccompagnements] = useState<Accompagnement[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [options, setOptions] = useState<Option[]>([]);

    const collectionOptions = collections.map((c) => ({
        value: c.id,
        label: c.libelle.toUpperCase(),
    }));

    /**
     * Fonction isolée pour gérer la soumission
     */
    const handleSubmitDish = async (formData: FormData) => {
        // Récupérer le fichier depuis l'input
        const imageInput = document.getElementById("imageInput") as HTMLInputElement;
        if (imageInput?.files?.[0]) {
            formData.append("imageUrl", imageInput.files[0]); // <-- Nom exact attendu par le backend
        } else {
            toast.error("Veuillez sélectionner une image du plat !");
            return;
        }

        // Inject accompagnements dynamiques
        accompagnements.forEach((acc, index) => {
            formData.append(`accompagnements[${index}].libelle`, acc.label);
            formData.append(`accompagnements[${index}].price`, acc.price);
        });

        // Inject options dynamiques
        options.forEach((opt, index) => {
            formData.append(`options[${index}].libelle`, opt.label);
            formData.append(`options[${index}].isRequired`, String(opt.required));
            formData.append(`options[${index}].maxSeleteted`, opt.min);

            opt.values.forEach((val, j) => {
                formData.append(`options[${index}].valeurs[${j}].valeur`, val.label);
                formData.append(`options[${index}].valeurs[${j}].prixSup`, val.price);
            });
        });

        const result = await addDish(formData);

        if (result.status === 'success') {
            toast.success(result.message);
            router.push(`/plats/dish/${result.data?.id}`);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="w-full h-full pb-2 px-2 flex flex-1 flex-col gap-4 lg:gap-6">
            <div className="flex items-center justify-between">
                <h1 className={title({ size: 'h3', class: 'text-primary' })}>Ajout d'un plat</h1>
            </div>

            <form
                action={handleSubmitDish}
                className="space-y-6"
            >
                {/* Upload image centré avec preview */}
                <div className="flex justify-center">
                    <div className="flex flex-col items-center">
                        {/* Input caché */}
                        <input
                            id="imageInput"
                            name="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setImagePreview(URL.createObjectURL(file));
                            }}
                        />

                        <button
                            type="button"
                            onClick={() => document.getElementById("imageInput")?.click()}
                            className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden"
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-gray-400 text-sm">
                                    <PhotoIcon className="w-8 h-8" />
                                </div>
                            )}
                        </button>

                        <div className="mt-2 font-semibold">Télécharger une image</div>
                    </div>
                </div>

                {/* Champs principaux */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sélectionner une collection
                        </label>
                        <Select
                            name="collectionId"
                            options={collectionOptions}
                            placeholder="Sélectionner une collection"
                            className="text-sm"
                            classNamePrefix="react-select"
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

                {/* Accompagnements */}
                <AccompagnementsForm onChange={setAccompagnements} />

                {/* Options */}
                <OptionsForm onChange={setOptions} />

                <div className="flex justify-end pt-4">
                    <SubmitButton className="px-10 h-11 rounded-full bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white text-sm font-medium">
                        Publier
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import { title } from '@/components/primitives';
import { updateDish } from '@/src/actions/restaurant.actions';
import { Accompaniment, Collection, DishComplet, Option } from '@/types/models';
import AccompagnementsForm from './components/accompagnement-form';
import OptionsForm from './components/option-form';


export default function Content({
    dish,
    collections,
}: {
    dish: DishComplet;
    collections: Collection[];
}) {
    const router = useRouter();

    const [accompagnements, setAccompagnements] = useState<Accompaniment[]>(
        dish.accompagnementM ?? []
    );

    const [options, setOptions] = useState<Option[]>(dish.optionPlatM ?? []);

    const [imagePreview, setImagePreview] = useState<string | null>(
        dish.platM.imageUrl ? dish.platM.imageUrl : null
    );

    const collectionOptions = collections.map((c) => ({
        value: c.id,
        label: c.libelle.toUpperCase(),
    }));

    /** SUBMIT UPDATE */
    const handleSubmitUpdate = async (formData: FormData) => {
        // image
        const imageInput = document.getElementById("imageInput") as HTMLInputElement;
        if (imageInput?.files?.[0]) {
            formData.append("imageUrl", imageInput.files[0]);
        }

        // Accompagnements
        accompagnements.forEach((acc, index) => {
            formData.append(`accompagnements[${index}].libelle`, acc.libelle);
            formData.append(`accompagnements[${index}].price`, acc.libelle);
        });

        // Options
        options.forEach((opt, index) => {
            formData.append(`options[${index}].libelle`, opt.libelle);
            formData.append(`options[${index}].isRequired`, String(opt.isRequired));
            formData.append(`options[${index}].maxSeleteted`, String(opt.maxSelected));

            opt.optionValeurs.forEach((val, j) => {
                formData.append(`options[${index}].valeurs[${j}].valeur`, val.valeur);
                formData.append(`options[${index}].valeurs[${j}].prixSup`, String(val.prixSup));
            });
        });

        const result = await updateDish(String(dish.platM.id), formData);

        if (result.status === 'success') {
            toast.success("Plat mis à jour avec succès");
            router.push(`/plats/dish/${dish.platM.id}`);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="w-full h-full pb-2 px-2 flex flex-1 flex-col gap-4 lg:gap-6">
            <div className="flex items-center justify-between">
                <h1 className={title({ size: 'h3', class: 'text-primary' })}>
                    Modification du plat
                </h1>
            </div>

            <form action={handleSubmitUpdate} className="space-y-6">
                {/* Upload image + preview */}
                <div className="flex justify-center">
                    <div className="flex flex-col items-center">
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
                            onClick={() =>
                                document.getElementById("imageInput")?.click()
                            }
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

                        <div className="mt-2 font-semibold">Changer l’image</div>
                    </div>
                </div>

                {/* FORM FIELDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Collection
                        </label>
                        <Select
                            name="collectionId"
                            defaultValue={collectionOptions.find(
                                (opt) => opt.value === dish.platM.collection?.id
                            )}
                            options={collectionOptions}
                            placeholder="Sélectionner une collection"
                            isClearable
                            classNamePrefix="react-select"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom du plat
                        </label>
                        <input
                            name="libelle"
                            defaultValue={dish.platM.libelle}
                            className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prix
                        </label>
                        <input
                            name="price"
                            type="number"
                            defaultValue={dish.platM.price}
                            className="w-full h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Temps de cuisson
                        </label>
                        <input
                            name="cookTime"
                            defaultValue={dish.platM.cookTime}
                            className="w-full h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            defaultValue={dish.platM.description}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                </div>

                {/* Sous-formulaires */}
                <AccompagnementsForm onChange={setAccompagnements} initialValues={accompagnements} />
                <OptionsForm onChange={setOptions} initialValues={options} />

                <div className="flex justify-end pt-4">
                    <SubmitButton className="px-10 h-11 rounded-full bg-gradient-to-r from-[#ff512f] to-[#dd2476] text-white text-sm font-medium">
                        Enregistrer
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}

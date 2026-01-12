'use client';

import { Option, OptionValue } from '@/types/models';
import { TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OptionsFormProps {
    onChange: (options: Option[]) => void;
    initialValues?: Option[];
}

export default function OptionsForm({ onChange, initialValues = [] }: OptionsFormProps) {
    const [options, setOptions] = useState<Option[]>(
        initialValues.length > 0
            ? initialValues
            : [
                {
                    id: '',
                    libelle: '',
                    isRequired: false,
                    maxSelected: 1,
                    optionValeurs: [{ id: '', valeur: '', prixSup: 0 }],
                },
            ]
    );

    // Sync quand initialValues change
    useEffect(() => {
        if (initialValues.length > 0) {
            setOptions(initialValues);
        }
    }, [initialValues]);

    // Remonte les valeurs au parent
    useEffect(() => {
        onChange(options);
    }, [options, onChange]);

    // Modifier une option
    const handleOptionChange = (index: number, field: keyof Option, value: string | boolean | number) => {
        const updated = [...options];
        if (field === 'isRequired' && typeof value === 'boolean') {
            updated[index].isRequired = value;
        } else if (field === 'maxSelected' && typeof value === 'string') {
            updated[index].maxSelected = Number(value);
        } else if (field === 'maxSelected' && typeof value === 'number') {
            updated[index].maxSelected = value;
        } else if (field === 'libelle' && typeof value === 'string') {
            updated[index].libelle = value;
        }
        setOptions(updated);
    };

    // Modifier une valeur d'option
    const handleValueChange = (
        optionIndex: number,
        valueIndex: number,
        field: keyof OptionValue,
        value: string
    ) => {
        const updated = [...options];

        const optionValeur = updated[optionIndex].optionValeurs[valueIndex];

        // Conversion pour prixSup
        if (field === 'prixSup') {
            optionValeur[field] = Number(value) as any; // TS comprend que c’est bien un number
        } else {
            optionValeur[field] = value as any; // TS comprend que c’est un string
        }

        setOptions(updated);
    };


    // Ajouter / supprimer option
    const handleAddOption = () => {
        setOptions([
            ...options,
            {
                id: '',
                libelle: '',
                isRequired: false,
                maxSelected: 1,
                optionValeurs: [{ id: '', valeur: '', prixSup: 0 }],
            },
        ]);
    };

    const handleRemoveOption = (index: number) => {
        const updated = options.filter((_, i) => i !== index);
        setOptions(updated.length > 0 ? updated : [
            {
                id: '',
                libelle: '',
                isRequired: false,
                maxSelected: 1,
                optionValeurs: [{ id: '', valeur: '', prixSup: 0 }],
            },
        ]);
    };

    // Ajouter / supprimer valeur d'une option
    const handleAddValue = (optionIndex: number) => {
        const updated = [...options];
        updated[optionIndex].optionValeurs.push({ id: '', valeur: '', prixSup: 0 });
        setOptions(updated);
    };

    const handleRemoveValue = (optionIndex: number, valueIndex: number) => {
        const updated = [...options];
        updated[optionIndex].optionValeurs.splice(valueIndex, 1);
        if (updated[optionIndex].optionValeurs.length === 0) {
            updated[optionIndex].optionValeurs.push({ id: '', valeur: '', prixSup: 0 });
        }
        setOptions(updated);
    };

    return (
        <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-800">Options</h2>

            {options.map((option, i) => (
                <div key={i} className="space-y-2 border-b pb-4">
                    {/* Option principale */}
                    <div className="grid grid-cols-[2fr,1fr,auto] gap-3 items-center">
                        <input
                            type="text"
                            className="h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Nom de l'option"
                            value={option.libelle}
                            onChange={(e) => handleOptionChange(i, 'libelle', e.target.value)}
                        />

                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="max"
                                value={option.maxSelected}
                                onChange={(e) => handleOptionChange(i, 'maxSelected', e.target.value)}
                            />

                            <div className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={option.isRequired}
                                    onChange={(e) => handleOptionChange(i, 'isRequired', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-2 focus:ring-red-500"
                                />
                                <span className="text-xs text-gray-500 whitespace-nowrap">Requis</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="h-11 w-11 flex items-center justify-center rounded-md border border-gray-300 text-gray-400"
                            onClick={() => handleRemoveOption(i)}
                        >
                            <TrashIcon className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>

                    {/* Valeurs de l'option */}
                    {option.optionValeurs.map((value, j) => (
                        <div key={j} className="grid grid-cols-[2fr,1fr,auto] gap-3 items-center">
                            <input
                                type="text"
                                className="h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Valeur"
                                value={value.valeur}
                                onChange={(e) => handleValueChange(i, j, 'valeur', e.target.value)}
                            />

                            <input
                                type="number"
                                className="h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Prix sup."
                                value={value.prixSup}
                                onChange={(e) => handleValueChange(i, j, 'prixSup', e.target.value)}
                            />

                            <button
                                type="button"
                                className="h-11 w-11 flex items-center justify-center rounded-md border border-gray-300 text-gray-400"
                                onClick={() => handleRemoveValue(i, j)}
                            >
                                <TrashIcon className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="inline-flex items-center justify-center px-4 h-9 rounded-full bg-gray-800 text-white text-sm"
                        onClick={() => handleAddValue(i)}
                    >
                        Ajouter une valeur
                    </button>
                </div>
            ))}

            <button
                type="button"
                className="inline-flex items-center justify-center px-4 h-9 rounded-full border border-red-500 text-red-500 text-sm"
                onClick={handleAddOption}
            >
                Ajouter une option
            </button>
        </div>
    );
}

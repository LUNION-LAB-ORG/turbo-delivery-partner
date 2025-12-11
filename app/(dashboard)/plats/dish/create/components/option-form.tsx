'use client';

import { TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OptionValue {
    label: string;
    price: string;
}

interface Option {
    label: string;
    min: string;              // devient maxSelected dans le backend
    required: boolean;        // becomes isRequired
    values: OptionValue[];    // becomes valeurs
}

export default function OptionsForm({
    onChange,
}: {
    onChange: (options: Option[]) => void;
}) {
    const [options, setOptions] = useState<Option[]>([
        { label: '', min: '1', required: false, values: [{ label: '', price: '' }] },
    ]);

    // Remonte automatiquement les options vers le parent
    useEffect(() => {
        onChange(options);
    }, [options, onChange]);

    const handleOptionChange = (
        index: number,
        field: 'label' | 'min' | 'required',
        value: string | boolean
    ) => {
        const updated = [...options];
    
        if (field === 'required') {
            updated[index].required = value as boolean;
        } else if (field === 'min') {
            updated[index].min = value as string;
        } else {
            updated[index].label = value as string;
        }
    
        setOptions(updated);
    };    

    const handleValueChange = (
        optionIndex: number,
        valueIndex: number,
        field: keyof OptionValue,
        value: string
    ) => {
        const updated = [...options];
        updated[optionIndex].values[valueIndex][field] = value;
        setOptions(updated);
    };

    const handleAddOption = () => {
        setOptions([
            ...options,
            { label: '', min: '1', required: false, values: [{ label: '', price: '' }] },
        ]);
    };

    const handleRemoveOption = (index: number) => {
        const updated = options.filter((_, i) => i !== index);
        setOptions(updated.length > 0 ? updated : [
            { label: '', min: '1', required: false, values: [{ label: '', price: '' }] },
        ]);
    };

    const handleAddValue = (optionIndex: number) => {
        const updated = [...options];
        updated[optionIndex].values.push({ label: '', price: '' });
        setOptions(updated);
    };

    const handleRemoveValue = (optionIndex: number, valueIndex: number) => {
        const updated = [...options];
        updated[optionIndex].values.splice(valueIndex, 1);

        if (updated[optionIndex].values.length === 0) {
            updated[optionIndex].values.push({ label: '', price: '' });
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
                            value={option.label}
                            onChange={(e) => handleOptionChange(i, 'label', e.target.value)}
                        />

                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="max"
                                value={option.min}
                                onChange={(e) => handleOptionChange(i, 'min', e.target.value)}
                            />

                            <div className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={option.required}
                                    onChange={(e) => handleOptionChange(i, 'required', e.target.checked)}
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
                    {option.values.map((value, j) => (
                        <div key={j} className="grid grid-cols-[2fr,1fr,auto] gap-3 items-center">
                            <input
                                type="text"
                                className="h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Valeur"
                                value={value.label}
                                onChange={(e) => handleValueChange(i, j, 'label', e.target.value)}
                            />

                            <input
                                type="number"
                                className="h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Prix sup."
                                value={value.price}
                                onChange={(e) => handleValueChange(i, j, 'price', e.target.value)}
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
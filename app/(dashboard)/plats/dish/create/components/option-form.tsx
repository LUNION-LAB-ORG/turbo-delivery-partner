'use client';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';

interface OptionValue {
    label: string;
    price: string;
}

interface Option {
    label: string;
    min: string;
    required: boolean; // <-- Ajout de cette propriété
    values: OptionValue[];
}

export default function OptionsForm() {
    const [options, setOptions] = useState<Option[]>([
        { label: '', min: '1', required: false, values: [{ label: '', price: '' }] },
    ]);

    const handleOptionChange = (
        index: number,
        field: 'label' | 'min' | 'required',
        value: string | boolean
    ) => {
        const newOptions = [...options];
    
        if (field === 'required' && typeof value === 'boolean') {
            newOptions[index].required = value;
        } else if ((field === 'label' || field === 'min') && typeof value === 'string') {
            newOptions[index][field] = value;
        }
    
        setOptions(newOptions);
    };

    const handleValueChange = (optionIndex: number, valueIndex: number, field: keyof OptionValue, value: string) => {
        const newOptions = [...options];
        newOptions[optionIndex].values[valueIndex][field] = value;
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        setOptions([
            ...options,
            { label: '', min: '1', required: false, values: [{ label: '', price: '' }] },
        ]);
    };
    

    const handleRemoveOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleAddValue = (optionIndex: number) => {
        const newOptions = [...options];
        newOptions[optionIndex].values.push({ label: '', price: '' });
        setOptions(newOptions);
    };

    const handleRemoveValue = (optionIndex: number, valueIndex: number) => {
        const newOptions = [...options];
        newOptions[optionIndex].values.splice(valueIndex, 1);
        setOptions(newOptions);
    };

    return (
        <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-800">Options</h2>

            {options.map((option, i) => (
                <div key={i} className="space-y-2">
                    {/* Option principale */}
                    <div className="grid grid-cols-[2fr,1fr,auto] gap-3 items-center">
                        <input
                            name={`options[${i}].label`}
                            type="text"
                            className="h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Libellé d'option"
                            value={option.label}
                            onChange={(e) => handleOptionChange(i, 'label', e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                            <input
                                name={`options[${i}].min`}
                                type="number"
                                className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="1"
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
                            <TrashIcon className="w-4 h-4 text-gray-400" color="red" />
                        </button>
                    </div>

                    {/* Valeurs de l'option */}
                    {option.values.map((value, j) => (
                        <div key={j} className="grid grid-cols-[2fr,1fr,auto] gap-3 items-center">
                            <input
                                name={`options[${i}].values[${j}].label`}
                                type="text"
                                className="h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Valeur"
                                value={value.label}
                                onChange={(e) => handleValueChange(i, j, 'label', e.target.value)}
                            />
                            <input
                                name={`options[${i}].values[${j}].price`}
                                type="number"
                                className="h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="0"
                                value={value.price}
                                onChange={(e) => handleValueChange(i, j, 'price', e.target.value)}
                            />
                            <button
                                type="button"
                                className="h-11 w-11 flex items-center justify-center rounded-md border border-gray-300 text-gray-400"
                                onClick={() => handleRemoveValue(i, j)}
                            >
                                <TrashIcon className="w-4 h-4 text-gray-400" color="red" />
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

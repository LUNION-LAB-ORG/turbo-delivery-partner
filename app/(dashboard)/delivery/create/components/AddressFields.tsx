import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { MapPinIcon } from 'lucide-react';

interface AddressFieldsProps {
    index: number;
    type: 'lieuRecuperation' | 'lieuLivraison';
    label: string;
    form: any;
}

export const AddressFields = ({ index, type, label, form }: AddressFieldsProps) => {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [query, setQuery] = useState('');

    // Requête vers Nominatim (gratuite)
    useEffect(() => {
        if (query.length < 3) return; // éviter les requêtes inutiles
        const controller = new AbortController();

        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ci&addressdetails=1&limit=5`, {
            signal: controller.signal,
            headers: {
                'Accept-Language': 'fr', // résultats en français
            },
        })
            .then((res) => res.json())
            .then((data) => setSuggestions(data))
            .catch(() => { });

        return () => controller.abort();
    }, [query]);

    const handleSelect = (place: any) => {
        form.setValue(`commandes.${index}.${type}.address`, place.display_name);
        form.setValue(`commandes.${index}.${type}.latitude`, parseFloat(place.lat));
        form.setValue(`commandes.${index}.${type}.longitude`, parseFloat(place.lon));
        setQuery(place.display_name);
        setSuggestions([]);
    };

    return (
        <div className="relative">
            <FormField
                control={form.control}
                name={`commandes.${index}.${type}.address`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2">
                            <MapPinIcon className="h-5 w-5 text-primary" />
                            <span>{label}</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={label}
                                autoComplete="off"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {suggestions.length > 0 && (
                <ul className="absolute bg-white border border-gray-200 mt-1 rounded-md shadow-md max-h-48 overflow-y-auto z-50 w-full">
                    {suggestions.map((place, i) => (
                        <li
                            key={i}
                            className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                            onClick={() => handleSelect(place)}
                        >
                            {place.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

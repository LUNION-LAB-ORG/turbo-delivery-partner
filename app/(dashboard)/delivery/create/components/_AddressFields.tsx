import { MapPinIcon } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';


interface AddressFieldsProps {
    index: number;
    type: 'lieuRecuperation' | 'lieuLivraison';
    label: string;
    form: any;
    handleAddressSelect: (index: number, type: 'lieuRecuperation' | 'lieuLivraison') => void;
}

export const AddressFields = ({ index, type, label, form, handleAddressSelect }: AddressFieldsProps) => {
    return (
        <div className="space-y-4">   
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
                            id={`${type}-${index}`}
                            onFocus={() => handleAddressSelect(index, type)}
                            placeholder={label}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};

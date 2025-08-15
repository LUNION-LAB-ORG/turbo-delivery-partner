import { TrashIcon } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Combobox } from '@headlessui/react';
import { useState, useEffect } from "react";
import { Button, Switch, Select, SelectItem } from '@heroui/react';
import { AddressFields } from './AddressFields';
import { InputPhone } from '@/components/ui/form-ui/input-phone';
import 'react-phone-number-input/style.css';
import { Restaurant } from '@/types/models';
import { DeliveryFee } from '@/types/restaurant';

// Options de mode de paiement
const modePaiementOptions = [
    { label: 'Espèce', value: 'ESPECE' },
    { label: 'Wave', value: 'WAVE' },
];

interface CommandeFormSectionProps {
    index: number;
    form: any;
    remove: (index: number) => void;
    handleAddressSelect: (index: number, type: 'lieuRecuperation' | 'lieuLivraison') => void;
    restaurant: Restaurant;
    fraisLivraisons: DeliveryFee[];
}

export const CommandeFormSection = ({ index, form, remove, handleAddressSelect, restaurant, fraisLivraisons }: CommandeFormSectionProps) => {

    return (
        <Card className="p-3 space-y-3 bg-background border-l-4 border-l-primary">
            <div className="flex justify-between items-center bg-muted/50 dark:bg-muted p-2 rounded-lg">
                <h3 className="text-base font-semibold text-primary">Commande {index + 1}</h3>
                {index > 0 && (
                    <Button type="button" variant="bordered" color="danger" size="sm" onClick={() => remove(index)} className="hover:bg-destructive/10 dark:hover:bg-destructive/20 h-6 min-h-0">
                        <TrashIcon className="h-3 w-3" />
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-2 space-y-3">
                    <div className="bg-card p-2 rounded-lg shadow-sm border border-border grid grid-cols-1 md:grid-cols-2 gap-2">
                        <FormField
                            control={form.control}
                            name={`commandes.${index}.prix`}
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-sm">Montant de la commande</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" min="0" step="0.01" onChange={(e) => field.onChange(parseFloat(e.target.value))} className="h-8" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`commandes.${index}.numero`}
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-sm">Numéro de commande</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="h-8" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="bg-card p-2 rounded-lg shadow-sm border border-border space-y-2">
                        <h4 className="font-semibold text-green-600 dark:text-green-400">Destinataire</h4>
                        <div className="grid grid-cols-1 gap-2">
                            <FormField
                                control={form.control}
                                name={`commandes.${index}.destinataire.contact`}
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-sm">N° du client</FormLabel>
                                        <FormControl>
                                            <InputPhone
                                                value={field.value ?? ''}
                                                setValue={(value: any) => field.onChange(value)}
                                                variant="bordered"
                                                isInvalid={!!form.formState.errors?.commandes?.[index]?.destinataire?.contact}
                                                errorMessage={form.formState.errors?.commandes?.[index]?.destinataire?.contact?.message}
                                                className="min-h-8"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="bg-green-50/50 dark:bg-green-950/30 p-2 rounded-lg shadow-sm border border-green-100 dark:border-green-900">
                            <AddressFields index={index} type="lieuLivraison" label="Aidez-nous à localiser le client" form={form} handleAddressSelect={handleAddressSelect} />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="bg-card p-2 rounded-lg shadow-sm border border-border space-y-2">
                        <div className="bg-primary/5 dark:bg-primary/10 p-2 rounded-lg">
                            <AddressFields index={index} type="lieuRecuperation" label="Lieu de récupération" form={form} handleAddressSelect={handleAddressSelect} />
                        </div>

                        <FormField
                            control={form.control}
                            name={`commandes.${index}.zoneId`}
                            render={({ field }) => {
                                const [query, setQuery] = useState("");
                                const [isOpen, setIsOpen] = useState(false);

                                // Initialiser valeur par défaut si vide
                                useEffect(() => {
                                    if (!field.value && fraisLivraisons?.length > 0) {
                                        field.onChange(fraisLivraisons[0].id);
                                    }
                                }, [field, fraisLivraisons]);

                                const filtered = query === ""
                                    ? fraisLivraisons
                                    : fraisLivraisons.filter((z) =>
                                        z.name && z.name.toLowerCase().includes(query.toLowerCase())
                                    );

                                const selectedZone = fraisLivraisons.find((z) => z.id === field.value);

                                return (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-sm">Zone de livraison</FormLabel>
                                        <Combobox
                                            value={selectedZone}
                                            onChange={(val) => val && field.onChange(val.id)}
                                        >
                                            {({ open }) => (
                                                <div className="relative">
                                                    <Combobox.Input
                                                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                        placeholder="Rechercher une zone..."
                                                        value={query}
                                                        onChange={(e) => setQuery(e.target.value)}
                                                        onFocus={() => setIsOpen(true)}
                                                        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
                                                        displayValue={(zone: DeliveryFee) => zone?.name || ""}
                                                    />
                                                    {(isOpen || open) && (
                                                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-sm shadow-lg border">
                                                            {filtered.length > 0 ? (
                                                                filtered.map((zone) => (
                                                                    <Combobox.Option
                                                                        key={zone.id}
                                                                        value={zone}
                                                                        className={({ active }) =>
                                                                            `cursor-pointer select-none px-4 py-2 ${active ? "bg-primary text-white" : "text-gray-900"}`
                                                                        }
                                                                    >
                                                                        {zone.name}
                                                                    </Combobox.Option>
                                                                ))
                                                            ) : (
                                                                <div className="px-4 py-2 text-gray-500 italic">
                                                                    Aucune zone trouvée
                                                                </div>
                                                            )}
                                                        </Combobox.Options>
                                                    )}
                                                </div>
                                            )}
                                        </Combobox>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    </div>

                    <div className="bg-card p-2 rounded-lg shadow-sm border border-border space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Autres informations</h4>
                        <div className="grid grid-cols-1 gap-2">
                            <FormField
                                control={form.control}
                                name={`commandes.${index}.modePaiement`}
                                render={({ field }) => {
                                    // Initialiser valeur par défaut si vide
                                    useEffect(() => {
                                        if (!field.value && modePaiementOptions.length > 0) {
                                            field.onChange(modePaiementOptions[0].value);
                                        }
                                    }, [field]);

                                    return (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-sm">Mode de paiement</FormLabel>
                                            <Select
                                                value={field.value}
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                    field.onChange(e.target.value)
                                                }
                                                variant="bordered"
                                                size="sm"
                                                className="h-8"
                                            >
                                                {modePaiementOptions.map((mode) => (
                                                    <SelectItem key={mode.value}>
                                                        {mode.label}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />

                            <FormField
                                control={form.control}
                                name={`commandes.${index}.livraisonPaye`}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-2 shadow-sm bg-muted/50 dark:bg-muted">
                                        <div>
                                            <FormLabel className="text-sm">Frais de livraison inclus</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onValueChange={field.onChange} className="scale-75" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default CommandeFormSection;

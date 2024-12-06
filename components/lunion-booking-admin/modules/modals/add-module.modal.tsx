'use client';

import { useState } from 'react';
import { DrawerContent, DrawerClose } from '@/components/ui/drawer';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import { Button, Divider, Input, Checkbox } from '@nextui-org/react';
import { IconPlus, IconTrash } from '@tabler/icons-react';

type Action = {
    name: string;
    title?: string;
    description?: string;
    is_public: boolean;
};

export default function AddModulModal() {
    const [moduleTitle, setModuleTitle] = useState('');
    const [moduleName, setModuleName] = useState('');
    const [moduleDescription, setModuleDescription] = useState('');
    const [actions, setActions] = useState<Action[]>([{ name: '', is_public: false, description: '', title: '' }]);

    const handleActionChange = (index: number, field: keyof Action, value: any) => {
        const updatedActions = [...actions];
        updatedActions[index][field] = value as never;
        setActions(updatedActions);
    };

    const addActionField = () => {
        setActions([...actions, { name: '', is_public: false, description: '', title: '' }]);
    };

    const removeActionField = (index: number) => {
        const updatedActions = actions.filter((_, i) => i !== index);
        setActions(updatedActions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                title: moduleTitle,
                name: moduleName,
                description: moduleDescription || null,
                actions: actions
                    .filter((action) => action.name.trim() !== '')
                    .map((action) => ({ name: action.name.trim(), title: action.title?.trim(), description: action.description?.trim(), is_public: action.is_public })),
            };
            // Remplacez par votre logique d'envoi
            console.log('Payload:', payload);
        } catch (error) {
            console.error('Erreur lors de la création du module:', error);
        }
    };

    return (
        <DrawerContent>
            <form onSubmit={handleSubmit} className="h-full">
                <div className="h-[calc(100vh-4rem)] relative gap-6 px-4 mx-auto w-full max-w-screen-md">
                    <div className="mb-2">
                        <h2 className="text-lg font-bold text-primary">Ajouter un module</h2>
                        <p className="text-sm text-gray-500">Ajoutez un module ainsi que ses actions.</p>
                    </div>
                    <Divider className="my-2" />
                    <div className="flex flex-col gap-4">
                        <Input label="Titre du module" value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} placeholder="Saisissez le titre du module" required />
                        <Input label="Nom du module" value={moduleName} onChange={(e) => setModuleName(e.target.value)} placeholder="Saisissez le nom du module" required />
                        <Input
                            label="Description du module (optionnelle)"
                            value={moduleDescription}
                            onChange={(e) => setModuleDescription(e.target.value)}
                            placeholder="Ajoutez une description (facultative)"
                        />
                    </div>
                    <Divider className="my-4" />
                    <h2 className="text-lg font-semibold text-primary mb-2">Actions</h2>
                    <div className="overflow-y-auto" style={{ maxHeight: '40vh', paddingBottom: '1rem' }}>
                        {actions.map((action, index) => (
                            <div key={index} className="flex flex-col gap-4 mb-4">
                                <Input value={action.name} onChange={(e) => handleActionChange(index, 'name', e.target.value)} placeholder="Nom de l'action" required />
                                <Input value={action.title || ''} onChange={(e) => handleActionChange(index, 'title', e.target.value)} placeholder="Titre de l'action (optionnel)" />
                                <Input value={action.description || ''} onChange={(e) => handleActionChange(index, 'description', e.target.value)} placeholder="Description de l'action (optionnel)" />
                                <div className="flex items-center gap-4">
                                    <Checkbox isSelected={action.is_public} onChange={(isChecked) => handleActionChange(index, 'is_public', isChecked)}>
                                        Publique
                                    </Checkbox>
                                    {index > 0 && (
                                        <Button isIconOnly onClick={() => removeActionField(index)} color="danger" variant="flat">
                                            <IconTrash className="size-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button isIconOnly onClick={addActionField} className="mt-2">
                        <IconPlus className="size-4" />
                    </Button>
                    <Divider className="my-4" />
                    <div className="flex justify-between items-center gap-2 py-2">
                        <DrawerClose asChild>
                            <Button>Annuler</Button>
                        </DrawerClose>
                        <SubmitButton className="w-fit">Ajouter</SubmitButton>
                    </div>
                </div>
            </form>
        </DrawerContent>
    );
}

'use client';

import React, { useState } from 'react';
import { Input, Button, Card, CardBody, Checkbox, Divider } from '@nextui-org/react';
import { DrawerClose, DrawerContent } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import { title } from '@/components/primitives';
import { createRole } from '@/src/actions/roles.actions';
import { toast } from 'react-toastify';
import { Module } from '@/types/models';
import { SelectedPermissions } from '@/types';
import { useFormState } from 'react-dom';
import { _createRoleSchema, createRoleSchema } from '@/src/schemas/roles.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import TooltipDescription from './tooltip-description';
import { useRouter } from 'next/navigation';
import { PageSidebar } from '@/components/layouts/page-sidebar';

export default function RoleAddContent({ reference, modules }: { reference: string; modules: Module[] }) {
    const router = useRouter();
    const [selectedModuleId, setSelectedModuleId] = useState(modules[0]?.id);
    const [roleName, setRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<SelectedPermissions>({});

    const handleModuleCheckboxChange = (moduleId: string, checked: boolean) => {
        setSelectedPermissions((prev) => ({
            ...prev,
            [moduleId]: {
                all: checked,
                actions: checked ? modules.find((m) => m.id === moduleId)?.actions?.map((a) => a.id) || [] : [],
            },
        }));
    };

    const handleActionCheckboxChange = (moduleId: string, actionId: string, checked: boolean) => {
        setSelectedPermissions((prev) => {
            const moduleActions = modules.find((m) => m.id === moduleId)?.actions || [];
            const currentActions = checked ? [...(prev[moduleId]?.actions || []), actionId] : (prev[moduleId]?.actions || []).filter((id) => id !== actionId);

            return {
                ...prev,
                [moduleId]: {
                    all: currentActions.length === moduleActions.length,
                    actions: currentActions,
                },
            };
        });
    };
    
    const [, formAction] = useFormState(
        async (prevState: any, _formData: FormData) => {
            const formData = new FormData();
            formData.append('name', roleName);
            formData.append('permissions', JSON.stringify(selectedPermissions));

            const result = await createRole(formData, reference);

            if (result.status === 'success') {
                toast.success(result.message);
                router.refresh();
                setRoleName('');
                setSelectedPermissions({});
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
    } = useForm<_createRoleSchema>({
        resolver: zodResolver(createRoleSchema),
        defaultValues: {
            name: '',
            permissions: '',
        },
    });

    return (
        <DrawerContent>
            <form action={formAction} className="h-full">
                <div className="flex h-[calc(100vh-4rem)] relative gap-6 px-4">
                    <PageSidebar items={modules.map((module) => ({ id: module.id, title: module.title }))} selectedItemId={selectedModuleId} onItemSelect={setSelectedModuleId} />
                    <div className="flex-1">
                        <div className="mb-2">
                            <h2 className={title({ size: 'h3', className: 'text-primary' })}>Ajouter un rôle</h2>
                            <p className="text-sm text-gray-500">Ajoutez un rôle pour gérer les permissions des utilisateurs.</p>
                        </div>
                        <Divider className="my-2" />

                        <Input label="Nom du rôle" className='mb-4' labelPlacement="inside" value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="Saisissez le nom du rôle" required />

                        <h2 className="text-lg font-semibold text-primary mb-2">Choisir les autorisations</h2>
                        <ScrollArea className="h-[calc(100%-16rem)] bg-background pb-12">
                            {modules.map((module) => (
                                <Card key={module.id} id={`${module.id}`} shadow="none" className={`mt-4 border ${selectedModuleId === module.id ? 'border-primary' : ''}`}>
                                    <CardBody className="p-4 space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`module-${module.id}`}
                                                isSelected={selectedPermissions[module.id]?.all}
                                                onValueChange={(checked) => handleModuleCheckboxChange(module.id, checked as boolean)}
                                                className="font-medium"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {module.title} <TooltipDescription description={module.description || ''} />
                                                </div>
                                            </Checkbox>
                                        </div>

                                        <div className="ml-6 space-y-2">
                                            {module.actions?.map((action) => (
                                                <div key={action.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`action-${action.id}`}
                                                        isSelected={selectedPermissions[module.id]?.actions.includes(action.id)}
                                                        onValueChange={(checked) => handleActionCheckboxChange(module.id, action.id, checked as boolean)}
                                                        className="font-medium"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {action.title || action.name} <TooltipDescription description={action.description || ''} />
                                                        </div>
                                                    </Checkbox>
                                                </div>
                                            ))}
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </ScrollArea>
                        <div className="flex w-full items-center gap-2 py-2">
                            <DrawerClose asChild>
                                <Button>Annuler</Button>
                            </DrawerClose>
                            <SubmitButton className="w-fit">Ajouter</SubmitButton>
                        </div>
                    </div>
                </div>
            </form>
        </DrawerContent>
    );
}

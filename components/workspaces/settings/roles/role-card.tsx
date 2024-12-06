'use client';

import { Module, Role } from '@/types/models';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button, Card, CardHeader } from '@nextui-org/react';
import dayjs from 'dayjs';
import TooltipDescription from './tooltip-description';
import { ScrollArea } from '@/components/ui/scroll-area';
import RoleCardTools from './role-card.tools';

export default function RoleCard({ role, modules }: { role: Role; modules: Module[] }) {
    const groupPermissionsByModule = () => {
        const grouped = role?.role_actions?.reduce(
            (acc, { action }) => {
                const moduleName = action.module.title;
                if (!acc[moduleName]) {
                    acc[moduleName] = [];
                }
                acc[moduleName].push(action);
                return acc;
            },
            {} as Record<string, (typeof role.role_actions)[number]['action'][]>,
        );

        return grouped;
    };

    const groupedPermissions = groupPermissionsByModule();
    const moduleCount = groupedPermissions ? Object.keys(groupedPermissions).length : 0;

    return (
        <Card className="p-4 shadow-lg rounded-lg">
            <CardHeader className="flex flex-col items-start justify-between gap-2 mb-4">
                <div className="flex w-full justify-between items-start gap-2">
                   <div>
                   <h3 className="text-lg font-bold items-center">
                        {role.name}
                    </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Créé le {dayjs(role.created_at).format('DD MMM YYYY')}</p>
                   </div>
                    <span className={`ml-2 rounded px-2 py-1 text-xs ${!role.is_predefined ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {role.is_predefined ? 'Prédéfini' : 'Personnalisé'}
                    </span>
                </div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex gap-4">
                    <span>
                        {moduleCount} module{moduleCount > 1 ? 's' : ''}
                    </span>
                    <span>
                        {role?.role_actions?.length} autorisation{role?.role_actions?.length! > 1 ? 's' : ''}
                    </span>
                </div>
            </CardHeader>

            <Drawer>
                <DrawerTrigger asChild>
                    <Button size="sm" color="primary" className="w-full">
                        Voir les permissions
                    </Button>
                </DrawerTrigger>
                <DrawerContent className="p-6">
                    <DrawerHeader className="text-center">
                        <DrawerTitle className="text-2xl font-bold">{role.name} - Autorisations</DrawerTitle>
                        <DrawerDescription className="text-gray-500">
                            {moduleCount} module{moduleCount > 1 ? 's' : ''} • {role?.role_actions?.length} autorisation{role?.role_actions?.length! > 1 ? 's' : ''}
                        </DrawerDescription>
                    </DrawerHeader>
                    <ScrollArea className={`${role?.role_actions && role?.role_actions?.length > 1 ? 'h-[calc(100vh-20rem)]' : ''} bg-background pb-12`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                            {groupedPermissions &&
                                Object.entries(groupedPermissions).map(([moduleName, actions]) => (
                                    <div key={moduleName} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                                        <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700">
                                            <h4 className="text-base font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                                {moduleName}
                                                <TooltipDescription description={actions[0].module.description || ''} />
                                            </h4>
                                        </div>
                                        <ul className="p-3 space-y-2">
                                            {actions.map((action) => (
                                                <li key={action.name} className="text-sm text-gray-700 flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span className="font-medium mr-2">{action.title}</span>
                                                    <span className="text-gray-500 text-xs">
                                                        <TooltipDescription description={action.description} />
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                        </div>
                    </ScrollArea>
                </DrawerContent>
            </Drawer>

            <RoleCardTools role={role} modules={modules} />
        </Card>
    );
}

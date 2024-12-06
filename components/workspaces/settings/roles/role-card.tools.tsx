'use client';

import { Drawer, DrawerTrigger } from '@/components/ui/drawer';
import { Role } from '@/types/models';
import { Button, useDisclosure } from '@nextui-org/react';
import { IconCopy, IconEdit, IconTrash } from '@tabler/icons-react';
import { Module } from '@/types/models';
import RoleEditContent from './role-edit-content';
import DeleteRoleModal from './modals/delete-role.modal';
import DuplicateRoleModal from './modals/duplicate-role.modal';

export default function RoleCardTools({ role, modules }: { role: Role; modules: Module[] }) {
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
    const { isOpen: isOpenDuplicate, onOpen: onOpenDuplicate, onClose: onCloseDuplicate } = useDisclosure();

    return (
        <div className="flex justify-center gap-2 items-center mt-4">
            <Drawer>
                <DrawerTrigger asChild>
                    <Button isIconOnly size="sm" variant="bordered" isDisabled={role.is_predefined} color="default" onPress={() => {}}>
                        <IconEdit size={16} />
                    </Button>
                </DrawerTrigger>
                <RoleEditContent role={role} modules={modules || []} />
            </Drawer>
            <Button isIconOnly size="sm" variant="bordered" isDisabled={role.is_predefined} color="success" onPress={onOpenDuplicate}>
                <IconCopy size={16} />
            </Button>
            <Button isIconOnly size="sm" variant="bordered" isDisabled={role.is_predefined} color="danger" onPress={onOpenDelete}>
                <IconTrash size={16} />
            </Button>
            <DeleteRoleModal open={isOpenDelete} onClose={onCloseDelete} role={role} />
            <DuplicateRoleModal open={isOpenDuplicate} onClose={onCloseDuplicate} role={role} />
        </div>
    );
}

import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, SortDescriptor, Chip } from '@nextui-org/react';
import { TrashIcon } from '@radix-ui/react-icons';
import { IconSearch } from '@tabler/icons-react';
import { Invitation } from '@/types/models';
import { deleteInvitation } from '@/src/actions/invitations.actions';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function InvitationOutgoing({ invitations }: { invitations: Invitation[] | null }) {
    const [filterValue, setFilterValue] = React.useState('');
    const router = useRouter();
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: 'date',
        direction: 'ascending',
    });

    const columns = [
        { name: 'EMAIL', uid: 'email', sortable: true },
        { name: 'ROLE', uid: 'role', sortable: true },
        { name: 'STATUS', uid: 'status', sortable: true },
        { name: 'DATE', uid: 'date', sortable: true },
        { name: 'ACTIONS', uid: 'actions' },
    ];

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = columns;

    const filteredItems = React.useMemo(() => {
        let filteredInvitations = invitations || [];

        if (hasSearchFilter) {
            filteredInvitations = filteredInvitations.filter((invitation) => invitation.email.toLowerCase().includes(filterValue.toLowerCase()));
        }

        return filteredInvitations;
    }, [invitations, filterValue]);

    const sortedItems = React.useMemo(() => {
        return [...filteredItems].sort((a: Invitation, b: Invitation) => {
            let first, second;
            switch (sortDescriptor.column) {
                case 'email':
                    first = a.email;
                    second = b.email;
                    break;
                case 'role':
                    first = a.role?.name ?? '';
                    second = b.role?.name ?? '';
                    break;
                case 'status':
                    first = a.status;
                    second = b.status;
                    break;
                case 'date':
                    first = a.created_at;
                    second = b.created_at;
                    break;
                default:
                    first = a.email;
                    second = b.email;
            }

            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === 'descending' ? -cmp : cmp;
        });
    }, [sortDescriptor, filteredItems]);

    const renderCell = React.useCallback((invitation: Invitation, columnKey: React.Key) => {
        switch (columnKey) {
            case 'email':
                return invitation.email;
            case 'role':
                return invitation.role?.name ?? '';
            case 'status':
                return (
                    <Chip color={invitation.status === 'PENDING' ? 'warning' : invitation.status === 'ACCEPTED' ? 'success' : 'default'} variant="dot">
                        {invitation.status}
                    </Chip>
                );
            case 'date':
                return new Date(invitation.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });
            case 'actions':
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Button
                            color="danger"
                            size="sm"
                            startContent={<TrashIcon />}
                            variant="light"
                            onPress={async () => {
                                const res = await deleteInvitation(invitation.id);
                                if (res.status === 'success') {
                                    toast.success('Invitation annulée avec succès');
                                    router.refresh();
                                } else {
                                    toast.error('Erreur lors de l&apos;annulation de l&apos;invitation');
                                }
                            }}
                        >
                            Annuler
                        </Button>
                    </div>
                );
            default:
                return '';
        }
    }, []);

    const onSearchChange = React.useCallback((value: string) => {
        setFilterValue(value);
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Rechercher par nom, email..."
                        startContent={<IconSearch />}
                        value={filterValue}
                        onClear={() => setFilterValue('')}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <span className="text-default-400 text-small">Total {invitations?.length || 0} invitations</span>
                    </div>
                </div>
            </div>
        );
    }, [filterValue, onSearchChange, invitations]);

    return (
        <Table
            isHeaderSticky
            aria-label="Invitations table"
            classNames={{
                wrapper: 'max-h-[500px]',
            }}
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'} allowsSorting={column.sortable}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={'Aucune invitation trouvée'} items={sortedItems}>
                {(item) => <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
            </TableBody>
        </Table>
    );
}

'use client';

import React from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    User,
    Pagination,
    Selection,
    SortDescriptor,
    useDisclosure,
} from '@nextui-org/react';
import { ChevronDownIcon, DotsVerticalIcon } from '@radix-ui/react-icons';
import { TbSearch } from 'react-icons/tb';

import { capitalize } from '@/utils/string-format';
import { Member } from '@/types/models';
import InitializePasswordMemberModal from './modals/initilaze-password-member.modal';
import DeleteMemberModal from './modals/delete-member.modal';

const columns = [
    { name: 'NAME', uid: 'name', sortable: true },
    { name: 'EMAIL', uid: 'email', sortable: true },
    { name: 'ROLE', uid: 'role', sortable: true },
    { name: 'ORGANIZATION', uid: 'organization', sortable: true },
    { name: 'ACTIONS', uid: 'actions' },
];

const INITIAL_VISIBLE_COLUMNS = ['name', 'email', 'role', 'actions'];

export default function MembersTable({ members }: { members: Member[] | null }) {
    const [filterValue, setFilterValue] = React.useState('');
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: 'name',
        direction: 'ascending',
    });
    const [page, setPage] = React.useState(1);

    // If members is null, use an empty array
    const membersList = members || [];
    const pages = Math.ceil(membersList.length / rowsPerPage);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === 'all') return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredMembers = [...membersList];

        if (hasSearchFilter) {
            filteredMembers = filteredMembers.filter(
                (member) =>
                    member.profile.first_name?.toLowerCase().includes(filterValue.toLowerCase()) ||
                    member.profile.last_name?.toLowerCase().includes(filterValue.toLowerCase()) ||
                    member.profile.email?.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }

        return filteredMembers;
    }, [membersList, filterValue]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: Member, b: Member) => {
            const first = a.profile.first_name;
            const second = b.profile.first_name;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === 'descending' ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const { isOpen: isOpenInitializePasswordMemberModal, onOpen: onOpenInitializePasswordMemberModal, onClose: onCloseInitializePasswordMemberModal } = useDisclosure();
    const { isOpen: isOpenDeleteMemberModal, onOpen: onOpenDeleteMemberModal, onClose: onCloseDeleteMemberModal } = useDisclosure();
    const [memberSelected, setMemberSelected] = React.useState('');
    const renderCell = React.useCallback((member: Member, columnKey: React.Key) => {
        switch (columnKey) {
            case 'name':
                return (
                    <User
                        name={`${member.profile.first_name} ${member.profile.last_name}`}
                        description={member.profile.email}
                        avatarProps={{
                            src: member.profile.avatar_url ?? '',
                        }}
                    />
                );
            case 'email':
                return member.profile.email;
            case 'role':
                return member.role.name;
            case 'organization':
                return member.organisation.name;
            case 'actions':
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown className="bg-background border-1 border-default-200">
                            <DropdownTrigger>
                                <Button isIconOnly radius="full" size="sm" variant="light">
                                    <DotsVerticalIcon className="text-default-400" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem
                                    onPress={() => {
                                        setMemberSelected(member.id);
                                        onOpenInitializePasswordMemberModal();
                                    }}
                                >
                                    Rénitialiser le mot de passe
                                </DropdownItem>
                                <DropdownItem
                                    onPress={() => {
                                        setMemberSelected(member.id);
                                        onOpenDeleteMemberModal();
                                    }}
                                >
                                    Supprimer le membre
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return '';
        }
    }, []);

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue('');
        }
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        classNames={{
                            base: 'w-full sm:max-w-[44%]',
                            inputWrapper: 'border-1',
                        }}
                        placeholder="Search by name or email..."
                        size="sm"
                        startContent={<TbSearch className="text-default-300" />}
                        value={filterValue}
                        variant="bordered"
                        onClear={() => setFilterValue('')}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {membersList.length} members</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select className="bg-transparent outline-none text-default-400 text-small" onChange={onRowsPerPageChange}>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [filterValue, visibleColumns, onSearchChange, onRowsPerPageChange, membersList.length]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex gap-4 justify-between items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: 'bg-foreground text-background',
                    }}
                    color="default"
                    isDisabled={hasSearchFilter}
                    page={page}
                    total={pages}
                    variant="light"
                    onChange={setPage}
                />
                <span className="text-small text-default-400">
                    {selectedKeys === 'all' ? 'All items selected' : `${selectedKeys instanceof Set ? selectedKeys.size : 0} of ${items.length} selected`}
                </span>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    const classNames = React.useMemo(
        () => ({
            wrapper: ['max-h-[382px]', 'max-w-3xl'],
            th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
            td: [
                'group-data-[first=true]:first:before:rounded-none',
                'group-data-[first=true]:last:before:rounded-none',
                'group-data-[middle=true]:before:rounded-none',
                'group-data-[last=true]:first:before:rounded-none',
                'group-data-[last=true]:last:before:rounded-none',
            ],
        }),
        [],
    );

    return (
        <>
            <Table
                isCompact
                isHeaderSticky
                removeWrapper
                aria-label="Members table"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                checkboxesProps={{
                    classNames: {
                        wrapper: 'after:bg-foreground after:text-background text-background',
                    },
                }}
                classNames={classNames}
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'} allowsSorting={column.sortable}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={'No members found'} items={sortedItems}>
                    {(item) => <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
                </TableBody>
            </Table>

            <InitializePasswordMemberModal open={isOpenInitializePasswordMemberModal} onClose={onCloseInitializePasswordMemberModal} id={memberSelected} />
            <DeleteMemberModal open={isOpenDeleteMemberModal} onClose={onCloseDeleteMemberModal} id={memberSelected} />
        </>
    );
}

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  User,
  SortDescriptor,
} from "@nextui-org/react";
import { Invitation } from "@/types/models";
import { IconCheck, IconX } from "@tabler/icons-react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { acceptInvitation, rejectInvitation } from "@/src/actions/invitations.actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function InvitationTable({ 
  invitations 
}: { 
  invitations: Invitation[] | null 
}) {
  const router = useRouter();
  // State for filtering and sorting
  const [filterValue, setFilterValue] = React.useState("");
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "organisation",
    direction: "ascending",
  });

  // Columns definition
  const columns = [
    { name: "ORGANISATION", uid: "organisation", sortable: true },
    { name: "ROLE", uid: "role", sortable: true },
    { name: "DATE", uid: "created_at", sortable: true },
    { name: "ACTIONS", uid: "actions", sortable: false },
  ];

  // Filtering logic
  const filteredItems = React.useMemo(() => {
    if (!invitations) return [];

    return invitations.filter((invitation) =>
      invitation.organisation?.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [invitations, filterValue]);

  // Sorting logic
  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const columnKey = sortDescriptor.column as keyof Invitation;
      let first, second;

      switch (columnKey) {
        case 'organisation':
          first = a.organisation?.name ?? '';
          second = b.organisation?.name ?? '';
          break;
        case 'role':
          first = a.role?.name ?? '';
          second = b.role?.name ?? '';
          break;
        case 'created_at':
          first = new Date(a.created_at);
          second = new Date(b.created_at);
          break;
        default:
          first = a[columnKey];
          second = b[columnKey];
      }

      const cmp = (first ?? '') < (second ?? '') ? -1 : (first ?? '') > (second ?? '') ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  // Render cell content
  const renderCell = React.useCallback(
    (invitation: Invitation, columnKey: React.Key) => {
      switch (columnKey) {
        case "organisation":
          return (
            <User
              avatarProps={{ 
                radius: "lg", 
                src: invitation.organisation?.logo || undefined 
              }}
              description={invitation.email}
              name={invitation.organisation?.name || 'N/A'}
            />
          );
        case "role":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {invitation.role?.name || 'N/A'}
              </p>
            </div>
          );
        case "created_at":
          return (
            <div className="text-small text-default-500">
              {new Date(invitation.created_at).toLocaleDateString()}
            </div>
          );
        case "actions":
          return (
            <div className="flex justify-end gap-2">
              <Button
                color="success"
                size="sm"
                startContent={<IconCheck size={16} />}
                variant="light"
                onPress={async () => {
                  const res = await acceptInvitation(invitation.id);
                  if (res.status === 'success') {
                      toast.success('Invitation acceptée avec succès');
                      router.refresh();
                  } else {
                      toast.error('Erreur lors de l&apos;acceptation de l&apos;invitation');
                  }
              }}
              >
                Accept
              </Button>
              <Button
                color="danger"
                size="sm"
                startContent={<IconX size={16} />}
                variant="light"
                onPress={async () => {
                  const res = await rejectInvitation(invitation.id);
                  if (res.status === 'success') {
                      toast.success('Invitation annulée avec succès');
                      router.refresh();
                  } else {
                      toast.error('Erreur lors de l&apos;annulation de l&apos;invitation');
                  }
              }}
              >
                Decline
              </Button>
            </div>
          );
        default:
          return null;
      }
    },
    [],
  );

  // Search input and filtering
  const topContent = React.useMemo(() => (
    <div className="flex flex-col gap-4">
      <Input
        isClearable
        className="w-full sm:max-w-[44%]"
        placeholder="Rechercher par organisation..."
        startContent={<MagnifyingGlassIcon />}
        value={filterValue}
        onClear={() => setFilterValue("")}
        onValueChange={setFilterValue}
      />
    </div>
  ), [filterValue]);

  // Render the table
  return (
    <Table
      isHeaderSticky
      aria-label="Invitation table"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="inside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody 
        emptyContent="No invitations found" 
        items={sortedItems}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
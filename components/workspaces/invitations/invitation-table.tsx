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
import { CheckIcon, TrashIcon } from "@radix-ui/react-icons";
import { IconSearch } from "@tabler/icons-react";

type Invitation = {
  id: number;
  team: string;
  role: string;
  date: string;
  logo: string;
};

export default function InvitationTable() {
  const [filterValue, setFilterValue] = React.useState("");

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "team",
    direction: "ascending",
  });

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = columns.filter((column) =>
    ["team", "role", "actions"].includes(column.uid),
  );

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...inivitations];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((invitation) =>
        invitation.team.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [filterValue]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: Invitation, b: Invitation) => {
      const first = a[sortDescriptor.column as keyof Invitation];
      const second = b[sortDescriptor.column as keyof Invitation];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const renderCell = React.useCallback(
    (invitation: Invitation, columnKey: React.Key) => {
      const cellValue = invitation[columnKey as keyof Invitation];

      switch (columnKey) {
        case "team":
          return (
            <User
              avatarProps={{ radius: "lg", src: invitation.logo }}
              className="w-40"
              description={invitation.date}
              name={cellValue}
            >
              {invitation.team}
            </User>
          );
        case "role":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Button
                color="success"
                size="sm"
                startContent={<CheckIcon />}
                variant="light"
              >
                Accepter
              </Button>
              <Button
                color="danger"
                size="sm"
                startContent={<TrashIcon />}
                variant="light"
              >
                Refuser
              </Button>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Rechercher par nom..."
            startContent={<IconSearch />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    );
  }, [filterValue, onSearchChange]);

  return (
    <Table
      isHeaderSticky
      aria-label="Invitation table for user"
      classNames={{
        wrapper: "after:bg-foreground after:text-background text-background",
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="inside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
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
      <TableBody emptyContent={"No invitation found"} items={sortedItems}>
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

export const columns = [
  { name: "TEAM", uid: "team", sortable: true },
  { name: "ROLE", uid: "role", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const inivitations: Invitation[] = [
  {
    id: 1,
    role: "CEO",
    team: "Team Wolf",
    logo: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    date: "10 june 2024 18:31",
  },
  {
    id: 2,
    role: "Tech Lead",
    team: "Team Lion",
    logo: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    date: "10 june 2024 18:31",
  },
  {
    id: 3,
    role: "Dev",
    team: "Team Ours",
    logo: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    date: "10 june 2024 18:31",
  },
  {
    id: 4,
    role: "C.M.",
    team: "Team Beer",
    logo: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    date: "10 june 2024 18:31",
  },
];

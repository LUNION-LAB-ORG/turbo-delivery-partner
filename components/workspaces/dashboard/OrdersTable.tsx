"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Chip,
} from "@nextui-org/react";
import { TbArchive, TbPencil, TbTrash, TbUser } from "react-icons/tb";

import { title } from "@/components/primitives";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Order {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  status?: string;
  date?: string;
  product: string;
  revenue?: string;
  orders?: string;
}

const orders: Order[] = [];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export const Orders = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col">
          <h4
            className={title({
              size: "h4",
            })}
          >
            Réservations
          </h4>
          <p className="text-small text-default-500">
            Nouvelles réservations
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <ScrollArea className="whitespace-nowrap">
          <Table aria-label="Orders table">
            <TableHeader>
              <TableColumn>#</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>PRODUCT</TableColumn>
              <TableColumn>REVENUE</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow key={order.id}>
                  <TableCell>#{2053 + index}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Chip color="success" variant="flat">
                      {order.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={getInitials(order.name)}
                        size="sm"
                        src={order.avatarUrl}
                      />
                      {order.name}
                    </div>
                  </TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.revenue}</TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Action menu">
                        <DropdownItem
                          startContent={<TbUser className="w-4 h-4" />}
                        >
                          View profile
                        </DropdownItem>
                        <DropdownItem
                          startContent={<TbPencil className="w-4 h-4" />}
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem
                          startContent={<TbArchive className="w-4 h-4" />}
                        >
                          Archive
                        </DropdownItem>
                        <DropdownItem
                          className="text-danger"
                          color="danger"
                          startContent={<TbTrash className="w-4 h-4" />}
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar className="h-0" orientation="horizontal" />
        </ScrollArea>
      </CardBody>
    </Card>
  );
};

export default Orders;

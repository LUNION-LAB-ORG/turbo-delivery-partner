"use client"
import { Card, CardBody, CardHeader } from "@heroui/react";
import { ReactNode } from "react";

interface Props {
    title: string;
    nombreCommande?: string;
    status?: string;
    icon?: ReactNode;
    titleClassName?: string;
    className?: string;
}

export function NextUICard(props: Props) {
    return (
        <Card className={`py-1 w-full cursor-pointer ${props.className ?? ""}`}>
            <CardHeader className="pb-0 pt-2 px-4 flex items-center justify-between">
                <p className={props.titleClassName}>{props.title}</p>
                {props.icon && <div>{props.icon}</div>}
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <div className="flex gap-2">
                    <span className="text-4xl text-gray-500 font-bold">{props.nombreCommande}</span>
                    {props.status && <span className="pt-1 text-gray-500">{props.status}</span>}
                </div>
            </CardBody>
        </Card>
    );
}

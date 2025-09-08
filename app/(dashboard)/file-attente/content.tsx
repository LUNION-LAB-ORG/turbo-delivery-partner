"use client";
import { useState } from 'react';
import { Map, Bike, Database, Clock } from 'lucide-react';
import { PageWrapper } from '@/components/commons/page-wrapper';
import { CardHeader } from '@/components/commons/card-header';
import { Card, CardBody } from "@heroui/react";
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { NextUICard } from '@/components/commons/next-ui-card';
import { FileAttenteTab } from './file-attente-tab/file-attente-tab';
import { SearchField } from '@/components/commons/form/search-field';
import { useFileAttenteController } from './controller';
import { ArchiveFileAttente, FileAttenteLivreur, StatistiqueFileAttente } from '@/types/file-attente.model';

interface Props {
    initialData: FileAttenteLivreur[];
    stattitiqueFileAttente: StatistiqueFileAttente | null;
    restaurantId?: string;
    livreurIndisponibles: FileAttenteLivreur[],
    archives: ArchiveFileAttente[]
}

export default function Content({ initialData, stattitiqueFileAttente, restaurantId, livreurIndisponibles, archives }: Props) {
    const ctrl = useFileAttenteController(initialData, stattitiqueFileAttente, livreurIndisponibles, restaurantId)
    const [searchKey, setSearchKey] = useState("");

    return (
        <PageWrapper>
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 w-full">
                <CardHeader title="File d'Attente" />

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <SearchField
                        onChange={(e: any) => setSearchKey(e.target.value)}
                        searchKey={searchKey}
                        className="w-full sm:w-64"
                    />
                    <Link href={'/trafic'} className="w-full sm:w-auto">
                        <Badge className="rounded-full px-5 py-2 cursor-pointer hover:scale-105 transition w-full sm:w-auto flex items-center justify-center">
                            <Map className="mr-2" size={20} /> Maps
                        </Badge>
                    </Link>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                <NextUICard
                    title={'Flotte de coursiers'}
                    nombreCommande={`${ctrl.statistiqueCommandes?.coursier ?? 0}`}
                    status={"En attente"}
                    icon={<Bike size={20} />}
                    titleClassName='bg-yellow-500 rounded-md px-4 py-1 text-sm text-white font-bold'
                />

                <NextUICard
                    title={'Commandes en attente'}
                    nombreCommande={`${ctrl.statistiqueCommandes?.commandeEnAttente ?? 0}`}
                    icon={<Database size={20} />}
                    titleClassName='bg-red-500 rounded-md px-4 py-1 text-sm text-white font-bold'
                />

                <Link href="/tikets-terminers/chiffre-affaire" className="block">
                    <NextUICard
                        title={'Commandes terminées'}
                        nombreCommande={`${ctrl.statistiqueCommandes?.commandeTermine ?? 0}`}
                        icon={<Database size={20} />}
                        titleClassName='bg-green-500 rounded-md px-4 py-1 text-sm text-white font-bold'
                    />
                </Link>
            </div>

            {/* TIMER CARD */}
            <div className="mt-6 w-full max-w-lg mx-auto">
                <Card className="py-4 border-0 bg-gradient-to-br from-purple-700 to-purple-900 text-white shadow-xl rounded-2xl w-full">
                    <CardBody className="flex flex-col items-center justify-center gap-3 text-center">
                        <p className="font-bold text-lg">
                            {ctrl.currentDelivery?.commande
                                ? `Commande #${ctrl.currentDelivery.commande?.numero}`
                                : `En attente d'une commande prête`}
                        </p>
                        <div className="flex items-center gap-2 text-3xl font-bold">
                            <Clock size={26} />
                            {String(ctrl.minutes).padStart(2, "0")} : {String(ctrl.seconds).padStart(2, "0")}
                        </div>
                        <div className="bg-primary px-4 py-1 rounded-full text-sm">
                            Position : <span className="font-bold">{ctrl.currentDelivery?.position ?? "-"} / 5</span>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* TABLE / TAB */}
            <div className="mt-8 w-full overflow-x-auto">
                <FileAttenteTab
                    data={ctrl.fileAttentes}
                    searchKey={searchKey}
                    timeProgressions={ctrl.timeProgressions}
                    currentDelivery={ctrl.currentDelivery}
                    livreurIndisponibles={ctrl.livreurIndispoData}
                    restaurantId={restaurantId}
                    archives={archives}
                />
            </div>
        </PageWrapper>
    );
}

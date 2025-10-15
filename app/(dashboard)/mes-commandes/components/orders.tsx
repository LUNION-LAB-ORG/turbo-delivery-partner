"use client";

import { useState, useEffect } from "react";
import { PageResponse, CommandeExterne, rechercherCommandesExterne } from "@/src/actions/commandes.actions";
import { ShoppingCart, Search, Calendar, CreditCard, MapPin, Truck, Tag, MoreVertical } from "lucide-react";
import { Button, Card, CardBody, CardFooter, CardHeader, Input } from "@heroui/react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import EmptyDataTable from "@/components/commons/EmptyDataTable";

type OrdersProps = {
    commandesInitiales: PageResponse<CommandeExterne> | null;
    session: any;
};

export default function Orders({ commandesInitiales, session }: OrdersProps) {
    const [commandes, setCommandes] = useState<PageResponse<CommandeExterne> | null>(commandesInitiales);
    const [filtered, setFiltered] = useState<CommandeExterne[]>(commandesInitiales?.content ?? []);
    const [selectedCategory, setSelectedCategory] = useState("TOUTES");
    const [currentPage, setCurrentPage] = useState(0);

    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");

    const formatDateForApi = (dateStr: string, endOfDay = false) => {
        if (!dateStr) return undefined;
        const date = new Date(dateStr);
        if (endOfDay) date.setHours(23, 59, 59, 999);
        else date.setHours(0, 0, 0, 0);
        return date.toISOString();
    };

    useEffect(() => {
        if (commandes) {
            const result = commandes.content.filter((cmd) =>
                selectedCategory === "TOUTES" ? true : cmd.statut === selectedCategory
            );
            setFiltered(result);
        }
    }, [selectedCategory, commandes]);

    const rechercher = async () => {
        const payload: any = {
            restaurantId: session?.user?.restauranID,
            page: 0,
            size: 10,
        };
        if (dateDebut) payload.start = formatDateForApi(dateDebut);
        if (dateFin) payload.end = formatDateForApi(dateFin, true);

        const response = await rechercherCommandesExterne(payload);
        if (response) {
            setCommandes(response);
            const content = response.content.filter(cmd =>
                selectedCategory === "TOUTES" ? true : cmd.statut === selectedCategory
            );
            setFiltered(content);
            setCurrentPage(0);
        }
    };

    const handlePagination = async (page: number) => {
        setCurrentPage(page);

        const payload: any = {
            restaurantId: session?.user?.restauranID,
            page: page,
            size: 10,
        };
        if (dateDebut) payload.start = formatDateForApi(dateDebut);
        if (dateFin) payload.end = formatDateForApi(dateFin, true);

        const response = await rechercherCommandesExterne(payload);
        if (response) {
            setCommandes(response);
            const content = response.content.filter(cmd =>
                selectedCategory === "TOUTES" ? true : cmd.statut === selectedCategory
            );
            setFiltered(content);
        }
    };

    function statusColor(status: string) {
        switch (status) {
            case "EN_ATTENTE_RECUPERATION": return "border-yellow-500 bg-yellow-50 text-yellow-700";
            case "EN_COURS_LIVRAISON": return "border-blue-500 bg-blue-50 text-blue-700";
            case "PRÊT": return "border-green-500 bg-green-50 text-green-700";
            case "ANNULER": return "border-red-500 bg-red-50 text-red-700";
            case "TERMINER": return "border-gray-500 bg-gray-50 text-gray-700";
            default: return "border-gray-300 bg-white text-gray-700";
        }
    }

    function ActionMenu() {
        const [open, setOpen] = useState(false);
        return (
            <div className="relative ml-2">
                <button onClick={() => setOpen(!open)} className="p-1 rounded border border-gray-300 hover:bg-gray-100">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
            </div>
        );
    }

    if (!commandes || !commandes.content.length) {
        return (
            <div className="w-full h-full p-2 space-y-2 rounded-md">
                {/* Statistiques */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {[
                        { label: "TOUTES", value: commandes?.content.length },
                        { label: "EN_ATTENTE_RECUPERATION", value: commandes?.content.filter(c => c.statut === "EN_ATTENTE_RECUPERATION").length },
                        { label: "EN_COURS_LIVRAISON", value: commandes?.content.filter(c => c.statut === "EN_COURS_LIVRAISON").length },
                        { label: "EN_ATTENTE_VERSEMENT", value: commandes?.content.filter(c => c.statut === "EN_ATTENTE_VERSEMENT").length },
                        { label: "TERMINER", value: commandes?.content.filter(c => c.statut === "TERMINER").length },
                        { label: "ANNULER", value: commandes?.content.filter(c => c.statut === "ANNULER").length },
                    ].map(stat => (
                        <Card key={stat.label} className={`col-span-1 text-center rounded-md py-2 border-l-4 ${statusColor(stat.label)}`}>
                            <span className="text-lg font-bold">{stat.value}</span>
                            <div className="text-xs text-gray-600 truncate">{stat.label.replace("_", " ")}</div>
                        </Card>
                    ))}
                </div>

                {/* Empty */}
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6">
                    <EmptyDataTable
                        title="Aucune commande trouvée"
                        message="Aucune commande correspondant à vos critères de recherche ou de filtre."
                    />
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {[
                    { label: "TOUTES", value: commandes?.content.length },
                    { label: "EN_ATTENTE_RECUPERATION", value: commandes?.content.filter(c => c.statut === "EN_ATTENTE_RECUPERATION").length },
                    { label: "EN_COURS_LIVRAISON", value: commandes?.content.filter(c => c.statut === "EN_COURS_LIVRAISON").length },
                    { label: "EN_ATTENTE_VERSEMENT", value: commandes?.content.filter(c => c.statut === "EN_ATTENTE_VERSEMENT").length },
                    { label: "TERMINER", value: commandes?.content.filter(c => c.statut === "TERMINER").length },
                    { label: "ANNULER", value: commandes?.content.filter(c => c.statut === "ANNULER").length },
                ].map(stat => (
                    <Card key={stat.label} className={`col-span-1 text-center rounded-md py-2 border-l-4 ${statusColor(stat.label)}`}>
                        <span className="text-lg font-bold">{stat.value}</span>
                        <div className="text-xs text-gray-600 truncate">{stat.label.replace("_", " ")}</div>
                    </Card>
                ))}
            </div>

            {/* Liste commandes */}
            <Card className="w-full rounded-md" shadow="sm">
                <CardHeader>
                    <div className="w-full h-full p-4 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <Input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} size="sm" label="Date début" className="flex-1 w-full"/>
                            <Input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)} size="sm" label="Date fin" className="flex-1 w-full"/>
                            <Button onPress={rechercher} size="sm" className="bg-primary text-white font-bold rounded-md h-[45px] flex-1 w-full sm:w-auto" startContent={<Search className="w-4 h-4 mr-2"/>}>Rechercher</Button>
                        </div>

                        <ScrollArea className="w-full whitespace-nowrap pb-2">
                            {["TOUTES","EN_ATTENTE_RECUPERATION","EN_COURS_LIVRAISON","EN_ATTENTE_VERSEMENT","TERMINER","ANNULER"].map(category => (
                                <Button key={category} className="flex-shrink-0 mx-2 rounded-md" variant={selectedCategory === category ? "solid" : "ghost"} color={selectedCategory === category ? "primary" : "default"} onPress={() => setSelectedCategory(category)} size="sm">
                                    {category.toUpperCase()}
                                </Button>
                            ))}
                            <ScrollBar orientation="horizontal" className="h-0"/>
                        </ScrollArea>
                    </div>
                </CardHeader>

                <CardBody>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
                        {filtered.map(cmd => (
                            <Card key={cmd.id} className={`w-full rounded-md border-l-4 ${statusColor(cmd.statut)}`}>
                                <CardBody className="p-4 flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 mb-2">
                                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                                <ShoppingCart className="w-4 h-4 text-gray-500"/>
                                                <h3 className="font-semibold text-sm">#{cmd.numero}</h3>
                                                <button className="flex items-center gap-1 px-3 py-1 rounded-md text-xs bg-black text-white font-semibold border border-gray-300">
                                                    {cmd.prix.toLocaleString()} Fcfa
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Truck className="w-4 h-4 text-gray-600"/>
                                                <span className="font-semibold">{cmd.fraisLivraison.toLocaleString()} Fcfa</span>
                                                <ActionMenu/>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-3 h-3 text-gray-400"/>
                                                <span>{cmd.zone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-3 h-3 text-gray-400"/>
                                                <span>{cmd.modePaiement}</span>
                                            </div>
                                            <button className={`flex items-center gap-1 px-3 py-1 rounded-md ${statusColor(cmd.statut)} font-semibold`}>
                                                <Tag className="w-3 h-3 text-gray-400"/>
                                                <span>{cmd.statut}</span>
                                            </button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </CardBody>

                <CardFooter>
                    <div className="w-full p-4 bg-gray flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
                        <Button disabled={currentPage <= 0} onPress={() => handlePagination(currentPage - 1)} size="sm" className="bg-primary rounded-md text-white w-full sm:w-auto">Précédent</Button>
                        <span className="text-sm">Page {commandes.number + 1} / {commandes.totalPages}</span>
                        <Button disabled={commandes.last} onPress={() => handlePagination(currentPage + 1)} size="sm" className="bg-primary rounded-md text-white w-full sm:w-auto">Suivant</Button>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}

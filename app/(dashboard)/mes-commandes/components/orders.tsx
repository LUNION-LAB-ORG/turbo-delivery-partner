"use client";

import { useState, useEffect } from "react";
import { PageResponse, CommandeExterne, rechercherCommandesExterne } from "@/src/actions/commandes.actions";
import { ShoppingCart, Search, Calendar, CreditCard, MapPin, Truck, Tag, MoreVertical, DollarSign } from "lucide-react";
import { Button, Card, CardBody, CardFooter, CardHeader, Input } from "@heroui/react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import EmptyDataTable from "@/components/commons/EmptyDataTable";

type ContentProps = {
    commandesInitiales: PageResponse<CommandeExterne> | null;
    session: any;
};

export default function Orders({ commandesInitiales, session }: ContentProps) {
    const [commandes, setCommandes] = useState<PageResponse<CommandeExterne> | null>(commandesInitiales);
    const [filtered, setFiltered] = useState<CommandeExterne[]>(commandesInitiales?.content ?? []);
    const [selectedCategory, setSelectedCategory] = useState("TOUTES");
    const [currentPage, setCurrentPage] = useState(0);

    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");

    const formatDateForApi = (dateStr: string, endOfDay = false) => {
        if (!dateStr) return undefined;
        const date = new Date(dateStr);
        if (endOfDay) {
            date.setHours(23, 59, 59, 999); // fin de journée
        } else {
            date.setHours(0, 0, 0, 0); // début de journée
        }
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

        // if (numeroCommande) payload.numeroCommande = numeroCommande;

        if (dateDebut) payload.start = formatDateForApi(dateDebut);
        if (dateFin) payload.end = formatDateForApi(dateFin, true);

        const response = await rechercherCommandesExterne(payload);
        if (response) {
            setCommandes(response);
            const content = response.content.filter((cmd) =>
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

        // if (numeroCommande) payload.numeroCommande = numeroCommande;

        if (dateDebut) payload.start = formatDateForApi(dateDebut);
        if (dateFin) payload.end = formatDateForApi(dateFin, true);

        const response = await rechercherCommandesExterne(payload);
        if (response) {
            setCommandes(response);
            const content = response.content.filter((cmd) => selectedCategory === "all" ? true : cmd.statut === selectedCategory);
            setFiltered(content);
        }
    };

    function statusColor(status: any) {
        switch (status) {
            case "EN_ATTENTE_RECUPERATION":
                return "border-yellow-500 bg-yellow-50 text-yellow-700";
            case "EN_COURS_LIVRAISON":
                return "border-blue-500 bg-blue-50 text-blue-700";
            case "PRÊT":
                return "border-green-500 bg-green-50 text-green-700";
            case "ANNULER":
                return "border-red-500 bg-red-50 text-red-700";
            case "TERMINER":
                return "border-green-500 bg-green-50 text-green-700"; // neutre et lisible
            default:
                return "border-gray-300 bg-white text-gray-700";
        }
    }
    

    function statusTagColor(status: any) {
        switch (status) {
            case "EN_ATTENTE_RECUPERATION": return "bg-yellow-100 text-yellow-800";
            case "EN_COURS_LIVRAISON": return "bg-blue-100 text-blue-800";
            case "PRÊT": return "bg-green-100 text-green-800";
            case "ANNULER": return "bg-red-100 text-red-800";
            case "TERMINER": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    }

    function ActionMenu(cmd: any) {
        const [open, setOpen] = useState(false);

        return (
            <div className="relative ml-2">
                <button onClick={() => setOpen(!open)} className="p-1 rounded border border-gray-300 hover:bg-gray-100">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>

                {/* {open && (
                    <div className="absolute right-0 mt-1 w-40 bg-white border rounded shadow-lg z-50">
                        <div className="flex flex-col gap-1 p-2">
                            {cmd.statut === "PRÊT" && <Button size="sm" color="primary">Expédier</Button>}
                            {cmd.statut === "EN_ATTENTE" && <Button size="sm" color="warning">Marquer comme prêt</Button>}
                            {cmd.statut !== "ANNULER" && <Button size="sm" color="danger">Annuler</Button>}
                            <Button size="sm" color="default">Voir détails</Button>
                        </div>
                    </div>
                )} */}
            </div>
        );
    }


    if (!commandes || !commandes.content.length) {
        return (
            <div className="w-full h-full p-2 space-y-2 rounded-md">
                {/* Statistiques par statut */}
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
                            <div className="text-[13px] text-gray-600">{stat.label.replace("_", " ")}</div>
                        </Card>
                    ))}
                </div>


                {/* Filtres de recherche */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <Input
                        type="date"
                        value={dateDebut}
                        onChange={(e) => setDateDebut(e.target.value)}
                        size="sm"
                        label="Date début"
                        className="flex-1" />
                    <Input
                        type="date"
                        value={dateFin}
                        onChange={(e) => setDateFin(e.target.value)}
                        size="sm"
                        label="Date fin"
                        className="flex-1" />

                    <Button
                        onPress={rechercher} size="sm"
                        className="bg-primary text-white text-lg font-bold rounded-md h-[45px] md:h-[45px] flex-1"
                        startContent={<Search className="w-4 h-4 mr-2" />} >
                        Rechercher
                    </Button>
                </div>

                {/* Liste des commandes */}
                <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] text-center p-6 sm:p-8">
                    <EmptyDataTable
                        title="Aucune commande trouvée"
                        message="Il semble qu'il n'y ait aucune commande correspondant à vos critères de recherche ou de filtre."
                    />
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Statistiques par statut */}
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
                        <div className="text-[10px] text-gray-600">{stat.label.replace("_", " ")}</div>
                    </Card>
                ))}
            </div>

            <Card className="w-full rounded-md" shadow="sm">
                <CardHeader>
                    <div className="w-full h-full p-4 space-y-6 rounded-md">
                        {/* Filtres de recherche */}
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <Input
                                type="date"
                                value={dateDebut}
                                onChange={(e) => setDateDebut(e.target.value)}
                                size="sm"
                                label="Date début"
                                className="flex-1"
                            />
                            <Input
                                type="date"
                                value={dateFin}
                                onChange={(e) => setDateFin(e.target.value)}
                                size="sm"
                                label="Date fin"
                                className="flex-1"
                            />
                            <Button
                                onPress={rechercher} size="sm"
                                className="bg-primary text-white text-lg font-bold rounded-md h-[45px] md:h-[45px] flex-1"
                                startContent={<Search className="w-4 h-4 mr-2" />} >
                                Rechercher
                            </Button>
                        </div>

                        {/* Filtres par statut */}
                        <ScrollArea className="w-full whitespace-nowrap pb-2">
                            {["TOUTES", "EN_ATTENTE_RECUPERATION", "EN_COURS_LIVRAISON", "EN_ATTENTE_VERSEMENT", "TERMINER", "ANNULER"].map(
                                (category) => (
                                    <Button
                                        key={category}
                                        className="flex-shrink-0 mx-2 rounded-md"
                                        variant={selectedCategory === category ? "solid" : "ghost"}
                                        color={selectedCategory === category ? "primary" : "default"}
                                        onPress={() => setSelectedCategory(category)}
                                        size="sm">
                                        {category.toUpperCase()}
                                    </Button>
                                )
                            )}
                            <ScrollBar orientation="horizontal" className="h-0" />
                        </ScrollArea>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="w-full h-full p-4 space-y-6 rounded-md">
                        {/* Liste des commandes */}
                        <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
                            {filtered.map((cmd) => (
                                <Card key={cmd.id} className={`w-full rounded-md border-l-4 ${statusColor(cmd.statut)}`}>
                                    <CardBody className="p-4 flex gap-4 flex-row items-center">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center gap-3 mb-1">
                                                {/* Partie gauche : icône commande + numéro + prix */}
                                                <div className="flex items-center gap-3">
                                                    {/* Icône commande */}
                                                    <ShoppingCart className="w-4 h-4 text-gray-500" />

                                                    {/* Numéro de commande */}
                                                    <h3 className="font-semibold text-sm">#{cmd.numero}</h3>

                                                    {/* Prix (style bouton) */}
                                                    <button className="flex items-center gap-1 px-3 py-1 rounded-md text-xs bg-black text-white font-semibold border border-gray-300">
                                                        <span>{cmd.prix.toLocaleString()} Fcfa</span>
                                                    </button>
                                                </div>

                                                {/* Partie droite : livraison + frais + menu */}
                                                <div className="flex items-center gap-2">
                                                    {/* Icône livraison */}
                                                    <Truck className="w-4 h-4 text-gray-600" />
                                                    <span className="font-semibold">{cmd.fraisLivraison.toLocaleString()} Fcfa</span>

                                                    {/* Bouton menu d'action */}
                                                    <ActionMenu />
                                                </div>
                                            </div>


                                            {/* Zone */}
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                                <MapPin className="w-3 h-3 text-gray-400" />
                                                <span>{cmd.zone}</span>
                                            </div>

                                            {/* Date */}
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                                <Calendar className="w-3 h-3 text-gray-400" />
                                                <span></span>
                                            </div>

                                            <div className="flex justify-between items-center text-xs">
                                                {/* Paiement à gauche */}
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <CreditCard className="w-3 h-3 text-gray-400" />
                                                    <span>{cmd.modePaiement}</span>
                                                </div>

                                                {/* Statut à droite */}
                                                <button className={`flex items-center gap-1 px-3 py-1 rounded-md ${statusColor(cmd.statut)} font-semibold`}>
                                                    <Tag className="w-3 h-3 text-gray-400" />
                                                    <span>{cmd.statut}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>
                </CardBody>
                <CardFooter>
                    <div className="w-full h-full p-4 space-y-6 rounded-md bg-gray">
                        {/* Pagination */}
                        <div className="flex justify-center items-center mt-4 space-x-4">
                            <Button
                                disabled={currentPage <= 0}
                                onPress={() => handlePagination(currentPage - 1)}
                                size="sm" className="bg-primary rounded-md text-white">
                                Précédent
                            </Button>
                            <span className="text-sm">Page {commandes.number + 1} / {commandes.totalPages}</span>
                            <Button
                                disabled={commandes.last}
                                onPress={() => handlePagination(currentPage + 1)}
                                size="sm" className="bg-primary rounded-md text-white">
                                Suivant
                            </Button>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}

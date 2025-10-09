"use client";

import { useState, useEffect } from "react";
import { PageResponse, CommandeExterne, rechercherCommandesExterne } from "@/src/actions/commandes.actions";
import { ShoppingCart, Search } from "lucide-react";
import { Button, Avatar, AvatarGroup, Card, CardBody, Input } from "@heroui/react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type ContentProps = {
    commandesInitiales: PageResponse<CommandeExterne> | null;
    session: any;
};

export default function Orders({ commandesInitiales, session }: ContentProps) {
    const [commandes, setCommandes] = useState<PageResponse<CommandeExterne> | null>(commandesInitiales);
    const [filtered, setFiltered] = useState<CommandeExterne[]>(commandesInitiales?.content ?? []);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(0);

    // États pour la recherche
    // const [numeroCommande, setNumeroCommande] = useState("");
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
                selectedCategory === "all" ? true : cmd.statut === selectedCategory
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
                selectedCategory === "all" ? true : cmd.statut === selectedCategory
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
            case "EN_ATTENTE_RECUPERATION": return "border-yellow-500 bg-yellow-50";
            case "EN_COURS_LIVRAISON": return "border-blue-500 bg-blue-50";
            case "PRÊT": return "border-green-500 bg-green-50";
            case "ANNULER": return "border-red-500 bg-red-50";
            case "TERMINER": return "border-gray-500 bg-gray-50";
            default: return "border-gray-300 bg-white";
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

    if (!commandes || !commandes.content.length) {
        return (
            <div className="w-full h-full p-2 space-y-2 rounded-md">
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

                {/* Liste des commandes */}
                <div className="grid gap-4 2xl:grid-cols-2">
                    <p>Aucune commande trouvée</p>
                </div>
            </div>
        );
    }

    return (
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
                {["all", "EN_ATTENTE_RECUPERATION", "EN_COURS_LIVRAISON", "EN_ATTENTE_VERSEMENT", "TERMINER", "ANNULER"].map(
                    (category) => (
                        <Button
                            key={category}
                            className="flex-shrink-0 mx-2"
                            variant={selectedCategory === category ? "solid" : "flat"}
                            color={selectedCategory === category ? "primary" : "default"}
                            onPress={() => setSelectedCategory(category)}
                            size="sm"
                        >
                            {category.toUpperCase()}
                        </Button>
                    )
                )}
                <ScrollBar orientation="horizontal" className="h-0" />
            </ScrollArea>

            {/* Liste des commandes */}
            <div className="grid gap-4 2xl:grid-cols-2">
                {filtered.map((cmd) => (
                    <Card key={cmd.id} className={`rounded-md border-l-4 ${statusColor(cmd.statut)}`}>
                        <CardBody className="p-4 flex gap-4 flex-row items-center">
                            <AvatarGroup isBordered max={1}>
                                <Avatar>
                                    <ShoppingCart className="w-4 h-4 text-gray-600" />
                                </Avatar>
                            </AvatarGroup>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-semibold text-sm">#{cmd.numero}</h3>
                                    <span className={`px-2 py-1 rounded-md text-xs ${statusTagColor(cmd.statut)}`}>{cmd.statut}</span>
                                </div>
                                <p className="text-xs text-gray-500">{cmd.zone}</p>
                                <p className="text-xs text-gray-500">Date</p>
                                <p className="text-xs text-gray-500">Paiement: {cmd.modePaiement}</p>
                            </div>
                            <div className="text-right flex flex-col gap-1 items-end">
                                <span className="font-semibold">{cmd.prix.toLocaleString()} F</span>
                                {/* Boutons d'action contextuelle */}
                                <div className="flex gap-2">
                                    {cmd.statut === "PRÊT" && <Button size="sm" color="primary">Expédier</Button>}
                                    {cmd.statut === "EN_ATTENTE" && <Button size="sm" color="warning">Marquer comme prêt</Button>}
                                    {cmd.statut !== "ANNULER" && <Button size="sm" color="danger">Annuler</Button>}
                                    <Button size="sm" color="default">Voir détails</Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-4 space-x-4">
                <Button
                    disabled={currentPage <= 0}
                    onPress={() => handlePagination(currentPage - 1)}
                    size="sm"
                    className="bg-primary rounded-md text-white"
                >
                    Précédent
                </Button>
                <span className="text-sm">
                    Page {commandes.number + 1} / {commandes.totalPages}
                </span>
                <Button
                    disabled={commandes.last}
                    onPress={() => handlePagination(currentPage + 1)}
                    size="sm"
                    className="bg-primary rounded-md text-white"
                >
                    Suivant
                </Button>
            </div>
        </div>
    );
}

import { fetchFilleAttente, fetchStatistique, livreurIndisponible } from "@/src/actions/file-attente.actions";
import { repositionnerLivreur } from "@/src/actions/restaurant.actions";
import { FileAttenteLivreur, StatistiqueFileAttente } from "@/types/file-attente.model";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function useFileAttenteController(
    initialData: FileAttenteLivreur[],
    stattitiqueFileAttente: StatistiqueFileAttente | null,
    livreurIndisponibles: FileAttenteLivreur[],
    restaurantId?: string,
) {
    const STORAGE_KEY = "file-attente-timer";

    const [tempRecuperation, setTempRecuperation] = useState<number>(() => {
        // ✅ Restauration depuis localStorage
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
                const remaining = parsed.duration - elapsed;
                return remaining > 0 ? remaining : 3 * 60;
            }
        }
        return 3 * 60;
    });

    const [currentDelivery, setCurrentDelivery] = useState<FileAttenteLivreur>();
    const [timeProgressions, setTimeProgression] = useState(0);
    const [fileAttentes, setFileAttentes] = useState<FileAttenteLivreur[]>(initialData);
    const [haseError, setHasErreur] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statistiqueCommandes, setStatistiquesCommande] = useState<StatistiqueFileAttente | null>(stattitiqueFileAttente);
    const [livreurIndispoData, setLivreurIndispoData] = useState<FileAttenteLivreur[]>(livreurIndisponibles);

    const fetchFileAttenteLivreur = async () => {
        try {
            const data = await fetchFilleAttente(restaurantId ?? '');
            setFileAttentes(data);
        } catch (error) { }
    };

    const statisqueCommande = async () => {
        try {
            const data = await fetchStatistique(restaurantId ?? '');
            setStatistiquesCommande(data);
        } catch (error) { }
    };

    const fetchLivreurIndisponible = async () => {
        try {
            const data = await livreurIndisponible(restaurantId ?? '');
            setLivreurIndispoData(data);
        } catch (error) { }
    };

    const repositionLivreur = async (livreruId: string) => {
        setLoading(true);
        try {
            const data = await repositionnerLivreur({
                livreurId: livreruId ?? ""
            });
            if (data && data.status === "success") {
                toast.success(data.message);
                resetTimer();
            } else {
                toast.error("Erreur lors de la réposition du livreur");
                setHasErreur(true);
                resetTimer();
            }
        } catch (error: any) {
            toast.error(error?.message || "Une erreur s'est produite !");
            setHasErreur(true);
        } finally {
            setLoading(false);
            statisqueCommande();
            fetchLivreurIndisponible();
        }
    };

    // ✅ Reset du timer et sauvegarde dans localStorage
    const resetTimer = () => {
        const newDuration = 3 * 60;
        setTempRecuperation(newDuration);
        setTimeProgression(0);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            startTime: Date.now(),
            duration: newDuration
        }));
    };

    useEffect(() => {
        if (!haseError && stattitiqueFileAttente?.commandeEnAttente !== 0 && stattitiqueFileAttente?.coursier !== 0 && fileAttentes.length > 0) {
            setCurrentDelivery(fileAttentes[0]);
            if (tempRecuperation === 1) {
                repositionLivreur(fileAttentes[0]?.livreurId);
                fetchFileAttenteLivreur();
            }
            const timer = setInterval(() => {
                if (!loading && !haseError) {
                    setTempRecuperation((prevTime) => {
                        const newTime = prevTime - 1;
                        // ✅ Mise à jour de localStorage en continu
                        localStorage.setItem(STORAGE_KEY, JSON.stringify({
                            startTime: Date.now() - ((3 * 60 - newTime) * 1000),
                            duration: 3 * 60
                        }));
                        return newTime;
                    });
                    setTimeProgression((prev) => prev + 0.55);
                }
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [tempRecuperation, stattitiqueFileAttente?.commandeEnAttente, loading]);

    const minutes = Math.floor(tempRecuperation / 60);
    const seconds = tempRecuperation % 60;

    return { minutes, seconds, currentDelivery, fileAttentes, timeProgressions, statistiqueCommandes, livreurIndispoData };
}

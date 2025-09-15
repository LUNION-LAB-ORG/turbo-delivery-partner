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
        if (
            !haseError &&
            stattitiqueFileAttente?.commandeEnAttente !== 0 &&
            stattitiqueFileAttente?.coursier !== 0 &&
            fileAttentes.length > 0
        ) {
            setCurrentDelivery(fileAttentes[0]);
    
            const timer = setInterval(() => {
                setTempRecuperation((prevTime) => {
                    if (prevTime <= 1) {
                        // ⏳ Quand on arrive à 0 → reposition et reset
                        repositionLivreur(fileAttentes[0]?.livreurId);
                        fetchFileAttenteLivreur();
                        return 3 * 60;
                    }
    
                    const newTime = prevTime - 1;
    
                    // ✅ Sauvegarde locale du timer
                    localStorage.setItem(STORAGE_KEY, JSON.stringify({
                        startTime: Date.now() - ((3 * 60 - newTime) * 1000),
                        duration: 3 * 60
                    }));
    
                    return newTime;
                });
    
                setTimeProgression((prev) => prev + 0.55);
            }, 1000);
    
            return () => clearInterval(timer);
        }
    }, [haseError, stattitiqueFileAttente?.commandeEnAttente, stattitiqueFileAttente?.coursier, fileAttentes.length, loading]);

    useEffect(() => {
        if (!restaurantId) return;
    
        // 🔄 Rafraîchissement automatique toutes les 15 minutes
        const interval = setInterval(async () => {
            try {
                const updatedData = await fetchFilleAttente(restaurantId);
                if (updatedData) {
                    setFileAttentes(updatedData);
                }
            } catch (error) {
                console.error("Erreur lors du rafraîchissement de la file d'attente:", error);
            }
        }, 15 * 1000); // 15 minutes en millisecondes
    
        return () => clearInterval(interval); // cleanup à la destruction du composant
    }, [restaurantId]);
    

    const minutes = Math.floor(tempRecuperation / 60);
    const seconds = tempRecuperation % 60;

    return { minutes, seconds, currentDelivery, fileAttentes, timeProgressions, statistiqueCommandes, livreurIndispoData };
}

import { LivreurDisponible } from '@/types/models';

// Interface étendue avec position
export interface LivreurAvecPosition extends LivreurDisponible {
    position: {
        latitude: number;
        longitude: number;
        commune?: string;
        quartier?: string;
        timestamp?: number;
    };
}

type ZoneNom = "Plateau" | "Cocody" | "Yopougon" | "Adjamé" | "Marcory" | "Treichville" | "Port-Bouët" | "Koumassi" | "Attécoubé" | "Abobo";

interface Zone {
    nom: ZoneNom;
}

// Zones principales d'Abidjan avec leurs coordonnées approximatives
const ZONES_ABIDJAN = [
    // Plateau (Centre des affaires)
    {
        nom: "Plateau",
        quartiers: ["Centre-ville", "Cathédrale", "Ambassades"],
        bounds: {
            north: 5.3300,
            south: 5.3150,
            east: -4.0150,
            west: -4.0350
        }
    },
    // Cocody (Résidentiel/Universitaire)
    {
        nom: "Cocody",
        quartiers: ["Riviera", "Deux-Plateaux", "Angré", "Faya"],
        bounds: {
            north: 5.3800,
            south: 5.3400,
            east: -3.9800,
            west: -4.0200
        }
    },
    // Yopougon (Populaire)
    {
        nom: "Yopougon",
        quartiers: ["Selmer", "Maroc", "Niangon", "Sicogi"],
        bounds: {
            north: 5.3500,
            south: 5.3000,
            east: -4.0800,
            west: -4.1200
        }
    },
    // Adjamé (Commercial)
    {
        nom: "Adjamé",
        quartiers: ["Liberté", "Bracodi", "Williamsville"],
        bounds: {
            north: 5.3600,
            south: 5.3300,
            east: -4.0200,
            west: -4.0500
        }
    },
    // Marcory (Sud)
    {
        nom: "Marcory",
        quartiers: ["Zone 4", "Biétry", "Anoumabo"],
        bounds: {
            north: 5.3100,
            south: 5.2800,
            east: -4.0000,
            west: -4.0300
        }
    },
    // Treichville (Port)
    {
        nom: "Treichville",
        quartiers: ["Belleville", "Nouveau Marché", "Habitat"],
        bounds: {
            north: 5.3100,
            south: 5.2900,
            east: -4.0100,
            west: -4.0300
        }
    },
    // Port-Bouët (Aéroport)
    {
        nom: "Port-Bouët",
        quartiers: ["Vridi", "Gonzagueville", "Aéroport"],
        bounds: {
            north: 5.2800,
            south: 5.2400,
            east: -3.9500,
            west: -4.0100
        }
    },
    // Koumassi (Est)
    {
        nom: "Koumassi",
        quartiers: ["Remblais", "Grand Marché", "Sicobois"],
        bounds: {
            north: 5.3200,
            south: 5.2900,
            east: -3.9700,
            west: -4.0000
        }
    },
    // Attécoubé (Ouest)
    {
        nom: "Attécoubé",
        quartiers: ["Locodjro", "Santé", "Sagbé"],
        bounds: {
            north: 5.3400,
            south: 5.3100,
            east: -4.0500,
            west: -4.0800
        }
    },
    // Abobo (Nord)
    {
        nom: "Abobo",
        quartiers: ["Baoulé", "Ananeraie", "Avocatier"],
        bounds: {
            north: 5.4200,
            south: 5.3800,
            east: -4.0200,
            west: -4.0600
        }
    }
];

/**
 * Génère une position aléatoire dans une zone donnée
 */
function genererPositionAleatoire(zone: typeof ZONES_ABIDJAN[0]) {
    const { bounds } = zone;
    
    const latitude = Math.random() * (bounds.north - bounds.south) + bounds.south;
    const longitude = Math.random() * (bounds.east - bounds.west) + bounds.west;
    const quartier = zone.quartiers[Math.floor(Math.random() * zone.quartiers.length)];
    
    return {
        latitude: parseFloat(latitude.toFixed(6)),
        longitude: parseFloat(longitude.toFixed(6)),
        commune: zone.nom,
        quartier,
        timestamp: Date.now()
    };
}

/**
 * Dispatche aléatoirement les livreurs sur Abidjan
 */
export function dispatcherLivreursAbidjan(livreurs: LivreurDisponible[]): LivreurAvecPosition[] {
    return livreurs.map(livreur => {
        // Sélection aléatoire d'une zone
        const zoneIndex = Math.floor(Math.random() * ZONES_ABIDJAN.length);
        const zone = ZONES_ABIDJAN[zoneIndex];
        
        // Génération de la position
        const position = genererPositionAleatoire(zone);
        
        return {
            ...livreur,
            position
        };
    });
}

/**
 * Dispatche les livreurs avec distribution pondérée (plus réaliste)
 */
export function dispatcherLivreursAbidjanPondere(livreurs: LivreurDisponible[]): LivreurAvecPosition[] {
    
    // Pondération des zones (basée sur la densité d'activité réelle)
    const ponderation: Record<ZoneNom, number> = {
        Plateau: 0.15,       // Centre d'affaires - forte demande
        Cocody: 0.20,        // Zone résidentielle aisée - forte demande
        Yopougon: 0.15,      // Zone populaire - demande moyenne
        Adjamé: 0.12,        // Zone commerciale - demande élevée
        Marcory: 0.10,       // Zone mixte
        Treichville: 0.08,   // Zone portuaire
        "Port-Bouët": 0.05,  // Zone aéroport
        Koumassi: 0.07,      // Zone industrielle
        Attécoubé: 0.04,     // Zone résidentielle
        Abobo: 0.04          // Zone périphérique
    };
    
    return livreurs.map(livreur => {
        // Sélection pondérée d'une zone
        const random = Math.random();
        let cumul = 0;
        let zoneSelectionnee = ZONES_ABIDJAN[0];
        
        for (const zone of ZONES_ABIDJAN) {
            cumul += (zone.nom in ponderation) ? ponderation[zone.nom as ZoneNom] : 0.1;
            if (random <= cumul) {
                zoneSelectionnee = zone;
                break;
            }
        }
        
        const position = genererPositionAleatoire(zoneSelectionnee);
        
        return {
            ...livreur,
            position
        };
    });
}

/**
 * Simule le déplacement des livreurs (pour le temps réel)
 */
export function simulerDeplacementLivreur(livreur: LivreurAvecPosition): LivreurAvecPosition {
    if (!livreur.position) return livreur;
    
    // Déplacement aléatoire de maximum 0.002° (environ 200m)
    const deltaLat = (Math.random() - 0.5) * 0.002;
    const deltaLng = (Math.random() - 0.5) * 0.002;
    
    const nouvellePosition = {
        ...livreur.position,
        latitude: livreur.position.latitude + deltaLat,
        longitude: livreur.position.longitude + deltaLng,
        timestamp: Date.now()
    };
    
    // Vérification que la nouvelle position reste dans Abidjan
    if (nouvellePosition.latitude < 5.2400 || nouvellePosition.latitude > 5.4200 ||
        nouvellePosition.longitude < -4.1200 || nouvellePosition.longitude > -3.9500) {
        return livreur; // Garde l'ancienne position si hors limites
    }
    
    return {
        ...livreur,
        position: nouvellePosition
    };
}

/**
 * Fonction utilitaire pour formater l'affichage des positions
 */
export function formaterPositionLivreur(livreur: LivreurAvecPosition): string {
    if (!livreur.position) return "Position inconnue";
    
    const { commune, quartier, latitude, longitude } = livreur.position;
    return `${quartier}, ${commune} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
}

// Exemple d'utilisation
export function exempleUtilisation() {
    const livreursTest = [
        {
            livreurId: '8d43458e-4c45-497d-a137-4b9e397dcbd3',
            nomComplet: 'KEITA',
            telephone: '2250565855202',
        }
    ] as LivreurDisponible[];
    
    // Dispatching simple
    const livreursDispatchesSimple = dispatcherLivreursAbidjan(livreursTest);
    
    // Dispatching pondéré (recommandé)
    const livreursDispatchesPondere = dispatcherLivreursAbidjanPondere(livreursTest);
    
    console.log("Position générée:", formaterPositionLivreur(livreursDispatchesPondere[0]));
    
    return livreursDispatchesPondere;
}
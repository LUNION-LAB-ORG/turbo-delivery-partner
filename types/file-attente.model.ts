import { CommandeCourseExterne } from "./models";

export interface TimeOfDay {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface FileAttenteLivreur {
  id: string;
  avatar: string;
  nomComplet: string;
  position: number;
  dateJour: string;
  heureJour: TimeOfDay;
  statut: string;
  progression?: number;
  livreurId: string;
  estRetirerDeLaFileAttente?: boolean
  commande?: Partial<CommandeCourseExterne>,
}

export interface StatistiqueFileAttente {
  coursier?: number;
  commandeEnAttente?: number;
  commandeTermine?: number;
}

export interface FilleAttenteHistoriqueVM {
  restaurantId?: string
  restaurant?: string
  fileAttentes?: FilleAttenteVM[]
}

interface ILocalDataTime {
  hour?: number;
  minute?: number;
  second?: number;
  nano?: number;
}

export interface FilleAttenteVM {
  id?: string
  avatar?: string;
  nomComplet?: string;
  position?: number;
  dateJour?: string;
  heureJour?: ILocalDataTime
  statut: string;
}

export interface FileAttenteStatistiqueVM {
  coursier?: number;
  restaurant?: number;
  commandeEnAttente?: number;
  commandeTermine?: number;
}


export interface TypeCuisine {
    // Définissez les propriétés de type cuisine ici, par exemple :
    // id: string;
    // nom: string;
}
export interface Sort {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
}

export interface Pageable {
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    offset: number;
    sort: Sort;
    unpaged: boolean;
}

export interface PaginatedResponse<T> {
    content: T[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    size: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    empty: boolean;
}

export interface Role {
    id: string;
    status: number;
    deleted: boolean;
    dateCreation: string;
    dateEdition: string;
    libelle: string;
}

export interface User {
    id: string;
    status: number;
    deleted: boolean;
    dateCreation: string;
    dateEdition: string;
    nom: string;
    prenoms: string;
    image: string;
    username: string;
    email: string;
    changePassword: boolean;
    attemptLogin: number;
    passwordExpired: string;
    dateOfInactivity: string;
    role: Role | null;
    restaurant: Restaurant | null;
}

export interface Restaurant {
    id: string;
    status: number;
    deleted: boolean;
    dateCreation: string;
    dateEdition: string;
    nomEtablissement: string;
    description: string;
    email: string;
    telephone: string;
    codePostal: string;
    commune: string;
    localisation: string;
    siteWeb: string | null;
    logo: string;
    logo_Url: string;
    dateService: string;
    documentUrl: string;
    cni: string;
    longitude: number | null;
    latitude: number | null;
    idLocation: string | null;
    pictures: Picture[];
    openingHours: OpeningHour[];
    typeCommission?: string;
}
export interface Picture {
    id: string;
    status: number;
    deleted: boolean;
    dateCreation: string;
    dateEdition: string;
    pictureUrl: string;
}

export interface OpeningHour {
    id: string;
    status: number;
    deleted: boolean;
    dateCreation: string;
    dateEdition: string;
    dayOfWeek: string;
    openingTime: string;
    closingTime: string;
    closed: boolean;
}

export interface DeliveryMan {
    id: string;
    status: number;
    deleted: boolean;
    dateCreation: string;
    dateEdition: string;
    nom: string | null;
    prenoms: string | null;
    avatarUrl: string | null;
    telephone: string;
    email: string | null;
    birthDay: string | null;
    gender: string | null;
    cniUrlR: string | null;
    cniUrlV: string | null;
    category: string | null;
    habitation: string | null;
    immatriculation: string | null;
    numeroCni: string | null;
    matricule: string;
}

export interface Collection {
    id: string;
    status: number;
    deleted: boolean;
    dateCreation: string;
    dateEdition: string;
    libelle: string;
    description: string;
    picture: string;
    pictureUrl: string;
}

export interface FindOneRestaurant {
    typecuisine: string[];
    restaurant: Restaurant;
}
export interface Ingredient {
    name: string;
    quantity?: string;
}

export interface Accompaniment {
    id: string;
    libelle: string;
    price: number;
    platId?: string;
}

export interface OptionValue {
    id: string;
    valeur: string;
    prixSup: number;
    optionId?: string;
}

export interface Option {
    id: string;
    libelle: string;
    isRequired: boolean;
    maxSelected: number;
    optionValeurs: OptionValue[];
}

export interface Drink {
    id: string;
    libelle: string;
    price: number;
    volume: string;
    // platId?: string;
}

export interface Dish {
    id: string;
    status: number;
    deleted: boolean;
    dateCreation: string;
    dateEdition: string;
    libelle: string;
    description: string;
    disponible: boolean;
    cookTime: string;
    price: number;
    imageUrl: string;
    restaurant: Restaurant;
    collection: Collection;
}

export interface CollectionWithDishes {
    collectionModel: Collection;
    totalPlat: number;
}

export interface DishComplet {
    platM: Dish;
    accompagnementM: Accompaniment[];
    optionPlatM: Option[];
    boissonPlatMs: Drink[];
}

export interface LocationCourseExterne {
    longitude: number;
    latitude: number;
    address: string;
}

export interface DestinataireCourseExterne {
    contact: string;
}

export interface RepositionnerCommande {
    livreurId: string;
}

export interface CommandeCourseExterne {
    id: string;
    numero: string;
    dateHeure: string;
    destinataire: DestinataireCourseExterne;
    lieuRecuperation: LocationCourseExterne;
    lieuLivraison: LocationCourseExterne;
    modePaiement: 'Espèce';
    statut: string;
    fraisLivraison: number;
    prix: number;
    livraisonPaye: boolean;
}
export interface CourseExterne {
    id: string;
    code: string;
    total: number;
    statut: string;

    payoutAt: string;
    pickupAt: string;
    deliveredAt: string;

    createdAt: string;
    restaurant: Restaurant;
    nombreCommande: number;
    commandes: CommandeCourseExterne[];
}

export interface LivreurDisponible {
    livreurId: string;
    avatarUrl: string;
    nomComplet: string;
    telephone: string;
    position: {
        longitude: number;
        latitude: number;
    };
    course?: CourseExterne;
}

export interface LivreurRestau {
    id: string;
    avatarUrl: string;
    birthDay: string; // format "YYYY-MM-DD"
    cniUrlR: string;
    cniUrlV: string;
    deleted: boolean;
    email: string;
    gender: "HOMME" | "FEMME" | string; // si tu veux typer plus strict
    habitation: string;
    immatriculation: string;
    matricule: string;
    nom: string;
    numeroCni: string;
    prenoms: string;
    status: number;
    telephone: string;
    type: string; // ex: "TURBO"
}


// GESTION DES TRAFICS LIVREURS
export interface LivreurTrafic {
    livreurId: string;
    avatarUrl: string;
    nomComplet: string;
    telephone: string;
    position: {
        latitude: number;
        longitude: number;
    };
    course?: boolean; // false si pas de course en cours
}

export interface LivreurCategorie {
    total: number;
    liste: LivreurTrafic[];
}

export interface TraficLivreursResponse {
    disponibles: LivreurCategorie;
    enActivite: LivreurCategorie;
    indisponibles: LivreurCategorie;
    totalLivreurs: number;
}

export interface Customer {
    id: string;
    status: number;
    deleted: boolean;
    dateCreation: string;
    dateEdition: string;
    nom: string;
    prenoms: string;
    avatarUrl: string | null;
    telephone: string;
    email: string;
    birthDay: string;
    gender: string;
}

export interface OrderItem {
    id: string;
    status: number;
    deleted: boolean;
    dateCreation: string;
    dateEdition: string;
    price: number;
    quantity: number;
    platId: string;
    optionId: string | null;
    optionValues: string[];
    accompIds: string[];
    drinkIds: string[];
}

export interface Adresse {
    id: string;
    status: number;
    deleted: boolean;
    dateCreation: string;
    dateEdition: string;
    libelle: string;
    etage: string;
    numeroPorte: string;
    infoSupl: string;
    batName: string;
    userM: Customer;
}

export interface Order {
    id: string;
    status: number;
    numero: string;
    deleted: boolean;
    dateCreation: string;
    dateEdition: string;

    totalAmount: number;
    orderState: string;

    userM: Customer;

    orderItemM: OrderItem[];

    adresseM: Adresse;

    recipientName: string;
    recipientPhone: string;

    paymentMethod: string;

    deliveryFee: number;
    serviceFee: number;

    restaurantId: string | null;
}


  

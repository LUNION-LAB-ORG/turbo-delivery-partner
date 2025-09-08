import { Tab, Tabs } from "@heroui/react";
import { CoursiersDiaponible } from "../coursiers-disponibles/coursiers-disponible";
import { CoursisersPasActivite } from "../coursiers-pas-activites/coursiers-pas-activite";
import { ArchiveFileAttente, FileAttenteLivreur } from "@/types/file-attente.model";
import { Bike, Clock, ArchiveX } from "lucide-react";
import { Archive } from "../archives/archive";

interface Props {
    data: FileAttenteLivreur[];
    searchKey?: string;
    timeProgressions: number;
    currentDelivery?: FileAttenteLivreur;
    restaurantId?: string;
    livreurIndisponibles: FileAttenteLivreur[],
    archives: ArchiveFileAttente[]
}

export function FileAttenteTab({ data, searchKey, timeProgressions, currentDelivery, restaurantId, livreurIndisponibles, archives }: Props) {
    const items = [
        { title: "Disponible maintenant", kay: "disponible", icon: <Bike size={16} className="inline mr-2" /> },
        { title: "Pas en activité", kay: "indisponible", icon: <Clock size={16} className="inline mr-2" /> },
        { title: "Archive File Attente", kay: "archive", icon: <ArchiveX size={16} className="inline mr-2" /> }
    ];

    return (
        <div className="mt-4">
            <Tabs items={items || []} className="w-full">
                {(item) => (
                    <Tab
                        key={item.kay}
                        title={
                            <span className="flex items-center mx-auto px-auto py-auto my-auto">
                                {item.icon}
                                {item.title}
                            </span>
                        }
                    >
                        {item.kay === "disponible" ? (
                            <CoursiersDiaponible
                                data={data}
                                searchKey={searchKey}
                                timeProgressions={timeProgressions}
                                currentDelivery={currentDelivery}
                                restaurantId={restaurantId}
                            />
                        ) : (
                            item.kay === "indisponible" ? 
                            (
                                <CoursisersPasActivite
                                    data={livreurIndisponibles}
                                    searchKey={searchKey}
                                />
                            ) : 
                            (
                                <Archive
                                    data={archives}
                                    searchKey={searchKey}
                                />
                            )
                        )}
                    </Tab>
                )}
            </Tabs>
        </div>
    );
}

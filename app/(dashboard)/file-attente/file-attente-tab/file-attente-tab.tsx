import { Tab, Tabs } from "@heroui/react";
import { CoursiersDiaponible } from "../coursiers-disponibles/coursiers-disponible";
import { CoursisersPasActivite } from "../coursiers-pas-activites/coursiers-pas-activite";
import { ArchiveFileAttente, FileAttenteLivreur } from "@/types/file-attente.model";
import { Bike, Clock, ArchiveX } from "lucide-react";
import { Archive } from "../archives/archive";
import { useState } from "react";

interface Props {
    data: FileAttenteLivreur[];
    searchKey?: string;
    timeProgressions: number;
    currentDelivery?: FileAttenteLivreur;
    restaurantId?: string;
    livreurIndisponibles: FileAttenteLivreur[],
    archives: ArchiveFileAttente[]
}

export function FileAttenteTab({ 
    data, 
    searchKey, 
    timeProgressions, 
    currentDelivery, 
    restaurantId, 
    livreurIndisponibles, 
    archives 
}: Props) {
    const items = [
        { title: "Disponible maintenant", kay: "disponible", icon: <Bike size={16} className="inline mr-2" /> },
        { title: "Pas en activité", kay: "indisponible", icon: <Clock size={16} className="inline mr-2" /> },
        { title: "Archive File Attente", kay: "archive", icon: <ArchiveX size={16} className="inline mr-2" /> }
    ];

    const [activeTab, setActiveTab] = useState("disponible");

    const renderContent = () => {
        if (activeTab === "disponible") {
            return (
                <CoursiersDiaponible
                    data={data}
                    searchKey={searchKey}
                    timeProgressions={timeProgressions}
                    currentDelivery={currentDelivery}
                    restaurantId={restaurantId}
                />
            );
        }
        if (activeTab === "indisponible") {
            return (
                <CoursisersPasActivite
                    data={livreurIndisponibles}
                    searchKey={searchKey}
                />
            );
        }
        return <Archive data={archives} searchKey={searchKey} />;
    };

    return (
        <div className="mt-4 w-full">
            {/* Dropdown pour mobile */}
            <div className="sm:hidden mb-4">
                <select
                    className="w-full border rounded p-2"
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                >
                    {items.map((item) => (
                        <option key={item.kay} value={item.kay}>
                            {item.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tabs pour tablette/desktop */}
            <div className="hidden sm:block">
                <Tabs items={items}>
                    {(item) => (
                        <Tab
                            key={item.kay}
                            title={
                                <span className="flex items-center px-4 py-2">
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
                            ) : item.kay === "indisponible" ? (
                                <CoursisersPasActivite
                                    data={livreurIndisponibles}
                                    searchKey={searchKey}
                                />
                            ) : (
                                <Archive
                                    data={archives}
                                    searchKey={searchKey}
                                />
                            )}
                        </Tab>
                    )}
                </Tabs>
            </div>

            {/* Contenu mobile */}
            <div className="sm:hidden mt-4">
                {renderContent()}
            </div>
        </div>
    );
}

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
        <div className="w-full">
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
                <div className="bg-white shadow rounded-lg p-2">
                    <div className="flex justify-center gap-4">
                    {items.map((item) => (
                        <button
                            key={item.kay}
                            onClick={() => setActiveTab(item.kay)}
                            className={`
                                flex items-center px-4 py-2 rounded-md font-medium transition
                                ${activeTab === item.kay
                                ? "bg-primary text-white shadow"
                                : "text-gray-600 hover:bg-gray-100"}
                            `}
                        >
                            {item.icon}
                            {item.title}
                        </button>
                    ))}
                    </div>
                </div>

                <div className="mt-2 bg-white shadow rounded-lg p-3">
                    {activeTab === "disponible" ? (
                        <CoursiersDiaponible
                            data={data}
                            searchKey={searchKey}
                            timeProgressions={timeProgressions}
                            currentDelivery={currentDelivery}
                            restaurantId={restaurantId}
                        />
                    ) : activeTab === "indisponible" ? (
                        <CoursisersPasActivite
                            data={livreurIndisponibles}
                            searchKey={searchKey}
                        />
                    ) : (
                        <Archive data={archives} searchKey={searchKey} />
                    )}
                </div>
            </div>


            {/* Contenu mobile */}
            <div className="sm:hidden mt-4">
                {renderContent()}
            </div>
        </div>
    );
}

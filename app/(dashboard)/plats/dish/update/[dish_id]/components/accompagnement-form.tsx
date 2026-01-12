import { Accompaniment } from "@/types/models";
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
    onChange: (data: Accompaniment[]) => void;
    initialValues?: Accompaniment[];
}

export default function AccompagnementsForm({ onChange, initialValues = [] }: Props) {
    const [accompagnements, setAccompagnements] = useState<Accompaniment[]>(
        initialValues.length > 0 ? initialValues : [{ libelle: "", price: 0 }]
    );

    useEffect(() => {
        onChange(accompagnements);
    }, [accompagnements, onChange]);

    const handleAdd = () => {
        setAccompagnements([...accompagnements, { libelle: "", price: 0 }]);
    };

    const handleRemove = (index: number) => {
        const newList = accompagnements.filter((_, i) => i !== index);
        setAccompagnements(newList.length > 0 ? newList : [{ libelle: "", price: 0 }]);
    };

    const handleChange = <K extends keyof Accompaniment>(
        index: number,
        field: K,
        value: Accompaniment[K]
    ) => {
        const updated = [...accompagnements];
        updated[index][field] = value;
        setAccompagnements(updated);
    };

    return (
        <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-800">Accompagnements</h2>

            {accompagnements.map((acc, index) => (
                <div
                    key={index}
                    className="grid grid-cols-[2fr,1fr,auto] gap-3 items-center"
                >
                    <input
                        type="text"
                        className="h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Libellé"
                        value={acc.libelle}
                        onChange={(e) => handleChange(index, "libelle", e.target.value)}
                    />

                    <input
                        type="number"
                        className="h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="0"
                        value={acc.price}
                        onChange={(e) => handleChange(index, "price", Number(e.target.value))}
                    />

                    <button
                        type="button"
                        className="h-11 w-11 flex items-center justify-center rounded-md border border-gray-300 text-gray-400"
                        onClick={() => handleRemove(index)}
                    >
                        <TrashIcon className="w-4 h-4 text-gray-400" color="red" />
                    </button>
                </div>
            ))}

            <button
                type="button"
                className="inline-flex items-center justify-center px-4 h-9 rounded-full border border-red-500 text-red-500 text-sm"
                onClick={handleAdd}
            >
                Ajouter
            </button>
        </div>
    );
}
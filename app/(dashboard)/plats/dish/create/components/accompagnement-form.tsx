import { TrashIcon } from "lucide-react";
import { useState } from "react";

type Accompagnement = {
    label: string;
    price: string;
};

export default function AccompagnementsForm() {
    const [accompagnements, setAccompagnements] = useState([
        { label: "", price: "" },
    ]);

    const handleAdd = () => {
        setAccompagnements([...accompagnements, { label: "", price: "" }]);
    };

    const handleRemove = (index: number) => {
        setAccompagnements(accompagnements.filter((_, i) => i !== index));
    };

    const handleChange = (
        index: number,
        field: keyof Accompagnement,
        value: string
    ) => {
        const newAccompagnements = [...accompagnements];
        newAccompagnements[index][field] = value;
        setAccompagnements(newAccompagnements);
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
                        name={`accompagnements[${index}].label`}
                        type="text"
                        className="h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Libellé"
                        value={acc.label}
                        onChange={(e) => handleChange(index, "label", e.target.value)}
                    />
                    <input
                        name={`accompagnements[${index}].price`}
                        type="number"
                        className="h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="0"
                        value={acc.price}
                        onChange={(e) => handleChange(index, "price", e.target.value)}
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

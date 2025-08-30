'use client';

import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
    useDisclosure,
    Input
} from '@heroui/react';
import { useState } from 'react';
import { Drink } from '@/types/models';
import { toast } from "react-hot-toast"; // ou le toast que tu utilises
import useContentCtx from './useContentCtx';
import { title } from '@/components/primitives';
import { Calendar, CircleFadingPlus, User, Pencil, Trash2 } from 'lucide-react';
import { addBoisson, updateBoisson, deleteBoisson } from '@/src/actions/restaurant.actions';

interface ContentProps {
    initialData: Drink[] | null;
}

export default function Content({ initialData }: ContentProps) {
    const { columns, renderCell, data } = useContentCtx({ initialData });

    // State pour gérer les modals
    const {
        isOpen: isAddOpen,
        onOpen: onAddOpen,
        onOpenChange: onAddOpenChange
    } = useDisclosure();

    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onOpenChange: onEditOpenChange
    } = useDisclosure();

    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onOpenChange: onDeleteOpenChange
    } = useDisclosure();

    const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
    const [form, setForm] = useState({ libelle: '', price: '', volume: '' });

    // --- Handlers ---
    const handleEdit = (drink: Drink) => {
        setSelectedDrink(drink);
        setForm({
            libelle: drink.libelle.toString(),
            price: drink.price.toString(),
            volume: drink.volume.toString()
        });
        onEditOpen();
    };

    const handleDelete = (drink: Drink) => {
        setSelectedDrink(drink);
        onDeleteOpen();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddSubmit = () => {
        const formData = new FormData();
        formData.append("libelle", form.libelle);
        formData.append("price", form.price);
        formData.append("volume", form.volume);
      
        addBoisson(formData)
            .then(() => {
                onAddOpenChange();
                setForm({ libelle: "", price: "", volume: "" });
        
                // ✅ Affiche un toast minuteur
                // toast.success("Boisson ajoutée ! Rafraîchissement dans 3s...", {
                //     duration: 3000, // 3 secondes
                // });
        
                // ⏳ Recharge la page après 3 secondes
                setTimeout(() => window.location.reload(), 3000);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Erreur lors de l'ajout de la boisson.");
            });
    };    

    const handleEditSubmit = () => {
        if (!selectedDrink) return;
    
        const formData = new FormData();
        formData.append("libelle", form.libelle);
        formData.append("price", form.price);
        formData.append("volume", form.volume);
    
        updateBoisson(selectedDrink.id, formData)
            .then(() => {
                onEditOpenChange();
                setForm({ libelle: "", price: "", volume: "" });
    
                // ✅ Affiche un toast minuteur
                // toast.success("Boisson mise à jour ! Rafraîchissement dans 3s...", {
                //     duration: 3000,
                // });
    
                // ⏳ Recharge la page après 3 secondes
                setTimeout(() => window.location.reload(), 3000);
            })
            .catch((err) => {
                console.error(err);
                // toast.error("Erreur lors de la mise à jour de la boisson.");
            });
    };
    
    const handleDeleteSubmit = async () => {
        if (!selectedDrink?.id) return;
    
        try {
            const result = await deleteBoisson(selectedDrink.id);
    
            if (result.status === 'success') {
                toast.success("Boisson supprimée avec succès ! Rafraîchissement dans 2s...", { duration: 2000 });
                
                // Ferme le modal
                onDeleteOpenChange();
                
                // Recharge la page après 2 secondes pour prendre en compte la suppression
                setTimeout(() => window.location.reload(), 2000);
            } else {
                toast.error(result.message || "Erreur lors de la suppression de la boisson.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la suppression de la boisson.");
        }
    };    

    return (
        <div className="w-full h-full pb-10 flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className={title({ size: 'h3', class: 'text-primary' })}>Gestions des Boissons</h1>
                <Button color="primary" onPress={onAddOpen} startContent={<CircleFadingPlus size={16} />}>
                    Ajouter une boisson
                </Button>
            </div>

            <Table aria-label="Liste des boissons">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === 'actions' ? 'center' : 'start'}
                        >
                            <div className="flex gap-2 text-primary">
                                { 
                                    column.uid === 'libelle' ? ( <CircleFadingPlus size={15} /> ) 
                                    : column.uid === 'price' ? ( <Calendar size={15} /> ) 
                                    : column.uid === 'volume' ? ( <User size={15} /> ) 
                                    : <></>
                                }
                                {column.name}
                            </div>
                        </TableColumn>
                    )}
                </TableHeader>

                <TableBody items={data ?? []} emptyContent={'Aucune boisson à afficher.'}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell>
                                    {columnKey === 'actions' ? (
                                        <div className="flex gap-2 justify-center">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                color="secondary"
                                                onPress={() => handleEdit(item)}
                                            >
                                                <Pencil size={16} />
                                            </Button>
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                color="danger"
                                                onPress={() => handleDelete(item)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    ) : (
                                        renderCell(item, columnKey) as React.ReactNode
                                    )}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Modal Ajout */}
            <Modal isOpen={isAddOpen} onOpenChange={onAddOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Ajouter une Boisson</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Libellé"
                                    name="libelle"
                                    value={form.libelle}
                                    onChange={handleChange}
                                    placeholder="Ex: Coca-Cola"
                                />
                                <Input
                                    label="Prix (€)"
                                    name="price"
                                    type="number"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="Ex: 2.50"
                                />
                                <Input
                                    label="Volume (ml)"
                                    name="volume"
                                    type="number"
                                    value={form.volume}
                                    onChange={handleChange}
                                    placeholder="Ex: 330"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>Annuler</Button>
                                <Button color="primary" onPress={handleAddSubmit}>Enregistrer</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Modal Édition */}
            <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Modifier la Boisson</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Libellé"
                                    name="libelle"
                                    value={form.libelle}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Prix (€)"
                                    name="price"
                                    type="number"
                                    value={form.price}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Volume (ml)"
                                    name="volume"
                                    type="number"
                                    value={form.volume}
                                    onChange={handleChange}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>Annuler</Button>
                                <Button color="primary" onPress={handleEditSubmit}>Mettre à jour</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Modal Suppression */}
            <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Confirmer la suppression</ModalHeader>
                            <ModalBody>
                                <p>Voulez-vous vraiment supprimer la boisson <b>{selectedDrink?.libelle}</b> ?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>Annuler</Button>
                                <Button color="danger" onPress={handleDeleteSubmit}>Supprimer</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

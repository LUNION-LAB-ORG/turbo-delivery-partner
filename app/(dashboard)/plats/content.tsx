'use client';
import { useState } from 'react';
import { title } from '@/components/primitives';
import createUrlFile from '@/utils/createUrlFile';
import { useRouter } from 'next/navigation';
import { CollectionWithDishes, Plat } from '@/types/models';
import EmptyDataTable from '@/components/commons/EmptyDataTable';

import { Button, Card, CardFooter, CardHeader, Image, Input } from '@heroui/react';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { HandPlatter } from 'lucide-react';
import Link from 'next/link';

export default function Content({ data }: { data: CollectionWithDishes[] }) {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    // Filtrage des collections selon search et filtre actif
    const filteredCollections = data.filter(collection => {
        const matchesSearch = collection.collectionModel.libelle.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = activeFilter ? collection.collectionModel.libelle === activeFilter : true;
        return matchesSearch && matchesFilter;
    });

    // Liste des filtres uniques (exemple basé sur libelle)
    const filters = Array.from(new Set(data.map(c => c.collectionModel.libelle)));

    return (
        <div className="w-full h-full pb-10 flex flex-1 flex-col gap-4 lg:gap-6">
            {/* Header + Add Button */}
            <div className="flex items-center justify-between">
                <h1 className={title({ size: 'h3', class: 'text-primary' })}>Plats</h1>
                <Button
                    as={Link}
                    href="/plats/dish/create"
                    color="primary"
                    size="sm"
                    startContent={<IconPlus className="h-5 w-5 text-white" />}
                >
                    Ajouter un plat
                </Button>
            </div>

            {/* Recherche */}
            <Input
                placeholder="Rechercher une collection..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="my-1 bg-white rounded-md shadow-sm"
            />

            {/* Boutons de filtre */}
            <div className="flex flex-wrap gap-2 my-1">
                <Button
                    variant={activeFilter === null ? 'flat' : 'ghost'}
                    size="sm"
                    className="bg-white rounded-lg"
                    onClick={() => setActiveFilter(null)}
                >
                    TOUTES
                </Button>
                {filters.map(filter => (
                    <Button
                        key={filter}
                        variant={activeFilter === filter ? 'flat' : 'ghost'}
                        size="sm"
                        className="bg-white rounded-lg"
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter.toUpperCase()}
                    </Button>
                ))}
            </div>

            {/* Affichage des collections filtrées */}
            {filteredCollections.length > 0 ? (
                filteredCollections.map((collection: CollectionWithDishes) => (
                    <div key={collection.collectionModel.id} className="space-y-4">
                        {/* Header collection */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold uppercase">
                                {collection.collectionModel.libelle.toUpperCase()}
                            </h2>
                            <div className="inline-flex items-center text-sm text-gray-500">
                                <HandPlatter className="h-4 w-4 mr-1 text-primary" />
                                <span>{collection.totalPlat} Plats</span>
                            </div>
                        </div>

                        {/* Grid des plats */}
                        <div className="grid gap-4 md:gap-5 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {collection.plats.slice(0, 4).map((dish: Plat) => (
                                <Card
                                    key={dish.id}
                                    shadow="sm"
                                    className="overflow-hidden border border-gray-100"
                                >
                                    <CardHeader className="p-0">
                                        <div className="relative w-full h-40 rounded-t-md overflow-hidden">
                                            <Image
                                                src={createUrlFile(dish.imageUrl, 'restaurant')}
                                                alt={dish.libelle}
                                                className="object-cover w-full h-full"
                                            />
                                            {/* Icônes actions */}
                                            <div className="absolute top-2 right-2 flex gap-2 z-10">
                                                <button
                                                    onClick={() => router.push(`/plats/dish/update/${dish.id}`)}
                                                    className="bg-white p-1 rounded-full shadow hover:bg-gray-100"
                                                >
                                                    <IconEdit className="w-4 h-4 text-blue" />
                                                </button>
                                                <button
                                                    onClick={() => {}}
                                                    className="bg-white p-1 rounded-full shadow hover:bg-gray-100"
                                                >
                                                    <IconTrash className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardFooter className="flex items-center justify-between px-4 py-4">
                                        <p className="text-md font-medium line-clamp-1">{dish.libelle}</p>
                                        <p className="text-lg font-semibold">{dish.price} FCFA</p>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <EmptyDataTable />
            )}
        </div>
    );
}

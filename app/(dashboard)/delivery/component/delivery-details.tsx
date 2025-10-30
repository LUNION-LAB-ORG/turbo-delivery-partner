'use client';

import dayjs from 'dayjs';
import { Fragment } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { COMMANDES_STATUSES } from '@/data';
import IconX from '@/components/icon/icon-x';
import { CourseExterne } from '@/types/models';
import { User, MapPin, CreditCard, Clock } from 'lucide-react';
import { Chip, Card, CardHeader, CardBody } from "@heroui/react";
import { Transition, Dialog, TransitionChild, DialogPanel } from '@headlessui/react';
import { cancelCommandeExterne } from '@/src/actions/courses.actions';

const getStatusBgColor = (statut: string = ''): string => {
    const normalized = statut ? statut.toUpperCase() : "INCONNU";

    switch (normalized) {
        case 'VALIDER':
            return 'bg-green-600 text-white';
        case 'TERMINER':
            return 'bg-green-600 text-white';
        case 'ANNULER':
            return 'bg-red-600 text-white';
        case 'EN_ATTENTE_RECUPERATION':
            return 'bg-yellow-500 text-white';
        case 'PREPARATION':
            return 'bg-orange-500 text-white';
        default:
            return 'bg-gray-300 text-gray-700';
    }
};


const DeliveryDetails = ({
    delivery,
    open,
    setOpen,
}: {
    delivery: CourseExterne;
    open: boolean;
    setOpen: (open: boolean) => void;
}) => {
    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" open={open} onClose={() => setOpen(false)} className="relative z-50">
                {/* Overlay */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </TransitionChild>

                {/* Content */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="panel w-full max-w-3xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                {/* Close button */}
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="absolute top-4 right-4 text-gray-400 outline-none hover:text-gray-800 dark:hover:text-gray-600"
                                >
                                    <IconX />
                                </button>

                                {/* Header */}
                                <div className="bg-[#fbfbfb] py-3 text-lg font-medium px-6 dark:bg-[#121c2c] text-primary border-b">
                                    Détails de la course
                                </div>

                                {/* Body */}
                                <div className="p-6 space-y-5">
                                    {/* Informations principales */}
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Clock className="text-gray-400 w-4 h-4" />
                                            <span>
                                                <strong>Créée le :</strong> {dayjs(delivery.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="text-gray-400 w-4 h-4" />
                                            <span>
                                                <strong>Montant Total : </strong>
                                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(
                                                    (delivery.commandes?.reduce((sum, cmd) => sum + (cmd.prix ?? 0), 0) || 0) +
                                                    (delivery.commandes?.reduce((sum, cmd) => sum + (cmd.fraisLivraison ?? 0), 0) || 0)
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Chip color="secondary" size="sm" className='rounded-md' variant="flat">
                                                {delivery.statut}
                                            </Chip>
                                        </div>
                                    </div>

                                    <hr className="border-gray-200 dark:border-gray-700" />

                                    {/* Liste des commandes */}
                                    <div>
                                        <h3 className="text-md font-semibold mb-2 text-gray-700">Commandes associées</h3>
                                        {delivery.commandes.length > 0 ? (
                                            delivery.commandes.map((commande, idx) => (
                                                <Card key={commande.id} className="w-full bg-gray-50 shadow-sm mb-2 rounded-md">
                                                    <CardHeader className={`flex justify-between px-3 py-2 border-b ${getStatusBgColor(commande.statut)}`}>
                                                        <div className="flex items-center gap-3">
                                                            <Chip size="sm" variant="flat" color="secondary">
                                                                {commande.statut ?? 'EN_ATTENTE_RECUPERATION'}
                                                            </Chip>
                                                            <span className="font-semibold">Commande #{commande.numero}</span>
                                                        </div>


                                                        {commande.statut === COMMANDES_STATUSES.EN_ATTENTE_RECUPERATION ? (
                                                            <div className="flex items-center gap-3">
                                                                {/* ✅ Bouton visible seulement s’il y a au moins deux commandes */}
                                                                {delivery.commandes.length >= 2 && (
                                                                    <button onClick={() => cancelCommandeExterne(commande.id)}
                                                                        className="text-white bg-red-500 text-sm font-medium border border-red-300 rounded-md px-2 py-1 transition">
                                                                        Annuler
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : (<></>)}
                                                    </CardHeader>

                                                    <CardBody className="px-3 py-2">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <User className="text-gray-400 w-4 h-4" />
                                                            <span>DESTINATAIRE: {commande?.destinataire?.contact}</span>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <MapPin className="text-gray-400 w-4 h-4" />
                                                            <span>ADRESSE DE LIVRAISON: {commande?.lieuLivraison?.latitude}, {commande?.lieuLivraison?.longitude}</span>
                                                        </div>
                                                        {/* <div className="flex items-center gap-2 mb-1">
                                                            <CreditCard className="text-gray-400 w-4 h-4" />
                                                            <span>MODE DE PAIEMENT: {commande.modePaiement}</span>
                                                        </div> */}
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <CreditCard className="text-gray-400 w-4 h-4" />
                                                            <span className="font-semibold">
                                                                MONTANT DE LA COMMANDE: 
                                                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(
                                                                    (commande.prix || 0)
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <CreditCard className="text-gray-400 w-4 h-4" />
                                                            <span> MONTANT DE LIVRAISON:
                                                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(
                                                                    (commande.fraisLivraison || 0)
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Clock className="text-gray-400 w-4 h-4" />
                                                            PRISE EN CHARGE: {delivery.pickupAt ? dayjs(delivery.pickupAt).format('DD/MM/YYYY HH:mm:ss') : '—'}
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Clock className="text-gray-400 w-4 h-4" />
                                                            STATUT LIVRAISON: {commande.statut !== COMMANDES_STATUSES.EN_ATTENTE_VERSEMENT || commande.statut !== COMMANDES_STATUSES.TERMINER ? 'Non Livré' : 'Livré'}
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            ))
                                        ) : (<p className="text-gray-500 text-sm italic">Aucune commande associée.</p>)}
                                    </div>
                                    <div className="flex flex-col items-center gap-6 p-2">
                                        <div className="bg-white p-2 rounded-lg shadow-sm">
                                            <QRCodeSVG
                                                value={delivery.id}
                                                size={150}
                                                level="H"
                                                includeMargin={true}
                                            />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-medium mb-2">Code de la course: {delivery.code}</p>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default DeliveryDetails;

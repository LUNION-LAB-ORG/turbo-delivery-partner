'use client';
import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Input, Select, SelectItem } from '@nextui-org/react';
import Image from 'next/image';

export const BillingAddressSection: React.FC = () => {
    return (
        <Card>
            <CardHeader className="flex flex-col items-start">
                <h5 className="mb-4 text-lg font-semibold">Adresse de Facturation</h5>
                <p>
                    Les modifications de vos informations de <span className="text-primary">facturation</span> prendront effet à partir du paiement programmé et seront reflétées sur votre prochaine
                    facture.
                </p>
            </CardHeader>

            <CardBody className="mb-5">
                <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                    <div className="flex items-start justify-between py-3">
                        <h6 className="text-[15px] font-bold text-[#515365] dark:text-white-dark">
                            Adresse #1
                            <span className="mt-1 block text-xs font-normal text-white-dark dark:text-white-light">2249 Caynor Circle, New Brunswick, New Jersey</span>
                        </h6>
                        <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                            <button className="btn btn-dark">Modifier</button>
                        </div>
                    </div>
                </div>
                <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                    <div className="flex items-start justify-between py-3">
                        <h6 className="text-[15px] font-bold text-[#515365] dark:text-white-dark">
                            Adresse #2
                            <span className="mt-1 block text-xs font-normal text-white-dark dark:text-white-light">4262 Leverton Cove Road, Springfield, Massachusetts</span>
                        </h6>
                        <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                            <button className="btn btn-dark">Modifier</button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex items-start justify-between py-3">
                        <h6 className="text-[15px] font-bold text-[#515365] dark:text-white-dark">
                            Adresse #3
                            <span className="mt-1 block text-xs font-normal text-white-dark dark:text-white-light">2692 Berkshire Circle, Knoxville, Tennessee</span>
                        </h6>
                        <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                            <button className="btn btn-dark">Modifier</button>
                        </div>
                    </div>
                </div>
            </CardBody>
            <CardFooter>
                <Button color="primary">Ajouter une Adresse</Button>
            </CardFooter>
        </Card>
    );
};

export const PaymentHistorySection: React.FC = () => (
    <Card>
        <CardHeader className="flex flex-col items-start">
            <h5 className="mb-4 text-lg font-semibold">Historique des Paiements</h5>
            <p>
                Les modifications de vos informations de <span className="text-primary">méthode de paiement</span> prendront effet à partir du paiement programmé et seront reflétées sur votre
                prochaine facture.
            </p>
        </CardHeader>
        <CardBody className="mb-5">
            <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                <div className="flex items-start justify-between py-3">
                    <div className="flex-none ltr:mr-4 rtl:ml-4">
                        <Image width={32} height={32} src="/assets/images/card-pay/card-americanexpress.svg" alt="img" />
                    </div>
                    <h6 className="text-[15px] font-bold text-[#515365] dark:text-white-dark">
                        Mastercard
                        <span className="mt-1 block text-xs font-normal text-white-dark dark:text-white-light">XXXX XXXX XXXX 9704</span>
                    </h6>
                    <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                        <button className="btn btn-dark">Modifier</button>
                    </div>
                </div>
            </div>
            <div className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                <div className="flex items-start justify-between py-3">
                    <div className="flex-none ltr:mr-4 rtl:ml-4">
                        <Image width={32} height={32} src="/assets/images/card-pay/card-mastercard.svg" alt="img" />
                    </div>
                    <h6 className="text-[15px] font-bold text-[#515365] dark:text-white-dark">
                        American Express
                        <span className="mt-1 block text-xs font-normal text-white-dark dark:text-white-light">XXXX XXXX XXXX 310</span>
                    </h6>
                    <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                        <button className="btn btn-dark">Modifier</button>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex items-start justify-between py-3">
                    <div className="flex-none ltr:mr-4 rtl:ml-4">
                        <Image width={32} height={32} src="/assets/images/card-pay/card-visa.svg" alt="img" />
                    </div>
                    <h6 className="text-[15px] font-bold text-[#515365] dark:text-white-dark">
                        Visa
                        <span className="mt-1 block text-xs font-normal text-white-dark dark:text-white-light">XXXX XXXX XXXX 5264</span>
                    </h6>
                    <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                        <button className="btn btn-dark">Modifier</button>
                    </div>
                </div>
            </div>
        </CardBody>
        <CardFooter>
            <Button color="primary">Ajouter une Méthode de Paiement</Button>
        </CardFooter>
    </Card>
);

export const AddBillingAddressForm: React.FC = () => (
    <Card>
        <CardHeader className="flex flex-col items-start">
            <h5 className="mb-4 text-lg font-semibold">Ajouter une Adresse de Facturation</h5>
            <p>
                Modifiez vos nouvelles <span className="text-primary">informations de facturation</span>.
            </p>
        </CardHeader>
        <CardBody className="mb-5">
            <form>
                <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input label="Nom" type="text" placeholder="Entrez le Nom" />
                    <Input label="Email" type="email" placeholder="Entrez l'Email" />
                </div>
                <div className="mb-5">
                    <Input label="Adresse" type="text" placeholder="Entrez l'Adresse" />
                </div>
                <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input label="Ville" type="text" placeholder="Entrez la Ville" />

                    <Select label="État" className="w-full" placeholder="Entrez l'État">
                        <SelectItem key="AL" value="AL">
                            Alabama
                        </SelectItem>
                        <SelectItem key="AK" value="AK">
                            Alaska
                        </SelectItem>
                    </Select>
                </div>
                <div>
                    <Input label="Code Postal" type="text" placeholder="Entrez le Code Postal" />
                </div>
                <Button color="primary" className="mt-5">
                    Ajouter
                </Button>
            </form>
        </CardBody>
    </Card>
);

export const AddPaymentMethodForm: React.FC = () => (
    <Card>
        <CardHeader className="flex flex-col items-start">
            <h5 className="mb-4 text-lg font-semibold">Ajouter une Méthode de Paiement</h5>
            <p>
                Modifiez vos nouvelles <span className="text-primary">informations de méthode de paiement</span>.
            </p>
        </CardHeader>
        <CardBody className="mb-5">
            <form>
                <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Select label="Marque de Carte" className="w-full" placeholder="Sélectionnez la Marque de Carte">
                        <SelectItem key="Mastercard" value="Mastercard">
                            Mastercard
                        </SelectItem>
                        <SelectItem key="American Express" value="American Express">
                            American Express
                        </SelectItem>
                        <SelectItem key="Visa" value="Visa">
                            Visa
                        </SelectItem>
                        <SelectItem key="Discover" value="Discover">
                            Discover
                        </SelectItem>
                    </Select>
                    <Input label="Numéro de Carte" type="text" placeholder="Entrez le Numéro de Carte" />
                </div>
                <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input label="Nom du Titulaire" type="text" placeholder="Nom du Titulaire" />
                    <Input label="CVV/CVV2" type="text" placeholder="CVV" />
                </div>
                <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input label="Date d'Expiration" type="text" placeholder="Date d'Expiration" />
                </div>
                <Button color="primary" className="mt-5">
                    Ajouter
                </Button>
            </form>
        </CardBody>
    </Card>
);

export default function PaymentDetailsTab() {
    return (
        <div>
            <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <BillingAddressSection />
                <PaymentHistorySection />
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <AddBillingAddressForm />
                <AddPaymentMethodForm />
            </div>
        </div>
    );
}

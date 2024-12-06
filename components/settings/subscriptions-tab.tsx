'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { findAllSubscription } from '@/src/actions/subscriptions.actions';
import { ProfileSubscription } from '@/types/models';
import { IconArrowRight, IconCreditCard } from '@tabler/icons-react';
import { body, subtitle, title } from '../primitives';
import Link from 'next/link';
import { TbDotsVertical } from 'react-icons/tb';
import { useRouter } from 'next/navigation';

export function SubscritionSection({ current }: { current: ProfileSubscription | null }) {
    return current ? (
        <Card
            className={
                current.is_active
                    ? 'p-2 min-h-[400px] before:absolute before:-right-44 before:bottom-0 before:top-0 before:m-auto before:h-96 before:w-96 before:rounded-full before:bg-gray-800'
                    : 'p-2 min-h-[400px] before:absolute before:-right-44 before:bottom-0 before:top-0 before:m-auto before:h-96 before:w-96 before:rounded-full before:bg-gray-900'
            }
            style={{
                background: current.is_active
                    ? current.plan.name === 'STARTER'
                        ? 'linear-gradient(0deg,#1e3a8a -227%,#1d4ed8)'
                        : 'linear-gradient(0deg,#0d3d1a -227%,#087c29)'
                    : 'linear-gradient(0deg,#262c35 -227%,#464b54)',
            }}
        >
            <CardHeader className="mb-16 flex items-start justify-between text-white-light">
                <h5 className="text-lg space-x-2 font-semibold">
                    <span>Abonnement : </span>
                    <span>PLAN {current.plan.name}</span>
                </h5>
                <div className="relative flex flex-col whitespace-nowrap text-xl">
                    $ {current.price ?? 0}
                    {current.is_trial && (
                        <Chip size="sm" variant="bordered" color="warning">
                            Essai
                        </Chip>
                    )}
                </div>
            </CardHeader>
            {current.is_active ? (
                <CardBody className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <Chip color="success" size="sm">
                            Activé
                        </Chip>
                        <h2 className={`${title({ size: 'h4' })} text-white`}>Abonnement actif</h2>
                        <ul className="w-full list-disc gap-2 text-white">
                            <li className="list-item">Nombre maximum d&apos;organisation : {current.plan.max_organisations}</li>
                            <li className="list-item">Nombre maximum de membres par organisation : {current.plan.max_members_per_organisation}</li>
                        </ul>
                    </div>
                    <ul className="w-full flex flex-col justify-end items-end gap-2 text-white">
                        <li>Débute le :{new Date(current.start_date).toLocaleDateString()}</li>
                        <li>Finit le :{new Date(current?.end_date ?? '').toLocaleDateString()}</li>
                    </ul>
                    <div className="flex mt-4 items-center justify-between gap-2">
                        <Button variant="bordered" className="text-white">
                            Mettre à niveau
                        </Button>
                    </div>
                </CardBody>
            ) : (
                <CardBody className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <Chip color="danger" size="sm">
                            Inactif
                        </Chip>
                        <h2 className={`${title({ size: 'h4' })} text-white`}>Abonnement inactif</h2>
                        <p className={`${subtitle()} text-white`}>Vous devez payer pour activer votre abonnement</p>
                    </div>
                    <div className="flex mt-4 items-center justify-between gap-2">
                        {current.is_trial ? (
                            <Button as={Link} href="/pricing" variant="bordered" color="primary" className="text-white" endContent={<IconArrowRight size={16} />}>
                                Aller dans la section des plans
                            </Button>
                        ) : (
                            <Button startContent={<IconCreditCard />} variant="bordered" color="primary" className="text-white">
                                Passer au paiement
                            </Button>
                        )}
                    </div>
                </CardBody>
            )}
        </Card>
    ) : (
        <Card
            className="p-2 min-h-[400px] before:absolute before:-right-44 before:bottom-0 before:top-0 before:m-auto before:h-96 before:w-96 before:rounded-full before:bg-gray-600"
            style={{ background: 'linear-gradient(0deg,#4b5563 -227%,#6b7280)' }}
        >
            <CardHeader className="mb-16 flex items-start justify-between text-white-light"></CardHeader>
            <CardBody className="flex flex-col gap-20 px-10">
                <div>
                    <h2 className={`${title({ size: 'h4' })} text-white`}>Vous n&apos;avez pas souscrit à un plan</h2>
                    <p className={`${body()} text-white mt-2`}>Aller dans la section des plans pour souscrire à un plan</p>
                </div>
                <div>
                    <Button as={Link} href="/pricing" variant="bordered" className="text-white mt-4" endContent={<IconArrowRight size={16} />}>
                        Aller dans la section des plans
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}

export function SubscriptionHistorySection({ subscriptions }: { subscriptions: ProfileSubscription[] }) {
    return (
        <Card className=" max-h-[400px]">
            <CardHeader className="flex flex-col items-start">
                <h5 className="mb-4 text-lg font-semibold">Historique des abonnements</h5>
            </CardHeader>
            <CardBody className="mb-5">
                {subscriptions &&
                    subscriptions.map((subscription) => (
                        <div key={subscription.id} className="border-b border-[#ebedf2] dark:border-[#1b2e4b]">
                            <div className="flex items-start justify-between py-3">
                                <h6 className="text-[15px] font-bold ">
                                    Plan {subscription.plan.name}{' '}
                                    {subscription.is_trial && (
                                        <Chip size="sm" variant="bordered" color="warning">
                                            Essai
                                        </Chip>
                                    )}
                                    <span className="mt-1 block text-xs font-normal">Créé le {new Date(subscription.created_at).toLocaleDateString()}</span>
                                </h6>
                                <div className="flex items-start justify-between ltr:ml-auto rtl:mr-auto">
                                    <SubscriptionAction subscription={subscription} />
                                </div>
                            </div>
                        </div>
                    ))}
            </CardBody>
            <CardFooter className="flex flex-col">
                <p className={`${body({ size: 'caption' })} text-center`}>{subscriptions ? subscriptions.length : 0} abonnement.s</p>
            </CardFooter>
        </Card>
    );
}

export function SubscriptionAction({ subscription }: { subscription: ProfileSubscription }) {
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button isIconOnly variant="light">
                    <TbDotsVertical />
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">{!subscription.is_trial && !subscription.is_active ? <DropdownItem key="activate">Activer</DropdownItem> : <></>}</DropdownMenu>
        </Dropdown>
    );
}

export default function SubscriptionsTab() {
    const [subscriptions, setSubscription] = useState<ProfileSubscription[] | null>(null);
    const router = useRouter();
    useEffect(() => {
        findAllSubscription().then((data) => {
            setSubscription(data);
        });
        router.refresh();
    }, []);

    return (
        <div>
            <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <SubscritionSection current={subscriptions?.[0]!} />
                <SubscriptionHistorySection subscriptions={subscriptions!} />
            </div>
        </div>
    );
}

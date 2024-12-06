'use client';

import React from 'react';
import { useSession } from 'next-auth/react';

import { formatNumber } from '@/utils/formatNumber';
import { Avatar, Input, Card, CardBody } from '@nextui-org/react';

import { useState, useRef } from 'react';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import { siteConfig } from '@/config/site';
import { redirect, useSearchParams } from 'next/navigation';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';
import { subscribePlan, trialPlan } from '@/src/actions/plans.actions';
import { Plan } from '@/types/models';

const PriceCard = ({ plan }: { plan: Plan }) => {
    const [count, setCount] = useState(1);
    const formRef = useRef<HTMLFormElement>(null);
    const searchParams = useSearchParams();
    const trial = searchParams.get('trial');
    const { data: session } = useSession();

    const [state, formAction] = useFormState(
        async () => {
            if (!session) redirect('/auth');
            if (trial == 'true') {
                const result = await trialPlan(plan.id);
                if (result.status === 'success') {
                    toast.success(result.message || 'Bravo ! vous avez réussi');
                    redirect('/settings?tab=subscriptions');
                } else {
                    if (result.code == 406) {
                        toast.error('Vous avez déjà essayé LUNION-BOOKING');
                    } else {
                        toast.error(result.message || 'Erreur lors de la validation du code');
                    }
                }
                return result;
            } else {
                const result = await subscribePlan(plan.id, count);
                if (result.status === 'success') {
                    toast.success(result.message || 'Bravo ! vous avez réussi');
                    redirect('/settings?tab=subscriptions');
                } else {
                    toast.error(result.message || 'Erreur lors de la validation du code');
                }
                return result;
            }
        },
        {
            data: null,
            message: '',
            errors: {},
            status: 'idle',
            code: undefined,
        },
    );

    return (
        <Card className="w-full mx-auto max-w-sm p-4 md:p-8 shadow-md rounded-3xl">
            <div className="mb-4">
                <h2 className="text-2xl font-bold">{trial == 'true' ? 0 : formatNumber(plan.price_year * count)} $</h2>
                <p className="text-gray-500">Plan {plan?.name}</p>
            </div>

            <CardBody className="p-0 space-y-4">
                <div>
                    <form ref={formRef} action={formAction} className="space-y-8">
                        {trial == 'false' && (
                            <Input
                                name="count"
                                type="number"
                                min={1}
                                label={"Nombre d'année"}
                                labelPlacement="outside"
                                placeholder="Nombre d'année"
                                value={String(count)}
                                onValueChange={(value) => {
                                    if (value) setCount(parseInt(value));
                                    else setCount(1);
                                }}
                                className="h-9 text-sm rounded-full"
                                required
                            />
                        )}

                        <SubmitButton>{trial == 'true' ? 'Essayer' : 'Souscrire'}</SubmitButton>
                    </form>
                </div>

                <div className="pt-2">
                    <h3 className="font-semibold text-sm mb-2">Contactez l&apos;agent</h3>
                    <div className="flex items-center space-x-3">
                        <Avatar src="/assets/images/icone/white.svg" alt="Logo" className="object-contain bg-primary w-12 h-12 border border-primary p-2" />

                        <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{siteConfig.contacts.tel}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{siteConfig.contacts.email}</p>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
export default PriceCard;

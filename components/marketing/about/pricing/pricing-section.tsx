import { TbCheck, TbHelpCircle } from 'react-icons/tb';
import { IconX } from '@tabler/icons-react';
import { Button } from '@nextui-org/react';
import React from 'react';
import { subtitle, title } from '@/components/primitives';
import { features, tiers, featureAvailability } from '@/config/plans';
import Link from 'next/link';
import Motion from '@/components/motion';

export default async function PricingSection({ details }: { details: boolean }) {
    return (
        <section className="container">
            <div className="px-4 md:px-6 py-12">
                <Motion variant="verticalSlideIn">
                    <div className="text-center space-y-4 py-6 max-w-screen-lg mx-auto">
                        <h1 className={title({ size: 'h1', class: 'text-primary tracking-tight' })}>Tarification</h1>
                        <h4 className={subtitle({ class: 'font-medium mb-2 text-balance w-full tracking-tighter' })}>
                            Découvrez notre solution complète de gestion immobilière : de l&apos;authentification sécurisée à la gestion avancée des biens, en passant par le CRM intégré et les
                            analyses en temps réel. Une plateforme tout-en-un pour digitaliser et optimiser votre activité immobilière.
                        </h4>
                    </div>
                </Motion>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                {details && <th className="p-4 bg-background text-left font-medium"></th>}
                                {tiers.map((tier) => (
                                    <th key={tier.name} className="p-4 text-center bg-background font-medium">
                                        <Motion variant="verticalSlideIn">
                                            <div className={`rounded-2xl p-6 ${tier.popular ? 'bg-primary/5 ring-2 ring-primary' : 'border'}`}>
                                                {tier.popular && <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block">Plus populaire</span>}
                                                <div className="text-lg font-semibold mb-2">{tier.name}</div>
                                                <div className="flex items-baseline justify-center mb-1">
                                                    <span className="text-4xl font-bold">{tier.priceAmount === null ? tier.price : tier.priceAmount === 0 ? 'Gratuit' : `${tier.price}`}</span>
                                                    {tier.priceAmount !== 0 && tier.priceAmount !== null && (
                                                        <span className="text-xl font-normal text-gray-500 dark:text-gray-400 ml-1">{tier.duration}</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 h-8">{tier.priceAmount === 0 ? tier.duration : tier.billing}</div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400  mb-6 h-12">{tier.description}</p>
                                                <div className="text-sm text-gray-500 dark:text-gray-400  mt-2">
                                                    <div>
                                                        Jusqu&apos;à {tier.limits.organizations} {tier.limits.organizations === 1 ? 'organisation' : 'organisations'}
                                                    </div>
                                                    <div>
                                                        {tier.limits.membersPerOrg} {typeof tier.limits.membersPerOrg === 'number' ? `membres/org` : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </Motion>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        {details ? (
                            <tbody>
                                <tr>
                                    <td></td>
                                    {tiers.map((tier) => (
                                        <td key={`button-${tier.name}`} className="p-4 text-center">
                                            <Motion variant="verticalSlideIn">
                                                <Button
                                                    as={Link}
                                                    href={'/pricing/' + tier.name + (tier.price == 'Free' ? '?trial=true' : '?trial=false')}
                                                    color={tier.price != 'Free' ? 'primary' : 'secondary'}
                                                    className="w-full"
                                                >
                                                    {tier.buttonText}
                                                </Button>
                                            </Motion>
                                        </td>
                                    ))}
                                </tr>
                                {features.map((category) => (
                                    <React.Fragment key={category.category}>
                                        <tr className="border-t border-gray-100">
                                            <td colSpan={5} className="py-4 px-4">
                                                <Motion variant="verticalSlideIn">
                                                    <span className="font-semibold text-primary">{category.category}</span>
                                                </Motion>
                                            </td>
                                        </tr>
                                        {category.features.map((feature) => (
                                            <tr key={feature} className="border-t border-gray-100">
                                                <td className="py-4 px-4 flex items-center">
                                                    <span className="font-medium">{feature}</span>
                                                    <TbHelpCircle className="ml-2 h-4 w-4 text-gray-400" aria-label={`Plus d'informations sur ${feature}`} />
                                                </td>
                                                {tiers.map((tier) => (
                                                    <td key={`${tier.name}-${feature}`} className="py-4 px-4 text-center">
                                                        {typeof featureAvailability[tier.name][feature] === 'boolean' ? (
                                                            featureAvailability[tier.name][feature] ? (
                                                                <TbCheck className="mx-auto h-5 w-5 text-primary" aria-label="Inclus" />
                                                            ) : (
                                                                <IconX className="mx-auto h-5 w-5 text-gray-300" aria-label="Non inclus" />
                                                            )
                                                        ) : (
                                                            <span className="text-sm text-gray-600">{featureAvailability[tier.name][feature]}</span>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        ) : (
                            <tbody>
                                <tr>
                                    {tiers.map((tier) => (
                                        <td key={`button-${tier.name}`} className="p-4 text-center">
                                            <Motion variant="verticalSlideIn">
                                                <Button
                                                    as={Link}
                                                    href={'/pricing/' + tier.name + (tier.price == 'Free' ? '?trial=true' : '?trial=false')}
                                                    color={tier.price != 'Free' ? 'primary' : 'secondary'}
                                                    className="w-full"
                                                >
                                                    {tier.buttonText}
                                                </Button>
                                            </Motion>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
                <p className="mt-12 text-center text-sm text-gray-500">L&apos;essai gratuit de 30 jours comprend toutes les fonctionalités. Aucune carte bancaire requise.</p>
            </div>
        </section>
    );
}

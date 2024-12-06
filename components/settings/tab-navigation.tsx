'use client';
import React from 'react';
import IconDollarSignCircle from '@/components/icon/icon-dollar-sign-circle';
import IconHome from '@/components/icon/icon-home';
import IconPhone from '@/components/icon/icon-phone';
import IconUser from '@/components/icon/icon-user';
import { TabName } from './users-account-settings-tabs';
import { IconCreditCard } from '@tabler/icons-react';

// 1. TabNavigation Component
export default function TabNavigation({ currentTab, onTabChange }: { currentTab: TabName; onTabChange: (tab: TabName) => void }) {
    const tabs = [
        { name: 'home', icon: <IconHome />, label: 'Général' },
        { name: 'subscriptions', icon: <IconCreditCard className="h-5 w-5"  />, label: 'Abonnements' },
        // { name: 'payment-details', icon: <IconDollarSignCircle />, label: 'Informations de paiement' },
        { name: 'preferences', icon: <IconUser className="h-5 w-5" />, label: 'Préférences' },
        { name: 'danger-zone', icon: <IconPhone />, label: 'Zone de danger' },
    ];

    return (
        <ul className="mb-5 overflow-y-auto whitespace-nowrap border-b border-[#ebedf2] font-semibold dark:border-[#3f121a] sm:flex">
            {tabs.map((tab) => (
                <li key={tab.name} className="inline-block">
                    <button
                        onClick={() => onTabChange(tab.name as TabName)}
                        className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary 
                            ${currentTab === tab.name ? '!border-primary text-primary' : ''}`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                </li>
            ))}
        </ul>
    );
}

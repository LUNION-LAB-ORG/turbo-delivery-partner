'use client';
import React, { useEffect, useState } from 'react';
import { Profile } from '@/types/models';
import HomeTab from './home-tab';
import PaymentDetailsTab from './payment-details-tab';
import PreferencesTab from './preferences-tab';
import DangerZoneTab from './danger-zone-tab';
import TabNavigation from './tab-navigation';
import SubscriptionsTab from './subscriptions-tab';

export type TabName = 'home' | 'subscriptions' | 'payment-details' | 'preferences' | 'danger-zone';

const UsersAccountSettingsTabs: React.FC<{ profile: Profile }> = ({ profile }) => {
    const [currentTab, setCurrentTab] = useState<TabName>('home');
    const handleTabChange = (tab: TabName) => {
        setCurrentTab(tab);

        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.pushState({}, '', url);
    };
    useEffect(() => {
        const url = new URL(window.location.href);
        const tab = url.searchParams.get('tab');
        if (tab) {
            setCurrentTab(tab as TabName);
        } else {
            setCurrentTab('home' as TabName);
            url.searchParams.set('tab', 'home');
            window.history.pushState({}, '', url);
        }
    }, []);

    return (
        <>
            <TabNavigation currentTab={currentTab} onTabChange={handleTabChange} />
            {currentTab === 'home' && <HomeTab profile={profile} />}
            {currentTab === 'subscriptions' && <SubscriptionsTab />}
            {currentTab === 'payment-details' && <PaymentDetailsTab />}
            {currentTab === 'preferences' && <PreferencesTab />}
            {currentTab === 'danger-zone' && <DangerZoneTab />}
        </>
    );
};

export default UsersAccountSettingsTabs;

import { ButtonBack } from '@/components/ui/navigation-ui/button-back';
import { account } from '@/data';
import { title } from '@/components/primitives';
import { AccountForm } from '@/components/dashboard/settings/account/account-form';
import { Divider } from '@nextui-org/react';

export default function Account() {
    const acc = account;
    return (
        <div className="w-full h-full gap-4 lg:gap-6">
            <ButtonBack className="bg-background" link="/settings" size="sm" />
            <div className="space-y-4 mt-4">
                <h1 className={title({ size: 'h3', class: 'text-primary' })}>Compte</h1>
                <Divider />
                <AccountForm account={acc} />
            </div>
        </div>
    );
}

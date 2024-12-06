'use client';
import React from 'react';
import { IconBrandFacebook, IconBrandGithub, IconBrandLinkedin, IconBrandTwitter } from '@tabler/icons-react';
import { Profile } from '@/types/models';
import { Avatar, Button, Input } from '@nextui-org/react';

export const GeneralInfoForm: React.FC<{ profile: Profile }> = ({ profile }) => (
    <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#3f121a] dark:bg-black">
        <h6 className="mb-5 text-lg font-bold">Informations générales</h6>
        <div className="flex flex-col sm:flex-row">
            <div className="mb-5 w-full sm:w-2/12 ltr:sm:mr-4 rtl:sm:ml-4">
                <Avatar className="w-20 h-20 md:h-32 md:w-32 object-cover" radius="full" src={profile.avatar_url!} alt={profile.first_name} />
            </div>
            <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
                <Input disabled label="Nom" type="text" placeholder={`${profile.last_name}`} className="form-input" />
                <Input disabled label="Prénom" type="text" placeholder={profile.first_name} className="form-input" />
                <Input disabled label="Pays" type="text" placeholder={profile.country ?? ''} className="form-input" />
                <Input disabled label="Adresse" type="text" placeholder={profile.address ?? ''} className="form-input" />
                <Input disabled label="Ville" type="text" placeholder={profile.city ?? ''} className="form-input" />
                <Input disabled label="Téléphone" type="text" placeholder={profile.phone ?? ''} className="form-input" />
                <Input disabled label="Email" type="email" placeholder={profile.email ?? ''} className="form-input" />
            </div>
        </div>
        <div className="mt-3 sm:col-span-2">
            <Button color="primary">Sauvegarder</Button>
        </div>
    </form>
);

export const SocialForm: React.FC<{ profile: Profile }> = ({ profile }) => (
    <form className="rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#3f121a] dark:bg-black">
        <h6 className="mb-5 text-lg font-bold">Social</h6>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex">
                <div className="flex items-center justify-center rounded bg-[#eee] px-3 font-semibold ltr:mr-2 rtl:ml-2 dark:bg-[#1b2e4b]">
                    <IconBrandLinkedin className="h-5 w-5" />
                </div>
                <input type="text" placeholder="jimmy_turner" className="form-input" />
            </div>
            <div className="flex">
                <div className="flex items-center justify-center rounded bg-[#eee] px-3 font-semibold ltr:mr-2 rtl:ml-2 dark:bg-[#1b2e4b]">
                    <IconBrandTwitter className="h-5 w-5" />
                </div>
                <input type="text" placeholder="jimmy_turner" className="form-input" />
            </div>
            <div className="flex">
                <div className="flex items-center justify-center rounded bg-[#eee] px-3 font-semibold ltr:mr-2 rtl:ml-2 dark:bg-[#1b2e4b]">
                    <IconBrandFacebook className="h-5 w-5" />
                </div>
                <input type="text" placeholder="jimmy_turner" className="form-input" />
            </div>
            <div className="flex">
                <div className="flex items-center justify-center rounded bg-[#eee] px-3 font-semibold ltr:mr-2 rtl:ml-2 dark:bg-[#1b2e4b]">
                    <IconBrandGithub />
                </div>
                <input type="text" placeholder="jimmy_turner" className="form-input" />
            </div>
        </div>
    </form>
);

export default function HomeTab({ profile }: { profile: Profile }) {
    return (
        <div>
            <GeneralInfoForm profile={profile} />
        </div>
    );
}

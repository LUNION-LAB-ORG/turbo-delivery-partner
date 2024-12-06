'use client';
import { Button, Card, CardBody, CardFooter, CardHeader, Switch } from '@nextui-org/react';
import Image from 'next/image';
import React from 'react';

import { useDispatch } from 'react-redux';
import { toggleTheme } from '@/store/themeConfigSlice';
import { useTheme } from 'next-themes';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';

export const ThemeSelectionSection: React.FC = () => {
    const dispatch = useDispatch();
    const { setTheme } = useTheme();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    return (
        <Card>
            <CardHeader>
                <h5 className="mb-4 text-lg font-semibold">Choisir le thème</h5>
            </CardHeader>
            <CardBody>
                <div className="flex justify-around">
                    <label
                        className="inline-flex cursor-pointer"
                        onClick={() => {
                            dispatch(toggleTheme('light'));
                            setTheme('light');
                        }}
                    >
                        <input className="form-radio cursor-pointer ltr:mr-4 rtl:ml-4" checked={themeConfig.theme === 'light'} type="radio" name="flexRadioDefault" />
                        <span>
                            <Image className="ms-3" width={100} height={68} alt="settings-light" src="/assets/images/illustrations/settings-light.svg" />
                        </span>
                    </label>

                    <label
                        className="inline-flex cursor-pointer"
                        onClick={() => {
                            dispatch(toggleTheme('dark'));
                            setTheme('dark');
                        }}
                    >
                        <input className="form-radio cursor-pointer ltr:mr-4 rtl:ml-4" checked={themeConfig.theme === 'dark'} type="radio" name="flexRadioDefault" />
                        <span>
                            <Image className="ms-3" width={100} height={68} alt="settings-light" src="/assets/images/illustrations/settings-dark.svg" />
                        </span>
                    </label>
                </div>
            </CardBody>
        </Card>
    );
};

export const ActivityDataSection: React.FC = () => (
    <Card>
        <CardHeader>
            <h5 className="mb-4 text-lg font-semibold">Données d&apos;activité</h5>
        </CardHeader>
        <CardBody>
            <p>Téléchargez votre résumé, tâches et historique des paiements</p>
        </CardBody>
        <CardFooter>
            <Button color="primary">Télécharger les données</Button>
        </CardFooter>
    </Card>
);

export const ToggleSwitch: React.FC<{
    title: string;
    description: string;
    primaryText?: string;
}> = ({ title, description, primaryText }) => (
    <Card>
        <CardHeader>
            <h5 className="mb-4 text-lg font-semibold">{title}</h5>
        </CardHeader>
        <CardBody>
            <p>
                {primaryText ? (
                    <>
                        Votre <span className="text-primary">{primaryText}</span> {description}
                    </>
                ) : (
                    description
                )}
            </p>
        </CardBody>
        <CardFooter>
            <Switch />
        </CardFooter>
    </Card>
);

export default function PreferencesTab() {
    return (
        <div>
            <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <ThemeSelectionSection />
                <ActivityDataSection />
            </div>
            {/* <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <ToggleSwitch title="Profil Public" description="sera visible par n'importe qui sur le réseau" primaryText="Profil" />
                <ToggleSwitch title="Afficher mon email" description="sera visible par n'importe qui sur le réseau" primaryText="Email" />
                <ToggleSwitch title="Activer les raccourcis clavier" description="sera visible par n'importe qui sur le réseau" primaryText="Raccourcis clavier" />
                <ToggleSwitch title="Masquer la navigation gauche" description="sera visible par n'importe qui sur le réseau" primaryText="Masquer la navigation gauche" />
                <ToggleSwitch title="Publicités" description="sera visible par n'importe qui sur le réseau" primaryText="Publicités" />
                <ToggleSwitch title="Profil Social" description="sera visible par n'importe qui sur le réseau" primaryText="Profil Social" />
            </div> */}
        </div>
    );
}

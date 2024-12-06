'use client';

import { Input, DateInput } from '@nextui-org/react';
import { useFormState } from 'react-dom';
import { useState } from 'react';

import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import { InputPhone } from '@/components/ui/form-ui/input-phone';
import { SelectCountry } from '@/components/ui/form-ui/select-country';
import { toast } from 'react-toastify';
import { createProfile } from '@/src/actions/auth.actions';

export function FormUserInfo() {
    const [contact, setContact] = useState<string>('');
    const [country, setCountry] = useState<string>('');

    const [state, formAction] = useFormState(
        async (prevState: any, formData: FormData) => {
            const result = await createProfile(prevState, formData);

            if (result.status === 'success') {
                toast.success(result.message || 'Bravo ! vous avez réussi');
            } else {
                toast.error(result.message || 'Erreur lors de la validation du code');
            }

            return result;
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
        <form action={formAction} className="mx-auto prose grid w-full max-w-sm gap-4">
            <div className="text-center">
                <h1>Terminer l&apos;enregistrement</h1>
                <p className="text-sm">Completez vos informations personnelles</p>
            </div>

            <div className="grid gap-2">
                <Input
                    isRequired
                    required
                    errorMessage={state?.errors?.last_name ?? ''}
                    isInvalid={!!state?.errors?.last_name}
                    label="Nom"
                    labelPlacement="outside"
                    name="last_name"
                    placeholder="Entrer votre nom de famille"
                    type="text"
                    variant="flat"
                />
                <Input
                    isRequired
                    required
                    errorMessage={state?.errors?.first_name ?? ''}
                    isInvalid={!!state?.errors?.first_name}
                    label="Prénoms"
                    labelPlacement="outside"
                    name="first_name"
                    placeholder="Entrer votre prénom"
                    type="text"
                    variant="flat"
                />

                <DateInput
                    isRequired
                    errorMessage={state?.errors?.birthdate ?? ''}
                    isInvalid={!!state?.errors?.birthdate}
                    label="Date de naissance"
                    labelPlacement="outside"
                    name="birthdate"
                    variant="flat"
                />

                <SelectCountry
                    isRequired
                    required
                    errorMessage={state?.errors?.country ?? ''}
                    isInvalid={!!state?.errors?.country}
                    label="Pays"
                    labelPlacement="outside"
                    name="country"
                    placeholder="Entre votre pays d'origine"
                    setValue={(value: string) => setCountry(value)}
                    value={country}
                />

                <InputPhone
                    isRequired
                    required
                    errorMessage={state?.errors?.phone_number}
                    isInvalid={!!state?.errors?.phone_number}
                    label="Téléphone"
                    name="phone"
                    placeholder="Téléphone"
                    setValue={(value: string) => setContact(value)}
                    value={contact}
                />

                <SubmitButton>Terminer</SubmitButton>
            </div>
        </form>
    );
}

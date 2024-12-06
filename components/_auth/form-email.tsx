'use client';

import { Divider, Input } from '@nextui-org/react';
import { useFormState } from 'react-dom';
import { IconMail } from '@tabler/icons-react';
import ButtonSigninWithGoogle from '@/components/ui/form-ui/button-signinWithGoogle';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import { register } from '@/src/actions/auth.actions';
import { toast } from 'react-toastify';

export function FormEmail() {
    const [state, formAction] = useFormState(
        async (prevState: any, formData: FormData) => {
            const result = await register(prevState, formData);

            if (result.status === 'success') {
                toast.success(result.message || 'Bravo ! vous avez réussi');
            } else {
                toast.error(result.message || "Erreur lors de l'envoi de l'email");
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
            <div className="grid gap-2 text-center">
                <h1>Connexion ou inscription</h1>
            </div>
            <div className="grid gap-4">
                <Input
                    isRequired
                    required
                    errorMessage={state?.errors?.email ?? ''}
                    isInvalid={!!state?.errors?.email}
                    label="Email"
                    name="email"
                    startContent={<IconMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                    type="email"
                    variant="flat"
                />

                <SubmitButton>Continuer</SubmitButton>
                <p className="text-sm text-muted-foreground text-center">{`Nous vous enverrons un code de validation dans votre boîte de réception. Le code de validation peut parfois se retrouver dans les spams.`}</p>

                <p className="mt-2 text-center text-sm text-muted-foreground">ou</p>
                <Divider className="my-4" />
                <ButtonSigninWithGoogle redirectTo="/" />
            </div>
        </form>
    );
}

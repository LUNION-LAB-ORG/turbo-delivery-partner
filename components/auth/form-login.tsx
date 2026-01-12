'use client';

import React from 'react';
import Link from 'next/link';
import { Input } from "@heroui/react";
import { toast } from 'react-toastify';
import { Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { body } from '@/components/primitives';
import { loginUser } from '@/src/actions/users.actions';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';

export function FormLogin() {
    const router = useRouter();

    const [state, formAction] = React.useActionState(
        async (prevState: any, formData: FormData) => {
            const result = await loginUser(prevState, formData);

            if (result.status === 'error') {
                toast.error(result.message);
            } else {
                toast.success(result.message);

                // ✅ Redirection côté client après affichage du toast
                setTimeout(() => {
                    window.location.href = '/';
                }, 500); // 500ms pour que le toast s'affiche
                // router.push('/');
            }

            return result;
        },
        {
            data: null,
            message: '',
            errors: {},
            status: 'idle',
            code: undefined,
        }
    );


    return (
        <form action={formAction} className="mt-8 space-y-6">
            <div className="grid gap-2">
                <Input
                    isRequired
                    required
                    errorMessage={state?.errors?.username ?? ''}
                    isInvalid={!!state?.errors?.username}
                    label="Nom d'utilisateur"
                    name="username"
                    startContent={<User className="size-4 text-default-400" />}
                    type="text"
                    variant="bordered"
                    radius="sm"
                />

                <Input
                    isRequired
                    required
                    errorMessage={state?.errors?.password ?? ''}
                    isInvalid={!!state?.errors?.password}
                    label="Mot de passe"
                    name="password"
                    startContent={<Lock className="size-4 text-default-400" />}
                    type="password"
                    variant="bordered"
                    radius="sm"
                />
            </div>

            <div className="flex items-center justify-between">
                <Link href="/auth/recover-password" className={body({ size: 'caption', className: 'text-primary hover:underlined' })}>
                    Mot de passe oublié ?
                </Link>
            </div>
            <div>
                <SubmitButton>Connexion</SubmitButton>
            </div>
        </form>
    );
}

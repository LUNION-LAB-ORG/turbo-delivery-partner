'use client';

import { Divider } from '@nextui-org/react';
import { useFormState } from 'react-dom';

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/form-ui/input-otp';
import { resendEmail, registerVerify } from '@/src/actions/auth.actions';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import ButtonSigninWithGoogle from '@/components/ui/form-ui/button-signinWithGoogle';
import { toast } from 'react-toastify';

export function FormOTP() {
    const [, formAction] = useFormState(
        async (prevState: any, formData: FormData) => {
            const result = await registerVerify(prevState, formData);

            if (result.status === 'success') {
                if (typeof window !== 'undefined') {
                    window.location.href = '/';
                }
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
            <div className="grid gap-2 text-center">
                <h1>Validation du code</h1>
            </div>
            <div className="grid gap-4">
                <InputOTP className="mx-auto" required maxLength={6} name="token">
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>

                <SubmitButton>Continuer</SubmitButton>

                <p className="text-sm text-center">{`Nous vous enverrons un code de validation dans votre boîte de réception. Le code de validation peut parfois se retrouver dans les spams.`}</p>
                <button className="text-sm text-primary cursor-pointer text-center hover:underline" onClick={async () => await resendEmail()}>
                    Renvoyer le code
                </button>
                <p className="mt-2 text-center text-sm text-gray-500">ou</p>
                <Divider className="my-4" />
                <ButtonSigninWithGoogle redirectTo="/" />
            </div>
        </form>
    );
}

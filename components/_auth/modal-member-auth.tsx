'use client';

import { Input, Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/react';
import { useFormState } from 'react-dom';
import { IconLock } from '@tabler/icons-react';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import { toast } from 'react-toastify';
import { loginMember } from '@/src/actions/member.actions';
import { Organisation } from '@/types/models';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

type OrganisationResponse = Organisation & { isMember: boolean; hasPasswordMember: boolean };

export function ModalMemberAuth({ reference, organisation }: { reference: string; organisation: OrganisationResponse | null }) {
    const { data: session } = useSession();
    const user = session?.user;
    const searchParams = useSearchParams();
    const memberAuth = searchParams.get('member_auth');
    const [state, formAction] = useFormState(
        async (prevState: any, formData: FormData) => {
            const result = await loginMember(prevState, formData, reference);

            if (result.status === 'success') {
                toast.success(result.message || 'Bravo ! vous avez réussi');
                if (typeof window !== 'undefined') {
                    const url = new URL(window.location.href);
                    url.searchParams.delete('member_auth');
                    window.location.href = url.toString();
                }
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

    if (organisation && !organisation.hasPasswordMember) {
        return (
            <Modal isOpen={true} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <h1>
                            Première connexion à l&apos;organisation : <span className="uppercase text-primary">{organisation.name}</span>
                        </h1>
                    </ModalHeader>
                    <ModalBody>
                        <div className="">
                            <p>Pour garantir la sécurité de votre compte, veuillez créer un mot de passe d&apos;au moins 4 caractères.</p>
                        </div>
                        <form action={formAction}>
                            <div className="grid gap-4">
                                <Input
                                    isRequired
                                    required
                                    errorMessage={state?.errors?.password ?? ''}
                                    isInvalid={!!state?.errors?.password}
                                    label="Créer votre mot de passe"
                                    labelPlacement="outside"
                                    name="password"
                                    startContent={<IconLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                                    type="password"
                                    variant="flat"
                                />
                                <Input
                                    isRequired
                                    required
                                    errorMessage={state?.errors?.confirm ?? ''}
                                    isInvalid={!!state?.errors?.confirm}
                                    label="Confirmer votre mot de passe"
                                    labelPlacement="outside"
                                    name="confirm"
                                    startContent={<IconLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                                    type="password"
                                    variant="flat"
                                />

                                <SubmitButton>Continuer</SubmitButton>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        );
    }
    if (organisation && user && user.organisationReference !== null && user.organisationReference !== reference || organisation && user && user.organisationReference == null) {
        return (
            <Modal isOpen={true} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <h1>Veuillez vous connecter à l&apos;organisation : {organisation.name}</h1>
                    </ModalHeader>
                    <ModalBody>
                        <form action={formAction}>
                            <div className="grid gap-4">
                                <Input
                                    isRequired
                                    required
                                    errorMessage={state?.errors?.password ?? ''}
                                    isInvalid={!!state?.errors?.password}
                                    label="Veuillez entrer votre mot de passe"
                                    name="password"
                                    startContent={<IconLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                                    type="password"
                                    variant="flat"
                                />

                                <SubmitButton>Continuer</SubmitButton>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        );
    }
    if (memberAuth && memberAuth == 'true') {
        return (
            <Modal isOpen={true} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <h1>Votre session a expiré, veuillez vous connecter à l&apos;organisation</h1>
                    </ModalHeader>
                    <ModalBody>
                        <form action={formAction}>
                            <div className="grid gap-4">
                                <Input
                                    isRequired
                                    required
                                    errorMessage={state?.errors?.password ?? ''}
                                    isInvalid={!!state?.errors?.password}
                                    label="Veuillez entrer votre mot de passe"
                                    name="password"
                                    startContent={<IconLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                                    type="password"
                                    variant="flat"
                                />

                                <SubmitButton>Continuer</SubmitButton>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        );
    }

    return <></>;
}

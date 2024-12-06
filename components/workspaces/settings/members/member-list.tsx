import { Button, Card, CardBody, CardFooter, CardHeader, Select, SelectItem } from '@nextui-org/react';
    import { Input } from '@nextui-org/react';
import { Divider } from '@nextui-org/react';

import { body, title } from '@/components/primitives';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import { Member, ProfileSubscription, Role } from '@/types/models';
import { _createOrganisationSchema } from '@/src/schemas/organisation.schema';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';
import { createInvitation } from '@/src/actions/invitations.actions';
import { _createInvitationSchema, createInvitationSchema } from '@/src/schemas/invitations.schema';

export const MembersList = ({ reference, roles, members,subscription }: { reference: string; roles: Role[] | null; members: Member[] | null,subscription:ProfileSubscription | null,  }) => {
    const router = useRouter();

    const [, formAction] = useFormState(
        async (prevState: any, formData: FormData) => {
            const result = await createInvitation(prevState, formData, reference);

            if (result.status === 'success') {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
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

    const {
        formState: { errors },
        control,
    } = useForm<_createInvitationSchema>({
        resolver: zodResolver(createInvitationSchema),
        defaultValues: {
            role: '',
            email: '',
        },
    });

    const rolesSelection = roles ? roles.map((role) => ({ label: role.name, value: role.id })) : [];
    return (
        <form action={formAction} className="flex flex-col gap-4">
            <Card className="max-w-screen-xl p-1">
                <CardHeader>
                    <div className="flex flex-col gap-2 w-full">
                        <h1
                            className={title({
                                size: 'h5',
                                className: 'max-w-screen-sm',
                            })}
                        >
                            Inviter un membre
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-screen-sm">Inviter un membre à rejoindre l&apos;organisation</p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input isRequired aria-label="manager name input" label="Adresse email" labelPlacement="outside" name="email" placeholder="Entrez l'adresse email" radius="sm" />
                        <Controller
                            control={control}
                            name="role"
                            render={({ field }) => {
                                const isValueInCollection = rolesSelection.some((cat: any) => cat.value === field.value);

                                return (
                                    <Select
                                        {...field}
                                        isRequired
                                        required
                                        aria-invalid={errors.role ? 'true' : 'false'}
                                        aria-label="roles Select"
                                        disabled={!rolesSelection}
                                        isInvalid={!!errors.role}
                                        label="Rôle"
                                        labelPlacement="outside"
                                        name="role"
                                        placeholder="Entrez le rôle"
                                        radius="sm"
                                        selectedKeys={isValueInCollection ? [field.value] : []}
                                    >
                                        {rolesSelection.map((cat: any) => (
                                            <SelectItem key={cat.value} color="primary" textValue={cat.label} value={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                );
                            }} 
                        />
                    </div>
                    <div className="flex mt-4">
                        <SubmitButton className="w-fit" color="primary" size="sm" type="submit">
                            Ajouter un membre
                        </SubmitButton>
                    </div>
                </CardBody>
                <Divider />
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 items-center">
                    <span className={body({ size: 'caption' })}>
                        {members?.length} / <span className='text-primary font-bold'>{subscription?.plan.max_members_per_organisation}</span> membres.
                    </span>
                    <Button color="primary" variant="bordered">
                        Mise à niveau
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
};

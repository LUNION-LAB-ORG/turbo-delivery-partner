'use client';

import { Card, CardBody, CardFooter, CardHeader, Input, Divider } from "@heroui/react";
import { useFormState } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { body, title } from '@/components/primitives';
import { SubmitButton } from '@/components/ui/form-ui/submit-button';
import { Restaurant } from '@/types/models';
import SelectLocationMap from './SelectLocationMap';
import { updateRestaurant } from '@/src/actions/restaurant.actions';

export const RestaurantForm = ({ restaurant }: { restaurant: Restaurant }) => {
    console.log(restaurant);

    const [, formAction] = useFormState(
        async (prevState: any, formData: FormData) => {
            console.log(formData);
            const result = updateRestaurant(formData);
            console.log(result)
            // router.refresh();
            return result;
        },
        {
            data: null,
            message: '',
            errors: undefined,
            status: 'idle',
        },
    );

    const {
        formState: { errors },
        control,
        handleSubmit,
    } = useForm<any>({
        defaultValues: {
            nomEtablissement: restaurant?.nomEtablissement,
            latitude: restaurant?.latitude ?? 5.345317,
            longitude: restaurant?.longitude ?? -4.024429,
        },
    });
    
    const onSubmit = async (data: any) => {
        const formattedData = {
            ...data,
            latitude: String(data.latitude),
            longitude: String(data.longitude),
        };
        const result = await updateRestaurant(formattedData);
        console.log(result);
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="max-w-screen-lg p-1">
                <CardHeader>
                    <div className="flex flex-col gap-2 w-full">
                        <h1
                            className={title({
                                size: 'h5',
                                className: 'max-w-screen-sm',
                            })}
                        >
                            Nom du restaurant
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-screen-sm">C&apos;est le nom visible de votre restaurant au sein de Lunion-Booking.</p>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="">
                        <div className="mb-8">
                            <Controller
                                control={control}
                                name="nomEtablissement"
                                render={({ field }) => (
                                <Input
                                    {...field}
                                    isRequired
                                    aria-invalid={errors.nomEtablissement ? 'true' : 'false'}
                                    aria-label="nomEtablissement input"
                                    name="nomEtablissement"
                                    placeholder="Entrez le nom du restaurant"
                                    radius="sm"
                                    type="text"
                                    value={field.value ?? ''}
                                />
                                )}
                            />
                        </div>


                        <Controller
                            control={control}
                            name="latitude"
                            render={({ field: { onChange: onLatChange, value: lat } }) => (
                                <Controller
                                    control={control}
                                    name="longitude"
                                    render={({ field: { onChange: onLngChange, value: lng } }) => (
                                        <div>
                                        <label className="block font-semibold mb-4">Sélectionnez l'emplacement de votre restaurant sur la carte :</label>
                                        <SelectLocationMap
                                            value={{ lat, lng }}
                                            onChange={({ lat, lng }) => {
                                                onLatChange(lat);
                                                onLngChange(lng);
                                            }}
                                        />
                                        </div>
                                    )}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="latitude"
                            render={({ field }) => (
                                <input type="hidden" {...field} />
                            )}
                        />
                        <Controller
                            control={control}
                            name="longitude"
                            render={({ field }) => (
                                <input type="hidden" {...field} />
                            )}
                        />

                    </div>
                </CardBody>
                <Divider />
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 items-center">
                    <span className={body({ size: 'caption' })}>Veuillez utiliser 32 caractères au maximum.</span>
                    <SubmitButton className="w-fit" color="primary" type="submit">
                        Sauvegarder
                    </SubmitButton>
                </CardFooter>
            </Card>
        </form>
    );
};

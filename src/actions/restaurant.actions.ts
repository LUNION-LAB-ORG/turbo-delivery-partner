'use server';

import { createFormData, processFormData } from '@/utils/formdata-zod.utilities';
import { TrimPhoneNumber } from '@/utils/trim-phone-number';
import { apiClient } from '@/lib/api-client';
import { ActionResult } from '@/types/index.d';
import restaurantEndpoints from '@/src/endpoints/restaurants.endpoint';

import { createRestaurantSchema } from '../schemas/restaurants.schema';
import { redirect } from 'next/navigation';
import { FindOneRestaurant } from '@/types/models';

export async function createRestaurant(prevState: any, formData: FormData): Promise<ActionResult<any>> {
    const { success, data: formdata } = processFormData(
        createRestaurantSchema,
        formData,
        {
            useDynamicValidation: true,
            excludeFields: ['telephoneCountry'],
            transformations: {
                telephone: (value) => TrimPhoneNumber(value as string),
            },
        },
        prevState,
    );

    if (!success) {
        prevState.status = 'error';
        prevState.message = 'Données manquantes ou mal formatées';
        return prevState;
    }

    // Create a new FormData object to ensure we're sending multipart/form-data
    const sendFormData = createFormData(formdata);

    const response = await apiClient.post(restaurantEndpoints.create, sendFormData, {
        type: 'formData',
    });

    const result = await response.json();
    if (!response.ok) {
        prevState.status = 'error';
        prevState.message = result.message ?? 'Erreur lors de la création du restaurant';
        return prevState;
    }
    redirect('/');
}

export async function findOneRestaurant(): Promise<FindOneRestaurant | null> {
    // Processing
    const response = await apiClient.get(restaurantEndpoints.info);

    if (!response.ok) {
        return null;
    }
    const data = await response.json();
    return data;
}

export async function serveFileRestaurant(folder: string, path: string): Promise<string | null> {
    // Processing
    const response = await apiClient.get(restaurantEndpoints.serveFile(folder, path));

    if (!response.ok) {
        return null;
    }
    const data = await response.text();
    return data;
}

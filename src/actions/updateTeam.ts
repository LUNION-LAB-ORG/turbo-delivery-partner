'use server';

import { prisma } from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({
  firstname: z.string().min(1, 'Le prénom est requis'),
  lastname: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Téléphone invalide'),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

export async function updateTeam(prevState: any, formData: FormData, userId: number) {
  try {
    const data = {
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      latitude: formData.get('latitude'),
      longitude: formData.get('longitude'),
    };

    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      return {
        status: 'error',
        message: 'Erreur de validation',
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: parsed.data.firstname + ' ' + parsed.data.lastname,
        email: parsed.data.email,
        phone: parsed.data.phone,
        latitude: parsed.data.latitude,
        longitude: parsed.data.longitude,
      },
    });

    revalidatePath('/dashboard/account');
    return { status: 'success', message: 'Profil mis à jour', errors: {} };
  } catch (error) {
    console.error('[updateTeam]', error);
    return { status: 'error', message: 'Erreur serveur', errors: {} };
  }
}

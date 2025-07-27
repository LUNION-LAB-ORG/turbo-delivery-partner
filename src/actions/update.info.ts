'use server';

export async function updateInfo(
  _prevState: any,
  formData: FormData,
  accountId: string
) {
  try {
    const payload = {
      firstname: formData.get('firstname') as string,
      lastname: formData.get('lastname') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      latitude: parseFloat(formData.get('latitude') as string),
      longitude: parseFloat(formData.get('longitude') as string),
    };

    const response = await fetch(`https://backend-pro.turbodeliveryapp.com/api/account/${accountId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Ajoute l'Authorization si besoin :
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        status: 'error',
        message: 'Erreur lors de la mise à jour.',
        errors: error.errors || {},
        code: response.status,
      };
    }

    const data = await response.json();
    return {
      status: 'success',
      message: 'Informations mises à jour avec succès.',
      data,
    };
  } catch (error) {
    console.error('Erreur updateInfo:', error);
    return {
      status: 'error',
      message: 'Erreur de connexion au serveur.',
      errors: {},
    };
  }
}

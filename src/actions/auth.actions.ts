"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { signOut as signOutAuth } from "@/auth";
import { confirmOTPSchema, profileSchema } from "@/src/schemas/auth.schema";
import { processFormData } from "@/utils/formdata-zod.utilities";
import { TrimPhoneNumber } from "@/utils/trim-phone-number";
import { apiClient } from "@/lib/api-client";
import { signIn } from "@/auth";
import { ActionResult } from "@/types";

/**
 * Gère le processus de connexion initial.
 * @param prevState - L'état précédent.
 * @param formData - Les données du formulaire.
 * @returns Un objet contenant les données, le message et les erreurs.
 */
export async function logIn(
  prevState: any,
  formData: FormData
): Promise<ActionResult> {
  // Processing form data
  const {
    success,
    data: formdata,
    errors,
  } = processFormData(profileSchema, formData, {
    useDynamicValidation: true,
  });

  if (!success) {
    prevState.errors = errors;

    return prevState;
  }

  // Processing
  const response = await apiClient.post("/auth/user", {
    email: formdata.email,
  });

  if (!response.ok) {
    prevState.message = "Erreur d'envoie de mail.";
    prevState.status = "error";
    prevState.code = response.status;

    return prevState;
  }

  cookies().set("email_otp", formdata.email);

  redirect("/auth?step=2");
}

/**
 * Renvoie l'e-mail OTP si le cookie correspondant existe.
 * @throws {Error} Si une erreur survient lors de l'envoi de l'e-mail.
 */
export async function resendEmail(): Promise<void> {
  // Processing
  const hasCookie = cookies().has("email_otp");

  if (hasCookie) {
    const email = cookies().get("email_otp")?.value;

    const response = await apiClient.post("/auth/user", {
      email,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }
}

/**
 * Vérifie le code OTP saisi par l'utilisateur.
 * @param prevState - L'état précédent.
 * @param formData - Les données du formulaire.
 * @returns Un objet contenant les données, le message et les erreurs.
 */
export async function validateOTP(
  prevState: any,
  formData: FormData
): Promise<ActionResult> {
  // Processing form data
  const {
    success,
    data: formdata,
    errors,
  } = processFormData(confirmOTPSchema, formData, {
    useDynamicValidation: true,
    transformations: {
      otp: (value: string) => value.toString().replace(/\s/g, ""),
    },
  });

  if (!success) {
    prevState.errors = errors;
    prevState.message = "Code OTP invalide";
    prevState.status = "error";
    prevState.code = 400;

    return prevState;
  }

  // Processing

  const hasCookie = cookies().has("email_otp");

  if (hasCookie) {
    const response: any = await signIn("credentials", {
      code: formdata.otp,
      redirect: false,
    });

    if (response === null) {
      prevState.message =
        "Problème de valisation du code. Veuillez reprendre la connexion.";
      prevState.status = "error";
      prevState.code = 500;

      return prevState;
    }

    cookies().delete("email_otp");

    redirect("/");
  }

  prevState.message = "Veuillez reprendre le processus de connexion";

  return prevState;
}

/**
 * Finalise le processus d'inscription en mettant à jour les informations du profil.
 * @param prevState - L'état précédent.
 * @param formData - Les données du formulaire.
 * @returns Un objet contenant les données, le message et les erreurs.
 */
export async function FinishedSignIn(
  prevState: any,
  formData: FormData
): Promise<ActionResult> {
  // Processing form data
  const {
    success,
    data: formdata,
    errors,
  } = processFormData(profileSchema, formData, {
    useDynamicValidation: true,
    excludeFields: ["phone_numberCountry"],
    transformations: {
      phone_number: (value) => TrimPhoneNumber(value as string),
    },
  });

  if (!success) {
    prevState.errors = errors;
    prevState.message = "Informations invalides";
    prevState.status = "error";
    prevState.code = 400;

    return prevState;
  }

  // Processing
  const response = await apiClient.post("/profile/create", formdata);

  if (!response.ok) {
    prevState.message = "Désolé, une erreur est survenue";

    prevState.status = "error";
    prevState.code = response.status;

    return prevState;
  }

  prevState.message = "success";
  redirect("/");
}

/**
 * Déconnecte l'utilisateur actuel.
 */
export async function signOut(): Promise<void> {
  await signOutAuth();
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * Récupère le profil de l'utilisateur actuellement connecté.
 * @returns Le profil de l'utilisateur.
 */
export async function getUserProfile(): Promise<any> {
  const response = await apiClient.get("/auth/profile");

  if (!response.ok) {
    return null;
  }

  return await response.json();
}

/**
 * Met à jour les informations du profil de l'utilisateur.
 * @param prevState - L'état précédent.
 * @param formData - Les données du formulaire.
 * @returns Un objet contenant les données mises à jour, le message et les erreurs.
 */
export async function updateProfile(
  prevState: any,
  formData: FormData,
  id: string
): Promise<ActionResult> {
  // Processing form data
  const {
    success,
    data: formdata,
    errors,
  } = processFormData(profileSchema, formData, {
    useDynamicValidation: true,
    excludeFields: ["phone_numberCountry", "id"],
    transformations: {
      phone_number: (value) => TrimPhoneNumber(value as string),
    },
  });

  if (!success) {
    prevState.errors = errors;
    prevState.message = "Informations invalides";
    prevState.status = "error";
    prevState.code = 400;

    return prevState;
  }

  // Processing
  const response = await apiClient.post(`/profile/update/${id}`, formdata);

  if (!response.ok) {
    prevState.message = "Désolé, une erreur est survenue";

    prevState.status = "error";
    prevState.code = response.status;

    return prevState;
  }

  prevState.data = await response.json();
  prevState.errors = {};
  prevState.message = "success";

  return prevState;
}

"use server";

import { teamSchema } from "@/src/schemas/team.schema";
import { apiClient } from "@/lib/api-client";
import { processFormData } from "@/utils/formdata-zod.utilities";
import { TrimPhoneNumber } from "@/utils/trim-phone-number";
import { ActionResult } from "@/types";

export async function createTeam(
  prevState: any,
  formData: FormData
): Promise<ActionResult> {
  // Traitement des données du formulaire
  const {
    success,
    data: formdata,
    errors,
  } = processFormData(teamSchema, formData, {
    useDynamicValidation: true,
    excludeFields: ["phone_numberCountry"],
    transformations: {
      phone_number: (value) => TrimPhoneNumber(value as string),
    },
  });

  if (!success) {
    prevState.errors = errors;
    prevState.status = "error";

    return prevState;
  }

  // Traitement
  const response = await apiClient.post("/teams", formdata);

  if (!response.ok) {
    prevState.message =
      "Impossible de créer l'organisation. Veuillez vérifier votre connexion internet et réessayer.";
    prevState.status = "error";

    return prevState;
  }

  prevState.data = await response.json();
  prevState.status = "success";
  prevState.message = "L'organisation a été créée avec succès.";

  return prevState;
}

export async function getUserTeams() {
  const response = await apiClient.get("/teams/user");

  if (!response.ok) {
    throw new Error("Impossible de récupérer les équipes de l'utilisateur");
  }

  return await response.json();
}

export async function getTeamByReference(reference: string) {
  const response = await apiClient.get(`/teams/${reference}`);

  if (!response.ok) {
    throw new Error("Impossible de récupérer l'équipe");
  }

  return await response.json();
}

export async function updateTeam(
  prevState: any,
  formData: FormData,
  id: string
): Promise<ActionResult> {
  // Traitement des données du formulaire
  const {
    success,
    data: formdata,
    errors,
  } = processFormData(teamSchema, formData, {
    useDynamicValidation: true,
    excludeFields: ["phone_numberCountry", "id"],
    transformations: {
      phone_number: (value) => TrimPhoneNumber(value as string),
    },
  });

  if (!success) {
    prevState.errors = errors;
    prevState.status = "error";

    return prevState;
  }

  // Traitement
  const response = await apiClient.put(`/teams/${id}`, formdata);

  if (!response.ok) {
    prevState.message =
      "Impossible de mettre à jour l'organisation. Veuillez vérifier votre connexion internet et réessayer.";
    prevState.status = "error";

    return prevState;
  }

  prevState.status = "success";
  prevState.message = "L'organisation a été mise à jour avec succès.";
  prevState.data = await response.json();

  return prevState;
}

export async function deleteTeam(
  prevState: any,
  id: string
): Promise<ActionResult> {
  // Traitement
  const response = await apiClient.delete(`/teams/${id}`);

  if (!response.ok) {
    prevState.message =
      "Impossible de supprimer l'organisation. Veuillez vérifier votre connexion internet et réessayer.";
    prevState.status = "error";

    return prevState;
  }

  prevState.message = "L'organisation a été supprimée avec succès.";
  prevState.status = "success";

  return prevState;
}

"use client";

import { Input } from "@nextui-org/input";
import { useFormState } from "react-dom";
import { useCallback, useState } from "react";
import { DateInput } from "@nextui-org/date-input";

import { body, title } from "@/components/primitives";
import { SubmitButton } from "@/components/ui/form-ui/submit-button";
import { InputPhone } from "@/components/ui/form-ui/input-phone";
import { FinishedSignIn } from "@/src/actions/auth.actions";
import { SelectCountry } from "@/components/ui/form-ui/select-country";
import { useToastStore } from "@/src/store/toast.store";

export function FormUserInfo() {
  const [contact, setContact] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  const addToast = useToastStore((state) => state.addToast);

  const finishedSignInWithToast = useCallback(
    async (prevState: any, formData: FormData) => {
      const result = await FinishedSignIn(prevState, formData);

      addToast({
        titre: result.status === "error" ? "Erreur" : "Succès",
        message: result.message || "Aucun changement détecté",
        type: result.status === "error" ? "error" : "success",
        actionValider: {
          texte: "OK",
          onValider: () => {},
          variant: "primary",
        },
      });

      return result;
    },
    [addToast],
  );

  const [state, formAction] = useFormState(finishedSignInWithToast, {
    data: null,
    message: "",
    errors: {},
    status: "idle",
    code: undefined,
  });

  return (
    <form action={formAction} className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className={title({ size: "h4" })}>
          Terminer l&apos;enregistrement
        </h1>
        <p className={body()}>Completez vos informations personnelles</p>
      </div>

      <div className="grid gap-4">
        <Input
          isRequired
          required
          errorMessage={state.errors.last_name ?? ""}
          isInvalid={!!state.errors.last_name}
          label="Nom"
          labelPlacement="outside"
          name="last_name"
          placeholder="Entrer votre nom de famille"
          type="text"
          variant="flat"
        />
        <Input
          isRequired
          required
          errorMessage={state.errors.first_name ?? ""}
          isInvalid={!!state.errors.first_name}
          label="Prénoms"
          labelPlacement="outside"
          name="first_name"
          placeholder="Entrer votre prénom"
          type="text"
          variant="flat"
        />

        <DateInput
          isRequired
          errorMessage={state.errors.birthdate ?? ""}
          isInvalid={!!state.errors.birthdate}
          label="Date de naissance"
          labelPlacement="outside"
          name="birthdate"
          variant="flat"
        />

        <SelectCountry
          isRequired
          required
          errorMessage={state.errors.country ?? ""}
          isInvalid={!!state.errors.country}
          label="Pays"
          labelPlacement="outside"
          name="country"
          placeholder="Entre votre pays d'origine"
          setValue={(value: string) => setCountry(value)}
          value={country}
        />

        <InputPhone
          isRequired
          required
          errorMessage={state.errors.phone_number}
          isInvalid={!!state.errors.phone_number}
          label="Téléphone"
          name="phone_number"
          placeholder="Téléphone"
          setValue={(value: string) => setContact(value)}
          value={contact}
        />

        <SubmitButton className="mt-4">Terminer</SubmitButton>
      </div>
    </form>
  );
}

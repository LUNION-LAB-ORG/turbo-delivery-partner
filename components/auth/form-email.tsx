"use client";

import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import { useFormState } from "react-dom";
import { IconMail } from "@tabler/icons-react";
import { useCallback } from "react";

import ButtonSigninWithGoogle from "@/components/ui/form-ui/button-signinWithGoogle";
import { SubmitButton } from "@/components/ui/form-ui/submit-button";
import { logIn } from "@/src/actions/auth.actions";
import { body, title } from "@/components/primitives";
import { useToastStore } from "@/src/store/toast.store";

export function FormEmail() {
  const addToast = useToastStore((state) => state.addToast);

  const logInWithToast = useCallback(
    async (prevState: any, formData: FormData) => {
      const result = await logIn(prevState, formData);

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

  const [state, formAction] = useFormState(logInWithToast, {
    data: null,
    message: "",
    errors: {},
    status: "idle",
    code: undefined,
  });

  return (
    <form action={formAction} className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className={title({ size: "h4" })}>Connexion ou inscription</h1>
        <p className={body()}>
          Entrez votre email ci-dessous pour vous connecter à votre compte.
        </p>
      </div>
      <div className="grid gap-4">
        <Input
          isRequired
          required
          errorMessage={state.errors.email ?? ""}
          isInvalid={!!state.errors.email}
          label="Email"
          name="email"
          startContent={
            <IconMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          type="email"
          variant="flat"
        />

        <SubmitButton>Continuer</SubmitButton>
        <p
          className={body({ size: "caption", className: "text-center" })}
        >{`Nous vous enverrons un code de validation dans votre boîte de réception. Le code de validation peut parfois se retrouver dans les spams.`}</p>

        <p className="mt-4 text-center text-sm text-gray-500">ou</p>
        <Divider className="mb-4" />
        <ButtonSigninWithGoogle />
      </div>
    </form>
  );
}

"use client";

import { Divider } from "@nextui-org/divider";
import { useFormState } from "react-dom";
import { useCallback } from "react";

import { body, title } from "@/components/primitives";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/form-ui/input-otp";
import { resendEmail, validateOTP } from "@/src/actions/auth.actions";
import { SubmitButton } from "@/components/ui/form-ui/submit-button";
import ButtonSigninWithGoogle from "@/components/ui/form-ui/button-signinWithGoogle";
import { useToastStore } from "@/src/store/toast.store";

export function FormOTP() {
  const addToast = useToastStore((state) => state.addToast);

  const validateOTPWithToast = useCallback(
    async (prevState: any, formData: FormData) => {
      const result = await validateOTP(prevState, formData);

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

  const [, formAction] = useFormState(validateOTPWithToast, {
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
          Entrez le code reçu par mail ci-dessous pour finaliser la connexion.
        </p>
      </div>
      <div className="grid gap-4">
        <InputOTP required maxLength={6} name="otp">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <SubmitButton>Continuer</SubmitButton>

        <p
          className={body({ size: "caption", className: "text-center" })}
        >{`Nous vous enverrons un code de validation dans votre boîte de réception. Le code de validation peut parfois se retrouver dans les spams.`}</p>
        <button
          className={body({
            size: "caption",
            className:
              "text-primary cursor-pointer text-center hover:underline",
          })}
          onClick={async () => await resendEmail()}
        >
          Renvoyer le code
        </button>
        <p className="mt-4 text-center text-sm text-gray-500">ou</p>
        <Divider className="mb-4" />

        <ButtonSigninWithGoogle />
      </div>
    </form>
  );
}

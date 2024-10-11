"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { useFormState } from "react-dom";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { updateTeam } from "@/src/actions/team.actions";
import { _teamSchema, teamSchema } from "@/src/schemas/team.schema";
import { body, title } from "@/components/primitives";
import { SubmitButton } from "@/components/ui/form-ui/submit-button";
import { useToastStore } from "@/src/store/toast.store";
import { InputPhone } from "@/components/ui/form-ui/input-phone";

export const TeamPhone = ({
  phone_number,
  id,
}: {
  phone_number: string;
  id: string;
}) => {
  const addToast = useToastStore((state) => state.addToast);
  const router = useRouter();

  const updateTeamWithId = useCallback(
    async (prevState: any, formData: FormData) => {
      const result = await updateTeam(prevState, formData, id);

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
      router.refresh();

      return result;
    },
    [id, addToast, router],
  );

  const [, formAction] = useFormState(updateTeamWithId, {
    data: null,
    message: "",
    errors: {},
    status: "idle",
 code:undefined,
  });

  const {
    formState: { errors },
    control,
  } = useForm<_teamSchema>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      phone_number: "+" + phone_number,
    },
  });

  return (
    <form action={formAction}>
      <Card className="max-w-screen-lg p-1">
        <CardHeader>
          <div className="flex flex-col gap-2 max-w-screen-sm">
            <h1
              className={title({
                size: "h5",
              })}
            >
              Numéro de téléphone de l&apos;organisation
            </h1>
            <p className="text-sm text-muted-foreground">
              C&apos;est le numéro de téléphone visible de votre organisation au
              sein de Lunion-Booking.
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div>
            <Controller
              control={control}
              name="phone_number"
              render={({ field }) => (
                <InputPhone
                  isRequired
                  aria-invalid={errors.phone_number ? "true" : "false"}
                  errorMessage={errors.phone_number?.message ?? ""}
                  isInvalid={!!errors.phone_number}
                  label="Numéro de téléphone de l'organisation"
                  name="phone_number"
                  placeholder="Entrez le numéro de téléphone de l'organisation"
                  radius="sm"
                  setValue={(value: string) => {
                    field.onChange(value);
                  }}
                  type="tel"
                  value={field.value ?? ""}
                />
              )}
            />
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 items-center">
          <span className={body({ size: "caption" })}>
            Veuillez utiliser 32 caractères au maximum.
          </span>
          <SubmitButton className="w-fit" color="primary" type="submit">
            Sauvegarder
          </SubmitButton>
        </CardFooter>
      </Card>
    </form>
  );
};

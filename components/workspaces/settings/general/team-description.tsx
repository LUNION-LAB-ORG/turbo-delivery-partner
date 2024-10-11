"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Textarea } from "@nextui-org/react";
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

export const TeamDescription = ({
  description,
  id,
}: {
  description: string;
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
      description: description,
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
              Description de l&apos;organisation
            </h1>
            <p className="text-sm text-muted-foreground">
              C&apos;est la description visible de votre organisation au sein de
              Lunion-Booking.
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="">
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  {...field}
                  isRequired
                  aria-invalid={errors.description ? "true" : "false"}
                  aria-label="description input"
                  errorMessage={errors.description?.message ?? ""}
                  isInvalid={!!errors.description}
                  name="description"
                  placeholder="Entrez la description de l'organisation"
                  radius="sm"
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

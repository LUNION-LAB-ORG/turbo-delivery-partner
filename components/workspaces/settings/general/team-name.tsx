"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
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

export const TeamName = ({ name, id }: { name: string; id: string }) => {
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
    [id, addToast, router]
  );

  const [, formAction] = useFormState(updateTeamWithId, {
    data: null,
    message: "",
    errors: {},
    status: "idle",
    code: undefined,
  });

  const {
    formState: { errors },
    control,
  } = useForm<_teamSchema>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: name,
    },
  });

  return (
    <form action={formAction}>
      <Card className="max-w-screen-lg p-1">
        <CardHeader>
          <div className="flex flex-col gap-2 w-full">
            <h1
              className={title({
                size: "h5",
                className: "max-w-screen-sm",
              })}
            >
              Nom de l&apos;organisation
            </h1>
            <p className="text-sm text-muted-foreground max-w-screen-sm">
              C&apos;est le nom visible de votre organisation au sein de
              Lunion-Booking.
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-label="name input"
                  errorMessage={errors.name?.message ?? ""}
                  isInvalid={!!errors.name}
                  name="name"
                  placeholder="Entrez le nom de l'organisation"
                  radius="sm"
                  type="text"
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

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
import { title } from "@/components/primitives";
import { SubmitButton } from "@/components/ui/form-ui/submit-button";
import { useToastStore } from "@/src/store/toast.store";

export const ManagerInfo = ({
  manager_name,
  manager_email,
  id,
}: {
  manager_name: string;
  manager_email: string;
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
      manager_name: manager_name,
      manager_email: manager_email,
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
              Informations sur le manager de l&apos;organisation
            </h1>
            <p className="text-sm text-muted-foreground">
              Ce sont les informations visible de votre organisation au sein de
              Lunion-Booking.
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
            <Controller
              control={control}
              name="manager_name"
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  aria-invalid={errors.manager_name ? "true" : "false"}
                  aria-label="manager name input"
                  errorMessage={errors.manager_name?.message ?? ""}
                  isInvalid={!!errors.manager_name}
                  label="Nom du manager"
                  name="manager_name"
                  placeholder="Entrez le nom du manager"
                  radius="sm"
                  value={field.value ?? ""}
                />
              )}
            />
            <Controller
              control={control}
              name="manager_email"
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  aria-invalid={errors.manager_email ? "true" : "false"}
                  aria-label="manager email input"
                  errorMessage={errors.manager_email?.message ?? ""}
                  isInvalid={!!errors.manager_email}
                  label="E-mail du manager"
                  name="manager_email"
                  placeholder="Entrez l'email du manager"
                  radius="sm"
                  type="email"
                  value={field.value ?? ""}
                />
              )}
            />
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 items-center">
          <SubmitButton className="w-fit" color="primary" type="submit">
            Sauvegarder
          </SubmitButton>
        </CardFooter>
      </Card>
    </form>
  );
};

"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { useFormState } from "react-dom";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { IconCreditCard } from "@tabler/icons-react";

import { updateTeam } from "@/src/actions/team.actions";
import { _teamSchema, teamSchema } from "@/src/schemas/team.schema";
import { body, title } from "@/components/primitives";
import { SubmitButton } from "@/components/ui/form-ui/submit-button";
import { useToastStore } from "@/src/store/toast.store";

export const BillingPaymentMethod = ({
  name,
  id,
}: {
  name: string;
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
    [id, addToast, router]
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
      name: name,
    },
  });

  return (
    <form action={formAction}>
      <Card className="max-w-screen-lg p-1">
        <CardHeader>
          <div className="flex flex-col gap-2 w-full max-w-screen-sm">
            <h1
              className={title({
                size: "h5",
              })}
            >
              Mode de paiement
            </h1>
            <p className="text-sm text-muted-foreground max-w-screen-sm">
              Les paiements pour les abonnements sont effectués à l&apos;aide de
              la carte par défaut.
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex h-full flex-1 items-center justify-center rounded-lg border border-dashed p-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <IconCreditCard className="size-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Aucun mode de paiement ajouté
              </p>
            </div>
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 items-center">
          <span className={body({ size: "caption" })}>
            Au maximum trois cartes de crédit, cartes de débit ou cartes
            prépayées peuvent être ajoutées.
          </span>
          <SubmitButton className="w-fit" color="primary" type="submit">
            Ajouter une carte
          </SubmitButton>
        </CardFooter>
      </Card>
    </form>
  );
};

"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Divider } from "@nextui-org/divider";
import { useFormState } from "react-dom";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Select, SelectItem } from "@nextui-org/select";
import fr from "react-phone-number-input/locale/fr.json";

import { updateTeam } from "@/src/actions/team.actions";
import { _teamSchema, teamSchema } from "@/src/schemas/team.schema";
import { body, title } from "@/components/primitives";
import { SubmitButton } from "@/components/ui/form-ui/submit-button";
import { useToastStore } from "@/src/store/toast.store";
import { fetchCountries } from "@/components/ui/form-ui/select-country";

export const TeamCoordonnees = ({
  address,
  city,
  country,
  id,
}: {
  address: string;
  city: string;
  country: string;
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
      address: address,
      city: city,
      country: country,
    },
  });
  const countries = fetchCountries({ labels: fr });

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
              Coordonnées de l&apos;organisation
            </h1>
            <p className="text-sm text-muted-foreground">
              Ce sont les coordonnées visibles de votre organisation au sein de
              Lunion-Booking.
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
            <Controller
              control={control}
              name="city"
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  aria-invalid={errors.city ? "true" : "false"}
                  aria-label="city input"
                  errorMessage={errors.city?.message ?? ""}
                  isInvalid={!!errors.city}
                  label="Ville d'implentation de l'organisation"
                  name="city"
                  placeholder="Entrez la ville d'implentation de l'organisation"
                  radius="sm"
                  value={field.value ?? ""}
                />
              )}
            />
            <Controller
              control={control}
              name="country"
              render={({ field }) => {
                const isValueInCollection = countries.some(
                  (country: any) => country.value === field.value,
                );

                return (
                  <Select
                    {...field}
                    isRequired
                    required
                    aria-invalid={errors.country ? "true" : "false"}
                    aria-label="country Select"
                    disabled={!countries}
                    isInvalid={!!errors.country}
                    label="Pays d'implentation de l'organisation"
                    name="country"
                    placeholder="Entrez le pays d'implentation de l'organisation"
                    radius="sm"
                    selectedKeys={isValueInCollection ? [field.value] : []}
                  >
                    {countries.map((country) => (
                      <SelectItem
                        key={country.value}
                        color="primary"
                        startContent={country.flag}
                        textValue={country.label}
                        value={country.value}
                      >
                        {country.label}
                      </SelectItem>
                    ))}
                  </Select>
                );
              }}
            />
          </div>
          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <Input
                {...field}
                isRequired
                aria-invalid={errors.address ? "true" : "false"}
                aria-label="address input"
                errorMessage={errors.address?.message ?? ""}
                isInvalid={!!errors.address}
                label="Adresse d'implentation de l'organisation"
                name="address"
                placeholder="Entrez l'adresse d'implentation de l'organisation"
                radius="sm"
                value={field.value ?? ""}
              />
            )}
          />
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

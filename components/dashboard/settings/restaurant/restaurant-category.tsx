"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { useFormState } from "react-dom";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Select, SelectItem } from "@nextui-org/select";

import { updateTeam } from "@/src/actions/team.actions";
import { _teamSchema, teamSchema } from "@/src/schemas/team.schema";
import { body, title } from "@/components/primitives";
import { SubmitButton } from "@/components/ui/form-ui/submit-button";
import { useToastStore } from "@/src/store/toast.store";
import { getEnumValues } from "@/src/actions/get_enum_values";

export const RestaurantCategory = ({
  category,
  id,
}: {
  category: string;
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
    code: undefined,
  });

  const {
    formState: { errors },
    control,
  } = useForm<_teamSchema>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      category: category,
    },
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategoryValues() {
      const values = await getEnumValues("team_category_enum");

      setCategories(values.map((value: string) => ({ value, label: value })));
    }
    fetchCategoryValues();
  }, []);

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
              Type d&apos;restaurant
            </h1>
            <p className="text-sm text-muted-foreground">
              C&apos;est la catégorie visible de votre restaurant au sein de
              Lunion-Booking.
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <div>
            <Controller
              control={control}
              name="category"
              render={({ field }) => {
                const isValueInCollection = categories.some(
                  (cat: any) => cat.value === field.value
                );

                return (
                  <Select
                    {...field}
                    isRequired
                    required
                    aria-invalid={errors.category ? "true" : "false"}
                    aria-label="category Select"
                    disabled={!categories}
                    isInvalid={!!errors.category}
                    label="Type d'restaurant"
                    labelPlacement="outside"
                    name="category"
                    placeholder="Entrez le type d'restaurant"
                    radius="sm"
                    selectedKeys={isValueInCollection ? [field.value] : []}
                  >
                    {categories.map((cat: any) => (
                      <SelectItem
                        key={cat.value}
                        color="primary"
                        textValue={cat.label}
                        value={cat.value}
                      >
                        {cat.label}
                      </SelectItem>
                    ))}
                  </Select>
                );
              }}
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

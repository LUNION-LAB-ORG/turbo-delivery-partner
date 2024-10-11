import { Control, Controller, FieldErrors } from "react-hook-form";
import { Input, Textarea } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { useEffect, useState } from "react";

import { _teamSchema } from "@/src/schemas/team.schema";
import { getEnumValues } from "@/src/actions/get_enum_values";

interface FormStepProps {
  errors: FieldErrors<_teamSchema>;
  control: Control<_teamSchema>;
}

export const DescriptionTeamForm: React.FC<FormStepProps> = ({
  errors,
  control,
}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategoryValues() {
      const values = await getEnumValues("team_category_enum");

      setCategories(values.map((value: string) => ({ value, label: value })));
    }
    fetchCategoryValues();
  }, []);

  return (
    <div className="">
      <div className="grid gap-y-4">
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
              label="Nom de l'organisation"
              labelPlacement="outside"
              name="name"
              placeholder="Entrez le nom de l'organisation"
              value={field.value ?? ""}
            />
          )}
        />
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
              label="Description de l'organisation"
              labelPlacement="outside"
              name="description"
              placeholder="Entrez la description de l'organisation"
              value={field.value ?? ""}
            />
          )}
        />
        <Controller
          control={control}
          name="category"
          render={({ field }) => {
            const isValueInCollection = categories.some(
              (cat: any) => cat.value === field.value,
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
                label="Type d'organisation"
                labelPlacement="outside"
                name="category"
                placeholder="Entrez le type d'organisation"
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
    </div>
  );
};

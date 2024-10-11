"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import fr from "react-phone-number-input/locale/fr.json";
import "react-phone-number-input/style.css";

import { _teamSchema } from "@/src/schemas/team.schema";
import { fetchCountries } from "@/components/ui/form-ui/select-country";
import { InputPhone } from "@/components/ui/form-ui/input-phone";

interface FormStepProps {
  errors: FieldErrors<_teamSchema>;
  control: Control<_teamSchema>;
}

export const InformationTeamForm: React.FC<FormStepProps> = ({
  errors,
  control,
}) => {
  const countries = fetchCountries({ labels: fr });

  return (
    <div className="">
      <div className="grid gap-y-4">
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input
              {...field}
              isRequired
              aria-invalid={errors.email ? "true" : "false"}
              aria-label="email input"
              errorMessage={errors.email?.message ?? ""}
              isInvalid={!!errors.email}
              label="Email de l'organisation"
              labelPlacement="outside"
              name="email"
              placeholder="Entrez l'email de l'organisation"
              type="email"
              value={field.value ?? ""}
            />
          )}
        />

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
              setValue={(value: string) => {
                field.onChange(value);
              }}
              type="text"
              value={field.value ?? ""}
            />
          )}
        />

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
              label="Adresse postale de l'organisation"
              labelPlacement="outside"
              name="address"
              placeholder="Entrez l'adresse postale de l'organisation"
              value={field.value ?? ""}
            />
          )}
        />
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
              labelPlacement="outside"
              name="city"
              placeholder="Entrez la ville d'implentation de l'organisation"
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
                labelPlacement="outside"
                name="country"
                placeholder="Entrez le pays d'implentation de l'organisation"
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
    </div>
  );
};

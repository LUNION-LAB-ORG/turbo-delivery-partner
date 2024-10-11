import { Control, Controller, FieldErrors } from "react-hook-form";
import { Input } from "@nextui-org/input";

import { _teamSchema } from "@/src/schemas/team.schema";

interface FormStepProps {
  errors: FieldErrors<_teamSchema>;
  control: Control<_teamSchema>;
}

export const AdministrationTeamForm: React.FC<FormStepProps> = ({
  errors,
  control,
}) => {
  return (
    <div className="">
      <div className="grid gap-y-4">
        <Controller
          control={control}
          name="manager_name"
          render={({ field }) => (
            <Input
              {...field}
              isRequired
              aria-invalid={errors.manager_name ? "true" : "false"}
              aria-label="manager_name input"
              errorMessage={errors.manager_name?.message ?? ""}
              isInvalid={!!errors.manager_name}
              label="Nom du manager"
              labelPlacement="outside"
              name="manager_name"
              placeholder="Entrez le nom du manager de l'organisation"
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
              aria-label="manager_email input"
              errorMessage={errors.manager_email?.message ?? ""}
              isInvalid={!!errors.manager_email}
              label="Email du manager"
              labelPlacement="outside"
              name="manager_email"
              placeholder="Entrez l'email du manager de l'organisation"
              type="email"
              value={field.value ?? ""}
            />
          )}
        />
      </div>
    </div>
  );
};

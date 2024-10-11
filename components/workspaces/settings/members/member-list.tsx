import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";

import { body, title } from "@/components/primitives";
import { SubmitButton } from "@/components/ui/form-ui/submit-button";

export const MembersList = () => {
  return (
    <div className="flex flex-col gap-4">
      
      <Card className="max-w-screen-lg p-1">
        <CardHeader>
          <div className="flex flex-col gap-2 w-full">
            <h1
              className={title({
                size: "h5",
                className: "max-w-screen-sm",
              })}
            >
              Inviter un membre
            </h1>
            <p className="text-sm text-muted-foreground max-w-screen-sm">
              Inviter un membre à rejoindre l&apos;organisation
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              isRequired
              aria-label="manager name input"
              label="Adresse email"
              labelPlacement="outside"
              name="email"
              placeholder="Entrez l'adresse email"
              radius="sm"
            />
            <Input
              isRequired
              aria-label="manager name input"
              label="Rôle"
              labelPlacement="outside"
              name="role"
              placeholder="Entrez le rôle"
              radius="sm"
            />
          </div>
          <div className="flex mt-4">
            <SubmitButton
              className="w-fit"
              color="primary"
              size="sm"
              type="submit"
              variant="bordered"
            >
              Ajouter un membre
            </SubmitButton>
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 items-center">
          <span className={body({ size: "caption" })}>
            Cette fonctionnalité est disponible sur{" "}
            <span className="cursor-pointer underline text-primary">
              le forfait Pro
            </span>
            .
          </span>
          <Button color="primary">Mise à niveau</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

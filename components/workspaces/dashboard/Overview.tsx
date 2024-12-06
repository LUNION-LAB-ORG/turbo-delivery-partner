// Importation des composants et des icônes nécessaires
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { TbTrendingDown, TbTrendingUp } from "react-icons/tb";

import { title } from "@/components/primitives";
import { data } from "@/lib/data";

export const StackedCards = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col">
          <h1
            className={title({
              size: "h4",
            })}
          >
            Aperçu
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualisez les principales données liées à vos biens immobiliers
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h1 className={title({ size: "h6" })}>Nouvelles Locations</h1>
              <TbTrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardBody>
              <div className="text-2xl font-bold">{0}</div>
              <p className="text-xs text-muted-foreground">
                +0% par rapport au mois dernier
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h1 className={title({ size: "h6" })}>Nouveaux Clients</h1>
              <TbTrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardBody>
              <div className="text-2xl font-bold">{0}</div>
              <p className="text-xs text-muted-foreground">
                -0% par rapport au mois dernier
              </p>
            </CardBody>
          </Card>
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h1 className={title({ size: "h6" })}>Revenus Totaux</h1>
              <TbTrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardBody>
              <div className="text-2xl font-bold">{0} €</div>
              <p className="text-xs text-muted-foreground">
                +0% par rapport au mois dernier
              </p>
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
};

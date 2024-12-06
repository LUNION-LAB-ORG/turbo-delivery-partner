import { RestaurantCategory } from "@/components/dashboard/settings/restaurant/restaurant-category";
import { RestaurantCoordonnees } from "@/components/dashboard/settings/restaurant/restaurant-coordonnees";
import { RestaurantDescription } from "@/components/dashboard/settings/restaurant/restaurant-description";
import { RestaurantEmail } from "@/components/dashboard/settings/restaurant/restaurant-email";
import { RestaurantName } from "@/components/dashboard/settings/restaurant/restaurant-name";
import { RestaurantPhone } from "@/components/dashboard/settings/restaurant/restaurant-phone";
import { title } from "@/components/primitives";
import { ButtonBack } from "@/components/ui/navigation-ui/button-back";
import { restaurants } from "@/data";
import { Divider } from "@nextui-org/react";

export default function Restaurant() {
  const restaurant = restaurants[0];
  return (
    <div className="w-full gap-4 lg:gap-6">
      <ButtonBack
        className="bg-background"
        link="/dashboard/settings"
        size="sm"
      />
      <div className="space-y-4 mt-4">
        <h1 className={title({ size: "h3", class: "text-primary" })}>
          Restaurant
        </h1>
        <Divider />
        <RestaurantName name={restaurant.name} id={restaurant.id} />
        <RestaurantCategory
          category={restaurant.categories[0]}
          id={restaurant.id}
        />
        <RestaurantDescription
          description={restaurant.description}
          id={restaurant.id}
        />
        <RestaurantPhone phone_number={restaurant.phone} id={restaurant.id} />
        <RestaurantEmail email={restaurant.email} id={restaurant.id} />
        <RestaurantCoordonnees
          address={restaurant.address}
          id={restaurant.id}
        />
      </div>
    </div>
  );
}

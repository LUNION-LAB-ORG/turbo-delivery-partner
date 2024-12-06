"use client";

import "@smastrom/react-rating/style.css";

import { title } from "@/components/primitives";
import { Image, Avatar } from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/card";
import { Clock } from "lucide-react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Link from "next/link";

export default function RestaurantDetail({ restaurant }: { restaurant: any }) {
  return (
    <div className="w-full h-full p-4 flex flex-col items-start gap-2 justify-start">
      <div className="flex justify-center w-full mb-4">
        <Avatar
          src={restaurant.image}
          isBordered
          className="w-24 h-24 md:w-36 md:h-36"
        />
      </div>
      <h2 className={title({ size: "h4", class: "text-center" })}>
        {restaurant.name}
      </h2>
      <p className="text-sm text-gray-500 flex items-center gap-2">
        <span className="font-semibold">Évaluation:</span>{" "}
        <Rating style={{ maxWidth: 150 }} value={restaurant.rating} readOnly />
      </p>
      <p className="text-sm text-gray-500">
        <span className="font-semibold">Adresse:</span> {restaurant.address}
      </p>
      <p className="text-sm text-gray-500">
        <span className="font-semibold">Téléphone:</span> {restaurant.phone}
      </p>
      <p className="text-sm text-gray-500">
        <span className="font-semibold">Email:</span> {restaurant.email}
      </p>

      <p className="text-sm text-gray-500 flex items-center gap-2">
        <span className="font-semibold">Site web:</span>
        <Link
          href={restaurant.website}
          className="text-sm underline text-primary"
        >
          {restaurant.website}
        </Link>
      </p>
      <p className="text-sm text-gray-500 flex items-center gap-2">
        <span className="font-semibold">Temps de préparation:</span>{" "}
        {restaurant.time} <Clock className="w-4 h-4" />
      </p>
      <p className="text-sm text-gray-500">
        <span className="font-semibold">Description:</span>{" "}
        {restaurant.description}
      </p>
      <div className="flex justify-center mt-10">
        <RestaurantImages images={restaurant.images} />
      </div>
    </div>
  );
}

export function RestaurantImages({ images }: { images: string[] }) {
  return (
    <Carousel className="w-8/12">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <Image
              key={index}
              alt={`Image ${index}`}
              className="object-cover w-full h-full"
              src={image}
              isBlurred
              radius="sm"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

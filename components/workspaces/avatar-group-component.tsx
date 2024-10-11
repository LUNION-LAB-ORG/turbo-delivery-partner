import React from "react";
import { AvatarGroup, Avatar } from "@nextui-org/react";

export function AvatarGroupComponent({ images }: { images: string[] }) {
  return (
    <AvatarGroup isBordered max={3} size="sm">
      {images.map((image, key: number) => (
        <Avatar
          key={key}
          showFallback
          name={(key + 1).toString()}
          size="sm"
          src={image}
        />
      ))}
    </AvatarGroup>
  );
}

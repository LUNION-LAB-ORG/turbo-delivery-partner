export function SiteBanner() {
  return (
    <div className="relative top-0 bg-primary text-background py-3 md:py-0">
      <div className="container flex flex-col items-center justify-center gap-4 md:h-12 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-background">
          ✨<span className="font-bold">Lunion-booking V0.1 </span> est encours
          de développement, date de publication le 31 octobre 2024 ✨
        </p>
      </div>
      <hr className="absolute bottom-0 m-0 h-px w-full bg-neutral-200/30" />
    </div>
  );
}

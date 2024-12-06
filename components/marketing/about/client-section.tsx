export default function ClientSection() {
  return (
    <section
      className="text-center mx-auto max-w-[80rem] px-6 md:px-8"
      id="clients"
    >
      <div className="py-14">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="text-center text-sm font-semibold text-gray-600">
          DES ÉQUIPES DU MONDE ENTIER NOUS FONT CONFIANCE
          </h2>
          <div className="mt-6">
            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16 [&_path]:fill-white">
              <li>
                <img
                  alt="google"
                  className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
                  src={`https://cdn.magicui.design/companies/Google.svg`}
                />
              </li>
              <li>
                <img
                  alt="microsoft"
                  className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
                  src={`https://cdn.magicui.design/companies/Microsoft.svg`}
                />
              </li>
              <li>
                <img
                  alt={`GitHub`}
                  className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
                  src={`https://cdn.magicui.design/companies/GitHub.svg`}
                />
              </li>

              <li>
                <img
                  alt={`Uber`}
                  className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
                  src={`https://cdn.magicui.design/companies/Uber.svg`}
                />
              </li>
              <li>
                <img
                  alt={`Notion`}
                  className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
                  src={`https://cdn.magicui.design/companies/Notion.svg`}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

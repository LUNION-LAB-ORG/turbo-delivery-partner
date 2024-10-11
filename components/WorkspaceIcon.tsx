import { tv, type VariantProps } from "tailwind-variants";

const worksapceIcon = tv({
  base: "block size-3 relative before:absolute before:inset-0 before:rounded-full before:m-auto before:size-2",
  variants: {
    intent: {
      primary: "before:bg-primary-600",
      secondary: "before:bg-secondary-600",
      accent: "before:bg-accent-600",
      gray: "before:bg-gray-600",
      danger: "before:bg-danger-600",
      success: "before:bg-success-600",
      warning: "before:bg-warning-600",
      info: "before:bg-info-600",
      neutral: "before:bg-gray-950 dark:before:bg-white",
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

type WorkspaceIconProps = VariantProps<typeof worksapceIcon>;

export const WorkspaceIcon: React.FC<WorkspaceIconProps> = ({
  intent = "primary",
}) => {
  return <span className={worksapceIcon({ intent })} />;
};

{
  /* <DropdownItem onClick={() => setPerson(accounts[0].name)}>
<div className="flex items-center justify-between w-full">
  <div className="flex items-center">
    <Avatar
      size="sm"
      src={accounts[0].avatar}
      alt={accounts[0].name}
      fallback={accounts[0].initial}
    />
    <span className="ml-2">{accounts[0].name}</span>
  </div>
  {accounts[0].name === person && <IconCheck size={16} />}
</div>
</DropdownItem> */
}

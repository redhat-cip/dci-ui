import { ReactNode } from "react";

export default function CardSecondaryTitle({
  children,
  className = "",
  ...props
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      {...props}
      style={{
        paddingBlockEnd:
          "var(--pf-v6-c-card__title--not--last-child--PaddingBlockEnd)",
        paddingInlineStart: "var(--pf-v6-c-card--child--PaddingInlineStart)",
        paddingInlineEnd: "var(--pf-v6-c-card--child--PaddingInlineEnd)",
        display: "flex",
      }}
      className={`pf-v6-u-text-color-subtle pf-v6-u-font-size-xs ${className}`}
    >
      {children}
    </div>
  );
}

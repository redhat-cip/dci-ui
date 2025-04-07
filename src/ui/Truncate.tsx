import { ReactNode } from "react";

export default function Truncate({
  children,
  ...props
}: {
  children: ReactNode;
}) {
  return (
    <span
      {...props}
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {children}
    </span>
  );
}

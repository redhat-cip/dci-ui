import React, { ReactNode } from "react";

type DisplayIfBeforeProps = {
  date: string;
  children: ReactNode;
};

const DisplayIfBefore: React.FC<DisplayIfBeforeProps> = ({
  date,
  children,
}) => {
  const expirationDate = new Date(date);

  const now = new Date();

  if (now > expirationDate) {
    return null;
  }

  return <>{children}</>;
};

export default DisplayIfBefore;

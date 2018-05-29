import React from "react";

export function ContainerFluid({ className, children }) {
  return <div className={`container-fluid ${className}`}>{children}</div>;
}

export function Row({ className, children }) {
  return <div className={`row ${className}`}>{children}</div>;
}

export function Col({ className, children, size = 12 }) {
  return <div className={`col-xs-${size} ${className}`}>{children}</div>;
}

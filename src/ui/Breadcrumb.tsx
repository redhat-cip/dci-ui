import React from "react";
import { Breadcrumb, BreadcrumbItem } from "@patternfly/react-core";
import { Link } from "react-router-dom";

interface ILink {
  to?: string;
  title: string;
}

interface DCIBreadcrumbProps {
  links: ILink[];
  [key: string]: any;
}

export default function DCIBreadcrumb({ links }: DCIBreadcrumbProps) {
  return (
    <Breadcrumb>
      {links.map((link) => {
        if (link.to) {
          return (
            <BreadcrumbItem>
              <Link to={link.to}>{link.title}</Link>
            </BreadcrumbItem>
          );
        }
        return <BreadcrumbItem>{link.title}</BreadcrumbItem>;
      })}
    </Breadcrumb>
  );
}

import MainPage from "pages/MainPage";
import { Card, CardBody } from "@patternfly/react-core";
import { Breadcrumb } from "ui";
import { Outlet, useLocation, useResolvedPath } from "react-router-dom";
import { Link } from "react-router-dom";

function DCITabItem({
  children,
  to,
  ...props
}: {
  children: React.ReactNode;
  to: string;
}) {
  const location = useLocation();
  const path = useResolvedPath(to);
  const isActive = location.pathname.startsWith(path.pathname);
  return (
    <li
      className={`pf-v5-c-tabs__item ${isActive ? "pf-m-current" : ""}`}
      {...props}
    >
      <Link to={to} className="pf-v5-c-tabs__link">
        <span className="pf-v5-c-tabs__item-text">{children}</span>
      </Link>
    </li>
  );
}

export default function PermissionsPage() {
  return (
    <MainPage
      title="Permissions"
      description={
        <div>
          Change team permissions to give them access to topics and products.
        </div>
      }
      Breadcrumb={
        <Breadcrumb
          links={[{ to: "/", title: "DCI" }, { title: "Permissions" }]}
        />
      }
    >
      <Card>
        <CardBody>
          <div className="pf-v5-c-tabs" id="default-example">
            <ul className="pf-v5-c-tabs__list">
              <DCITabItem to="/permissions/products">Products</DCITabItem>
              <DCITabItem to="/permissions/topics">Topics</DCITabItem>
            </ul>
          </div>
          <Outlet />
        </CardBody>
      </Card>
    </MainPage>
  );
}

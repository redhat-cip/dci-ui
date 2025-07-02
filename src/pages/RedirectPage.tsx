import { Navigate, useSearchParams } from "react-router";

function RedirectPage({ to, replace }: { to: string; replace?: boolean }) {
  const [searchParams] = useSearchParams();
  return <Navigate to={`${to}?${searchParams.toString()}`} replace={replace} />;
}

export default RedirectPage;

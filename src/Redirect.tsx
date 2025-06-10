import { Navigate, useSearchParams } from "react-router";

function Redirect({ to, replace }: { to: string; replace?: boolean }) {
  const [searchParams] = useSearchParams();
  return <Navigate to={`${to}?${searchParams.toString()}`} replace={replace} />;
}

export default Redirect;

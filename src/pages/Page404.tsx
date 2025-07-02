import { Link } from "react-router";

export default function Page404() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <h1>Page not found</h1>
        <p>Error 404</p>
        <p>{`We are looking for your page...but we can't find it.`}</p>
        <Link to="/">Go back to the index page</Link>
      </div>
    </div>
  );
}

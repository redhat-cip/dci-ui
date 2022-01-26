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
      <div style={{ color: "white" }}>
        <h1>Page not found</h1>
        <p>Error 404</p>
        <p>We are looking for your page...but we can't find it.</p>
      </div>
    </div>
  );
}

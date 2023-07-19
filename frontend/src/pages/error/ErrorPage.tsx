import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  return <p>An error occured</p>;
}

export default ErrorPage;

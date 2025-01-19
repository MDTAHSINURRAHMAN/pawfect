import { Link, useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex flex-col gap-4 justify-center items-center">
      <img
        src="https://i.ibb.co/QJZv5jx/404.jpg"
        alt="404 Error"
        className="w-96"
      />
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-4">
          {error?.message || "Sorry, an unexpected error occurred"}
        </p>
        <Link to="/" className="btn btn-primary">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Error;

import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

const VolunteerLogin = () => {
  const { userLogin, setUser } = useContext(AuthContext);
  const [error, setError] = useState({});
  const [email, setEmail] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    setEmail(email);

    // First check if volunteer exists in MongoDB
    fetch(`http://localhost:3000/volunteers/${email}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw { ...data, status: res.status };
        return data;
      })
      .then((volunteer) => {
        if (!volunteer) {
          toast.error("Volunteer not found");
          return;
        }

        // If volunteer exists, verify credentials
        fetch("http://localhost:3000/volunteer/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })
          .then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw { ...data, status: res.status };
            return data;
          })
          .then((data) => {
            if (data.success) {
              setUser(data.volunteer);
              toast.success("Successfully logged in as volunteer!");
              navigate("/volunteer/dashboard");
            }
          })
          .catch((error) => {
            console.log("Error:", error); // Debug log
            if (error.status === 403) {
              // Check the status from the error response
              if (
                error.status === "pending" ||
                error?.response?.data?.status === "pending"
              ) {
                toast.error(
                  "Your account is waiting for admin approval. We will notify you once approved."
                );
              } else if (
                error.status === "rejected" ||
                error?.response?.data?.status === "rejected"
              ) {
                toast.error(
                  "Your volunteer application has been rejected. Please contact admin for more details."
                );
              } else {
                // If no specific status, show the error message from server
                toast.error(error.error || "Account not approved");
              }
            } else if (error.status === 401) {
              toast.error("Invalid password");
            } else if (error.status === 404) {
              toast.error("Volunteer not found");
            } else {
              toast.error(
                error.error ||
                  error?.response?.data?.error ||
                  "Error checking volunteer credentials"
              );
            }
          });
      })
      .catch((error) => {
        toast.error(
          error.error || error.message || "Error checking volunteer credentials"
        );
      });
  };

  return (
    <div>
      <Helmet>
        <title>Volunteer Login | Pawfect</title>
        <meta name="description" content="Volunteer Login page of Pawfect" />
      </Helmet>
      <Navbar></Navbar>
      <div className="min-h-screen flex justify-center items-center font-nunito text-center">
        <div className="card bg-bgOne w-full max-w-lg shrink-0 rounded-none p-2 md:p-5 lg:p-10 shadow-xl">
          <h2 className="text-2xl md:text-4xl font-semibold">
            Volunteer Login
          </h2>
          <form onSubmit={handleSubmit} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="email"
                className="input input-bordered rounded-none"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="password"
                className="input input-bordered rounded-none"
                required
              />
              {error.login && (
                <label className="label text-sm text-red-600">
                  {error.login}
                </label>
              )}
              <label className="label">
                <Link
                  to="/forgot-password"
                  state={{ email }}
                  className="label-text-alt link link-hover"
                >
                  Forgot password?
                </Link>
              </label>
            </div>
            <div className="form-control mt-3">
              <button className="btn bg-primary hover:bg-primary/80 text-white font-medium rounded-none">
                Login
              </button>
            </div>
          </form>
          <p className="text-sm md:text-base text-center font-semibold">
            Don't Have A Volunteer Account?{" "}
            <Link
              className="text-sm md:text-base text-hover-color hover:underline ml-1"
              to="/volunteer/register"
            >
              Register as Volunteer
            </Link>
          </p>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default VolunteerLogin;

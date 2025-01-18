import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai"; // Import eye icons
import Navbar from "../../components/shared/Navbar";
import Logo from "../../components/shared/logo";
import Footer from "../../components/shared/Footer";
import { Helmet } from "react-helmet-async";
import toast from 'react-hot-toast';

const Register = () => {
  const { createNewUser, setUser, updateUserProfile } = useContext(AuthContext);
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get("name");
    const email = form.get("email");
    const photo = form.get("photo");
    const password = form.get("password");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError((prevError) => ({
        ...prevError,
        password:
          "Password Must Have At Least 6 Characters, Including An Uppercase And A Lowercase Letter.",
      }));
      return;
    }
    createNewUser(email, password)
      .then((result) => {
        const user = result.user;
        setUser(user);

        // Save user to database
        const userInfo = {
          uid: user.uid, // Add uid from Firebase auth
          name,
          email,
          photo,
          role: 'user'
        };

        fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(userInfo)
        })
        .then(res => res.json())
        .then(() => {
          toast.success(
            "Account successfully created! Welcome aboard! We're excited to have you with us."
          );
          updateUserProfile({ displayName: name, photoURL: photo })
            .then(() => {
              navigate("/");
            })
            .catch((err) => {
              toast.error(err.message);
            });
        })
        .catch(err => {
          toast.error("Error saving user data");
        });

      })
      .catch((error) => {
        toast.error("Give Valid Credentials");
      });
  };

  return (
    <div>
      {/* Helmet */}
      <Helmet>
        <title>Register | Pawfect</title>
        <meta name="description" content="Register page of Pawfect" />
      </Helmet>
      <Navbar></Navbar>
      <div className="min-h-screen flex justify-center items-center font-nunito text-center">
        <div className="card bg-bgOne w-full max-w-lg shrink-0 rounded-none p-2 md:p-5 lg:p-10 shadow-xl">
          <h2 className="text-2xl md:text-4xl font-semibold">
            Register Your Account
          </h2>
          <form onSubmit={handleSubmit} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                className="input input-bordered rounded-none"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="Your Email"
                className="input input-bordered rounded-none"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Photo URL</span>
              </label>
              <input
                name="photo"
                type="text"
                placeholder="Your Photo URL"
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
                type={showPassword ? "text" : "password"}
                placeholder="Your Password"
                className="input input-bordered rounded-none pr-10"
                required
              />
              <div className="relative">
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 bottom-3.5 text-xl cursor-pointer text-gray-600"
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </span>
              </div>
              {error.password && (
                <label className="label text-xs text-start text-red-500 mt-2">
                  {error.password}
                </label>
              )}
            </div>
            <div className="form-control mt-6">
              <button className="btn bg-primary hover:bg-primary/80 text-white font-medium rounded-none">Register</button>
            </div>
          </form>
          <p className="text-sm md:text-base text-center font-semibold">
            Already Have An Account?
            <Link
              className="text-sm md:text-base text-hover-color hover:underline ml-1"
              to="/auth/login"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Register;
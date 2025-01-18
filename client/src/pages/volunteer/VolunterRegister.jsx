import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";

const VolunteerRegister = () => {
  const { user } = useContext(AuthContext);
  const { createNewUser, setUser, updateUserProfile } = useContext(AuthContext);
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get("name");
    const email = user?.email;
    const photo = form.get("photo");
    const phone = form.get("phone"); 
    const address = form.get("address");
    const password = form.get("password");

    // Save volunteer to database
    const volunteerInfo = {
      uid: user.uid,
      name,
      email,
      photo,
      phone,
      address,
      password,
      role: "volunteer",
    };

    fetch("http://localhost:3000/volunteers", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(volunteerInfo),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Volunteer account created successfully!");
        navigate("/volunteer/login");
      })
      .catch((err) => {
        toast.error("Error saving volunteer data");
      });
  };

  return (
    <div>
      <Helmet>
        <title>Volunteer Register | Pawfect</title>
        <meta
          name="description"
          content="Volunteer registration page of Pawfect"
        />
      </Helmet>
      <Navbar />
      <div className="min-h-screen flex justify-center items-center font-nunito text-center">
        <div className="card bg-bgOne w-full max-w-lg shrink-0 rounded-none p-2 md:p-5 lg:p-10 shadow-xl">
          <h2 className="text-2xl md:text-4xl font-semibold">
            Register as Volunteer
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
                value={user?.email}
                className="input input-bordered rounded-none"
                readOnly
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
                <span className="label-text">Phone</span>
              </label>
              <input
                name="phone"
                type="tel"
                placeholder="Your Phone Number"
                className="input input-bordered rounded-none"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <textarea
                name="address"
                placeholder="Your Address"
                className="textarea textarea-bordered rounded-none"
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
                placeholder="Your Password"
                className="input input-bordered rounded-none"
                required
              />
              {error.password && (
                <label className="label text-xs text-start text-red-500 mt-2">
                  {error.password}
                </label>
              )}
            </div>
            <div className="form-control mt-6">
              <button className="btn bg-primary hover:bg-primary/80 text-white font-medium rounded-none">
                Register as Volunteer
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VolunteerRegister;

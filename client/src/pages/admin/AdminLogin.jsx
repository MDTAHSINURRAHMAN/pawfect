import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";
import { Helmet } from "react-helmet-async";
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const { setUser } = useContext(AuthContext);
  const [error, setError] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    // First check if admin exists in MongoDB
    fetch(`http://localhost:3000/admins/${email}`)
      .then(res => res.json())
      .then(admin => {
        if (!admin) {
          toast.error('Admin not found');
          return;
        }

        // If admin exists, verify credentials
        fetch('http://localhost:3000/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.admin);
            toast.success('Successfully logged in as admin!');
            navigate(location?.state ? location.state : "/admin/dashboard");
          }
        })
      })
      .catch(() => {
        toast.error('Error checking admin credentials');
      });
  };

  return (
    <div>
      <Helmet>
        <title>Admin Login | Pawfect</title>
        <meta name="description" content="Admin Login page of Pawfect" />
      </Helmet>
      <Navbar />
      <div className="min-h-screen flex justify-center items-center font-nunito text-center">
        <div className="card bg-bgOne w-full max-w-lg shrink-0 rounded-none p-2 md:p-5 lg:p-10 shadow-xl">
          <h2 className="text-2xl md:text-4xl font-semibold">
            Admin Login
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
            </div>
            <div className="form-control mt-6">
              <button className="btn bg-primary hover:bg-primary/80 text-white font-medium rounded-none">
                Login as Admin
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLogin;


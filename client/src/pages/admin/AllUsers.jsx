import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const AllUsers = () => {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/admin/users");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <Helmet>
        <title>All Users | Admin Dashboard</title>
      </Helmet>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary">All Users</h2>
        <p className="text-gray-600 mt-2">Total Users: {users.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="card-body">
              <div className="flex items-center gap-4 mb-4">
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full">
                    <img
                      src={user.photo || "https://i.ibb.co/5GzXkwq/user.png"}
                      alt={user.name}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <div className="badge badge-primary">
                    {user.role || "User"}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-gray-600">
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-primary" />
                  {user.email}
                </p>
                {user.phone && (
                  <p className="flex items-center gap-2">
                    <FaPhone className="text-primary" />
                    {user.phone}
                  </p>
                )}
                {user.address && (
                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" />
                    {user.address}
                  </p>
                )}
              </div>

              <div className="card-actions justify-end mt-4">
                <Link
                  to={`/admin/dashboard/users/${user.email}`}
                  className="btn btn-sm btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;

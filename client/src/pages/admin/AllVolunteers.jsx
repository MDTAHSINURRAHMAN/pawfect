import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const AllVolunteers = () => {
  const { data: approvedVolunteers = [], isLoading: isLoadingApproved } = useQuery({
    queryKey: ["approvedVolunteers"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/admin/volunteers");
      return res.data;
    },
  });

  const { data: pendingVolunteers = [], isLoading: isLoadingPending } = useQuery({
    queryKey: ["pendingVolunteers"], 
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/admin/volunteers/pending");
      return res.data;
    },
  });

  if (isLoadingApproved || isLoadingPending) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <Helmet>
        <title>All Volunteers | Admin Dashboard</title>
      </Helmet>

      {/* Pending Volunteers Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-warning">Pending Volunteers</h2>
        <p className="text-gray-600 mt-2">Total Pending: {pendingVolunteers.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {pendingVolunteers.map((volunteer) => (
          <div
            key={volunteer._id}
            className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-warning"
          >
            <div className="card-body">
              <div className="flex items-center gap-4 mb-4">
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full">
                    <img
                      src={volunteer.photo || "https://i.ibb.co/5GzXkwq/user.png"}
                      alt={volunteer.name}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{volunteer.name}</h3>
                  <div className="badge badge-warning">Pending</div>
                </div>
              </div>

              <div className="space-y-2 text-gray-600">
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-warning" />
                  {volunteer.email}
                </p>
                {volunteer.phone && (
                  <p className="flex items-center gap-2">
                    <FaPhone className="text-warning" />
                    {volunteer.phone}
                  </p>
                )}
                {volunteer.address && (
                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-warning" />
                    {volunteer.address}
                  </p>
                )}
              </div>

              <div className="card-actions justify-end mt-4">
                <Link 
                  to={`/admin/dashboard/volunteers/pending/${volunteer.email}`} 
                  className="btn btn-sm btn-warning"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Approved Volunteers Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary">Approved Volunteers</h2>
        <p className="text-gray-600 mt-2">Total Approved: {approvedVolunteers.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {approvedVolunteers.map((volunteer) => (
          <div
            key={volunteer._id}
            className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="card-body">
              <div className="flex items-center gap-4 mb-4">
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full">
                    <img
                      src={volunteer.photo || "https://i.ibb.co/5GzXkwq/user.png"}
                      alt={volunteer.name}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{volunteer.name}</h3>
                  <div className="badge badge-primary">Volunteer</div>
                </div>
              </div>

              <div className="space-y-2 text-gray-600">
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-primary" />
                  {volunteer.email}
                </p>
                {volunteer.phone && (
                  <p className="flex items-center gap-2">
                    <FaPhone className="text-primary" />
                    {volunteer.phone}
                  </p>
                )}
                {volunteer.address && (
                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" />
                    {volunteer.address}
                  </p>
                )}
              </div>

              <div className="card-actions justify-end mt-4">
                <Link 
                  to={`/admin/dashboard/volunteers/${volunteer.email}`} 
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

export default AllVolunteers;

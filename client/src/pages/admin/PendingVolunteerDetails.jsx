import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

const PendingVolunteerDetails = () => {
  const { email } = useParams();
  const navigate = useNavigate();

  const { data: volunteer, isLoading } = useQuery({
    queryKey: ["pendingVolunteer", email],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/admin/volunteers/pending/${email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-warning"></span>
      </div>
    );
  }

  const handleApprove = async () => {
    try {
      await axios.patch(`http://localhost:3000/admin/volunteers/${email}/status`, {
        status: "approved"
      });
      toast.success("Volunteer approved successfully!");
      navigate("/admin/dashboard/volunteers");
    } catch (error) {
      toast.error("Failed to approve volunteer");
      console.error(error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.patch(`http://localhost:3000/admin/volunteers/${email}/status`, {
        status: "rejected"
      });
      toast.success("Volunteer rejected");
      navigate("/admin/dashboard/volunteers");
    } catch (error) {
      toast.error("Failed to reject volunteer");
      console.error(error);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <Helmet>
        <title>Pending Volunteer Details | Admin Dashboard</title>
      </Helmet>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="avatar">
            <div className="w-24 h-24 rounded-full">
              <img
                src={volunteer.photo || "https://i.ibb.co/5GzXkwq/user.png"}
                alt={volunteer.name}
                className="object-cover"
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold">{volunteer.name}</h2>
            <div className="badge badge-warning mt-2">Pending Approval</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <p className="flex items-center gap-3 text-lg">
              <FaEnvelope className="text-warning" />
              {volunteer.email}
            </p>
            {volunteer.phone && (
              <p className="flex items-center gap-3 text-lg">
                <FaPhone className="text-warning" />
                {volunteer.phone}
              </p>
            )}
            {volunteer.address && (
              <p className="flex items-center gap-3 text-lg">
                <FaMapMarkerAlt className="text-warning" />
                {volunteer.address}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Additional Information</h3>
            <p className="text-gray-600">
              Applied on: {new Date(volunteer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <button
            onClick={handleApprove}
            className="btn btn-success text-white"
          >
            Approve Volunteer
          </button>
          <button
            onClick={handleReject}
            className="btn btn-error text-white"
          >
            Reject Volunteer
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingVolunteerDetails;

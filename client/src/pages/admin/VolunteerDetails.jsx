import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { useState } from "react";

const VolunteerDetails = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    photo: ""
  });

  const { data: volunteer, isLoading, refetch } = useQuery({
    queryKey: ["volunteer", email],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/admin/volunteers/${email}`);
      return res.data;
    },
  });

  const handleEditClick = () => {
    setFormData({
      name: volunteer?.name || "",
      email: volunteer?.email || "",
      phone: volunteer?.phone || "",
      address: volunteer?.address || "",
      photo: volunteer?.photo || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/admin/volunteers/${email}`, formData);
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error updating volunteer:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/admin/volunteers/${email}`);
      setIsDeleteModalOpen(false);
      navigate('/admin/dashboard/volunteers');
    } catch (error) {
      console.error("Error deleting volunteer:", error);
    }
  };

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
        <title>Volunteer Details | Admin Dashboard</title>
      </Helmet>

      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">Volunteer Details</h2>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-start">
          <div className="w-full lg:w-1/3">
            <div className="avatar flex justify-center lg:justify-start">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-lg">
                <img
                  src={volunteer?.photo || "https://i.ibb.co/5GzXkwq/user.png"}
                  alt={volunteer?.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3 space-y-4 md:space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl md:text-2xl font-bold mb-2">{volunteer?.name}</h3>
              <div className="badge badge-primary">Volunteer</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-primary text-lg md:text-xl flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-700 break-words">{volunteer?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaPhone className="text-primary text-lg md:text-xl flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-700">{volunteer?.phone || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-primary text-lg md:text-xl flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-700 break-words">{volunteer?.address || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaCalendar className="text-primary text-lg md:text-xl flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="text-gray-700">
                      {volunteer?.createdAt 
                        ? new Date(volunteer.createdAt).toLocaleDateString()
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 md:pt-6 border-t">
              <h4 className="text-base md:text-lg font-semibold mb-4 text-center lg:text-left">Actions</h4>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button onClick={handleEditClick} className="btn btn-primary w-full sm:w-auto">
                  Edit Volunteer
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(true)} 
                  className="btn btn-error text-white w-full sm:w-auto"
                >
                  Delete Volunteer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Volunteer Modal */}
      <dialog id="edit_modal" className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box w-11/12 max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Edit Volunteer Details</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Photo URL</span>
              </label>
              <input
                type="url"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                className="input input-bordered"
              />
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button 
                type="button" 
                className="btn" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Delete Confirmation Modal */}
      <dialog id="delete_modal" className={`modal ${isDeleteModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Delete</h3>
          <p className="py-4">Are you sure you want to delete this volunteer? This action cannot be undone.</p>
          <div className="modal-action">
            <button onClick={handleDelete} className="btn btn-error text-white">Delete</button>
            <button 
              className="btn" 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default VolunteerDetails;

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaPaw, FaWeight, FaMapMarkerAlt, FaDollarSign, FaEdit, FaTrash } from "react-icons/fa";
import { MdPets } from "react-icons/md";

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/admin/pets/${id}`);
        if (!res.data) {
          throw new Error("Pet not found");
        }
        setPet(res.data);
        setEditFormData(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching pet:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/admin/pets/${id}`);
      setShowDeleteModal(false);
      navigate("/admin/dashboard/pets");
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/admin/pets/${id}`, editFormData);
      setPet(editFormData);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating pet:", error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <Helmet>
        <title>{pet?.name ? `${pet.name} | Admin Dashboard` : 'Pet Details | Admin Dashboard'}</title>
      </Helmet>

      <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Pet Image */}
          <div className="w-full lg:w-1/3">
            <img
              src={pet?.image || "https://i.ibb.co/HP0qQXx/pet-placeholder.png"}
              alt={pet?.name}
              className="w-full h-[250px] sm:h-[300px] object-cover rounded-lg"
            />
          </div>

          {/* Pet Information */}
          <div className="w-full lg:w-2/3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">{pet?.name}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-secondary">{pet?.species}</span>
                  <span className="badge badge-accent">{pet?.adoptionStatus}</span>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="btn btn-primary btn-sm flex-1 sm:flex-none"
                >
                  <FaEdit className="mr-1" /> Edit
                </button>
                <button 
                  onClick={() => setShowDeleteModal(true)} 
                  className="btn btn-error btn-sm flex-1 sm:flex-none"
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="flex items-center gap-2 text-sm sm:text-base">
                  <FaPaw className="text-primary" />
                  <span className="font-semibold">Breed:</span> {pet?.breed}
                </p>
                <p className="flex items-center gap-2 text-sm sm:text-base">
                  <MdPets className="text-primary" />
                  <span className="font-semibold">Age:</span> {pet?.age} years
                </p>
                <p className="flex items-center gap-2 text-sm sm:text-base">
                  <FaWeight className="text-primary" />
                  <span className="font-semibold">Weight:</span> {pet?.weight} lbs
                </p>
                <p className="flex items-center gap-2 text-sm sm:text-base">
                  <FaMapMarkerAlt className="text-primary" />
                  <span className="font-semibold">Location:</span> {pet?.location}
                </p>
                <p className="flex items-center gap-2 text-sm sm:text-base">
                  <FaDollarSign className="text-primary" />
                  <span className="font-semibold">Adoption Fee:</span> ${pet?.adoptionFee}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-sm sm:text-base">Health Status:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`badge ${pet?.isSpayedNeutered ? 'badge-success' : 'badge-error'} text-xs sm:text-sm`}>
                      {pet?.isSpayedNeutered ? 'Spayed/Neutered' : 'Not Spayed/Neutered'}
                    </span>
                    <span className={`badge ${pet?.isVaccinated ? 'badge-success' : 'badge-error'} text-xs sm:text-sm`}>
                      {pet?.isVaccinated ? 'Vaccinated' : 'Not Vaccinated'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-sm sm:text-base">Good With:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`badge ${pet?.goodWithChildren ? 'badge-success' : 'badge-error'} text-xs sm:text-sm`}>
                      {pet?.goodWithChildren ? 'Children' : 'No Children'}
                    </span>
                    <span className={`badge ${pet?.goodWithPets ? 'badge-success' : 'badge-error'} text-xs sm:text-sm`}>
                      {pet?.goodWithPets ? 'Other Pets' : 'No Other Pets'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-sm sm:text-base">Energy Level:</span>
                  <span className="badge badge-info ml-2 text-xs sm:text-sm">{pet?.energyLevel}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Description</h3>
              <p className="text-gray-600 text-sm sm:text-base">{pet?.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Adoption Requirements</h3>
              <p className="text-gray-600 text-sm sm:text-base">{pet?.adoptionRequirements}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <dialog id="delete_modal" className={`modal ${showDeleteModal ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-sm mx-auto">
          <h3 className="font-bold text-lg">Confirm Delete</h3>
          <p className="py-4">Are you sure you want to delete {pet?.name}? This action cannot be undone.</p>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            <button className="btn btn-error" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </dialog>

      {/* Edit Modal */}
      <dialog id="edit_modal" className={`modal ${showEditModal ? 'modal-open' : ''}`}>
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg mb-4">Edit Pet Details</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name || ''}
                  onChange={handleEditChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">Species</label>
                <select
                  name="species"
                  value={editFormData.species || ''}
                  onChange={handleEditChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="Cat">Cat</option>
                  <option value="Dog">Dog</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">Breed</label>
                <input
                  type="text"
                  name="breed"
                  value={editFormData.breed || ''}
                  onChange={handleEditChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">Age</label>
                <input
                  type="number"
                  name="age"
                  value={editFormData.age || ''}
                  onChange={handleEditChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">Weight (lbs)</label>
                <input
                  type="number"
                  name="weight"
                  value={editFormData.weight || ''}
                  onChange={handleEditChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">Adoption Fee ($)</label>
                <input
                  type="number"
                  name="adoptionFee"
                  value={editFormData.adoptionFee || ''}
                  onChange={handleEditChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editFormData.location || ''}
                  onChange={handleEditChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={editFormData.image || ''}
                  onChange={handleEditChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="form-control col-span-2">
                <label className="label">Description</label>
                <textarea
                  name="description"
                  value={editFormData.description || ''}
                  onChange={handleEditChange}
                  className="textarea textarea-bordered h-24 w-full"
                  required
                />
              </div>

              <div className="form-control col-span-2">
                <label className="label">Adoption Requirements</label>
                <textarea
                  name="adoptionRequirements"
                  value={editFormData.adoptionRequirements || ''}
                  onChange={handleEditChange}
                  className="textarea textarea-bordered h-24 w-full"
                  required
                />
              </div>
            </div>

            <div className="modal-action flex-wrap gap-2">
              <button type="button" className="btn btn-ghost order-1 sm:order-none w-full sm:w-auto" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary w-full sm:w-auto">Save Changes</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default PetDetails;

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaPaw, FaWeight, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";
import { MdPets } from "react-icons/md";

const PendingPetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/admin/pets/${id}`);
        if (!res.data) {
          throw new Error("Pet not found");
        }
        setPet(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching pet:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleApprove = async () => {
    try {
      await axios.put(`http://localhost:3000/admin/pets/${id}`, {
        ...pet,
        approved: true
      });
      navigate("/admin/dashboard/pets");
    } catch (error) {
      console.error("Error approving pet:", error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.delete(`http://localhost:3000/admin/pets/${id}`);
      navigate("/admin/dashboard/pets");
    } catch (error) {
      console.error("Error rejecting pet:", error);
    }
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
    <div className="p-4 md:p-8">
      <Helmet>
        <title>Pending Pet Details | Admin Dashboard</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="bg-warning/10 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-warning">Pending Approval</h2>
          <p className="text-gray-600">This pet listing requires your review</p>
        </div>

        <div className="bg-base-100 shadow-xl rounded-lg overflow-hidden">
          <div className="relative h-96">
            <img
              src={pet.image || "https://i.ibb.co/HP0qQXx/pet-placeholder.png"}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold text-primary mb-4">{pet.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <p className="flex items-center gap-2">
                  <FaPaw className="text-primary" />
                  <span className="font-semibold">Species:</span> {pet.species}
                </p>
                <p className="flex items-center gap-2">
                  <MdPets className="text-primary" />
                  <span className="font-semibold">Breed:</span> {pet.breed}
                </p>
                <p className="flex items-center gap-2">
                  <FaWeight className="text-primary" />
                  <span className="font-semibold">Weight:</span> {pet.weight} lbs
                </p>
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary" />
                  <span className="font-semibold">Location:</span> {pet.location}
                </p>
              </div>

              <div className="space-y-3">
                <p>
                  <span className="font-semibold">Age:</span> {pet.age} years
                </p>
                <p>
                  <span className="font-semibold">Gender:</span> {pet.gender}
                </p>
                <p>
                  <span className="font-semibold">Color:</span> {pet.color}
                </p>
                <p className="flex items-center gap-2">
                  <FaDollarSign className="text-primary" />
                  <span className="font-semibold">Adoption Fee:</span> ${pet.adoptionFee}
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{pet.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Health Information</h3>
                <div className="flex flex-wrap gap-2">
                  <span className={`badge ${pet.isVaccinated ? 'badge-success' : 'badge-error'}`}>
                    {pet.isVaccinated ? 'Vaccinated' : 'Not Vaccinated'}
                  </span>
                  <span className={`badge ${pet.isSpayedNeutered ? 'badge-success' : 'badge-error'}`}>
                    {pet.isSpayedNeutered ? 'Spayed/Neutered' : 'Not Spayed/Neutered'}
                  </span>
                </div>
                {pet.healthIssues && (
                  <p className="mt-2 text-gray-600">{pet.healthIssues}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleApprove}
                className="btn btn-success flex-1"
              >
                Approve
              </button>
              <button
                onClick={handleReject}
                className="btn btn-error flex-1"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingPetDetails;

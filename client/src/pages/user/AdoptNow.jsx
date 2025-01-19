import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useNavigate, } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaPaw, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";
import Navbar from "../../components/shared/Navbar";

const AdoptNow = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: pet, isLoading } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/admin/pets/${id}`);
      return res.data;
    },
  });

  const handleAdopt = async () => {
    try {
      // Add adoption logic here
      // Could include API call to update pet status, create adoption record etc.
      
      // For now just show success message
      navigate(`/user/payment/${id}`);
    } catch (error) {
      console.error("Error submitting adoption request:", error);
      alert("Error submitting adoption request. Please try again.");
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
    <div>
      <Navbar />
      <div className="container mx-auto p-4 lg:p-8">
        <Helmet>
          <title>{`Adopt ${pet?.name || ''} | Pawfect`}</title>
        </Helmet>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-64 w-full md:w-96 object-cover"
                src={pet?.image || "https://i.ibb.co/HP0qQXx/pet-placeholder.png"}
                alt={pet?.name}
              />
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-primary mb-2">{pet?.name}</h1>
                  <div className="flex gap-2 mb-4">
                    <span className="badge badge-secondary">{pet?.species}</span>
                    <span className="badge badge-accent">{pet?.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">${pet?.adoptionFee}</p>
                  <p className="text-sm text-gray-500">Adoption Fee</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                  <FaPaw className="text-primary" />
                  <span className="font-medium">Breed:</span> {pet?.breed}
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary" />
                  <span className="font-medium">Location:</span> {pet?.location}
                </div>
                <p><span className="font-medium">Age:</span> {pet?.age} years old</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{pet?.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Health Information</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className={`badge ${pet?.isVaccinated ? 'badge-success' : 'badge-error'}`}>
                      {pet?.isVaccinated ? 'Vaccinated' : 'Not Vaccinated'}
                    </span>
                    <span className={`badge ${pet?.isSpayedNeutered ? 'badge-success' : 'badge-error'}`}>
                      {pet?.isSpayedNeutered ? 'Spayed/Neutered' : 'Not Spayed/Neutered'}
                    </span>
                  </div>
                  {pet?.healthIssues && (
                    <p className="mt-2 text-gray-600">{pet.healthIssues}</p>
                  )}
                </div>
              </div>

              <button
                onClick={handleAdopt}
                className="btn btn-primary w-full"
              >
                Adopt {pet?.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptNow;

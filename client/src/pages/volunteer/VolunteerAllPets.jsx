import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaPaw, FaMapMarkerAlt, FaPlus } from "react-icons/fa";

const VolunteerAllPets = () => {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await axios.get("http://localhost:3000/volunteer/dashboard/pets");
        setPets(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching pets:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchPets();
  }, []);

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
        <title>All Pets | Volunteer Dashboard</title>
      </Helmet>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-primary">All Pets</h2>
          <p className="text-gray-600 mt-2">View and manage all available pets</p>
        </div>
        <Link to="/volunteer/dashboard/pets/add" className="btn btn-primary">
          <FaPlus className="mr-2" /> Add Pet
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <div key={pet._id} className="card bg-base-100 shadow-xl">
            <figure className="px-4 pt-4">
              <img
                src={pet.image}
                alt={pet.name}
                className="rounded-xl h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-primary">{pet.name}</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="badge badge-secondary">{pet.species}</span>
                <span className="badge badge-accent">{pet.adoptionStatus}</span>
              </div>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <FaPaw className="text-primary" />
                  {pet.breed}
                </p>
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary" />
                  {pet.location}
                </p>
              </div>
              <div className="card-actions justify-end mt-4">
                <Link to={`/volunteer/dashboard/pets/${pet._id}`} className="btn btn-primary btn-sm">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pets.length === 0 && (
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold text-gray-600">No pets available</h3>
        </div>
      )}
    </div>
  );
};

export default VolunteerAllPets;

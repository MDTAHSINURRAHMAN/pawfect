import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaPaw, FaMapMarkerAlt, FaBookmark as FaBookmarkSolid, FaRegBookmark } from "react-icons/fa";
import Navbar from "../../components/shared/Navbar";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";

const Adopt = () => {
    const { user } = useContext(AuthContext);
  const { data: pets = [], isLoading } = useQuery({
    queryKey: ["adoptablePets"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/user/dashboard/pets");
      return res.data;
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: async (pet) => {
      const userEmail = user.email;
      const bookmarkData = {
        userEmail,
        petId: pet._id,
        pet: {
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          age: pet.age,
          location: pet.location,
          image: pet.image,
          description: pet.description,
          isVaccinated: pet.isVaccinated,
          isSpayedNeutered: pet.isSpayedNeutered
        }
      };
      const res = await axios.post(`http://localhost:3000/user/dashboard/pets/${pet._id}/bookmark`, bookmarkData);
      return res.data;
    },
    onSuccess: () => {
      alert("Pet bookmarked successfully!");
    },
    onError: (error) => {
      console.error("Error bookmarking pet:", error);
      alert("Error bookmarking pet. Please try again.");
    }
  });

  const handleBookmark = (pet) => {
    if (!user) {
      alert("Please login to bookmark pets");
      return;
    }
    bookmarkMutation.mutate(pet);
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
      <Navbar></Navbar>
      <div className="p-4 lg:p-8">
        <Helmet>
          <title>Adopt a Pet | Pawfect</title>
        </Helmet>

        <div className="mb-8">
          <h2 className="text-3xl text-center font-bold text-primary">Adopt a Pet</h2>
          <p className="text-gray-600 text-center mt-2">Find your perfect companion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <figure className="px-4 pt-4 relative">
                <img
                  src={
                    pet.image || "https://i.ibb.co/HP0qQXx/pet-placeholder.png"
                  }
                  alt={pet.name}
                  className="rounded-xl h-48 w-full object-cover"
                />
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleBookmark(pet);
                  }}
                  className="absolute top-6 right-6 text-primary hover:text-primary/80 transition-colors"
                >
                  {pet.isBookmarked ? (
                    <FaBookmarkSolid className="text-xl" />
                  ) : (
                    <FaRegBookmark className="text-xl" />
                  )}
                </button>
              </figure>
              <div className="card-body">
                <h2 className="card-title text-primary">
                  {pet.name}
                  <div className="badge badge-secondary">{pet.species}</div>
                </h2>

                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <FaPaw className="text-primary" />
                    {pet.breed}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" />
                    {pet.location}
                  </p>
                  <p className="text-gray-600">{pet.age} years old</p>
                  <p className="text-gray-600 line-clamp-2">
                    {pet.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 my-2">
                  {pet.isVaccinated && (
                    <span className="badge badge-success">Vaccinated</span>
                  )}
                  {pet.isSpayedNeutered && (
                    <span className="badge badge-info">Spayed/Neutered</span>
                  )}
                </div>

                <div className="card-actions justify-end mt-4">
                  <Link to={`/adopt/${pet._id}`} className="btn btn-primary">Adopt Now</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pets.length === 0 && (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-gray-600">
              No pets available for adoption
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Adopt;

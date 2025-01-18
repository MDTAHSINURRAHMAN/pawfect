import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaPaw, FaPlus } from "react-icons/fa";

const AllPets = () => {
  const { data: approvedPets = [], isLoading: isApprovedLoading } = useQuery({
    queryKey: ["approvedPets"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/admin/pets");
      return res.data;
    },
  });

  const { data: pendingPets = [], isLoading: isPendingLoading } = useQuery({
    queryKey: ["pendingPets"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/admin/pets/pending");
      return res.data;
    },
  });

  if (isApprovedLoading || isPendingLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <Helmet>
        <title>All Pets | Admin Dashboard</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">All Pets</h2>
          <p className="text-gray-600 mt-2">
            Total Pets: {approvedPets.length + pendingPets.length}
          </p>
        </div>
        <Link
          to="/admin/dashboard/pets/add"
          className="btn btn-primary gap-2 w-full sm:w-auto"
        >
          <FaPlus /> Add New Pet
        </Link>
      </div>

      {pendingPets.length > 0 && (
        <>
          <h3 className="text-xl font-semibold text-warning mb-4">Pending Approval ({pendingPets.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
            {pendingPets.map((pet) => (
              <div
                key={pet._id}
                className="card bg-warning/10 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <figure className="px-3 sm:px-4 pt-3 sm:pt-4">
                  <img
                    src={pet.image || "https://i.ibb.co/HP0qQXx/pet-placeholder.png"}
                    alt={pet.name}
                    className="rounded-xl h-40 sm:h-48 w-full object-cover"
                  />
                </figure>
                <div className="card-body p-4 sm:p-6">
                  <h3 className="card-title text-base sm:text-lg flex-wrap">
                    {pet.name}
                    <div className="badge badge-warning text-xs sm:text-sm">Pending</div>
                  </h3>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <p className="flex items-center gap-2 text-sm sm:text-base">
                      <FaPaw className="text-warning" />
                      {pet.breed}
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base">{pet.age} years old</p>
                    <p className="text-gray-600 text-sm sm:text-base line-clamp-2">{pet.description}</p>
                  </div>

                  <div className="card-actions justify-end mt-3 sm:mt-4">
                    <Link 
                      to={`/admin/dashboard/pets/pending/${pet._id}`}
                      className="btn btn-warning btn-sm w-full sm:w-auto"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h3 className="text-xl font-semibold text-primary mb-4">Approved Pets ({approvedPets.length})</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {approvedPets.map((pet) => (
          <div
            key={pet._id}
            className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <figure className="px-3 sm:px-4 pt-3 sm:pt-4">
              <img
                src={pet.image || "https://i.ibb.co/HP0qQXx/pet-placeholder.png"}
                alt={pet.name}
                className="rounded-xl h-40 sm:h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body p-4 sm:p-6">
              <h3 className="card-title text-base sm:text-lg flex-wrap">
                {pet.name}
                <div className="badge badge-secondary text-xs sm:text-sm">{pet.category}</div>
              </h3>
              
              <div className="space-y-1 sm:space-y-2">
                <p className="flex items-center gap-2 text-sm sm:text-base">
                  <FaPaw className="text-primary" />
                  {pet.breed}
                </p>
                <p className="text-gray-600 text-sm sm:text-base">{pet.age} years old</p>
                <p className="text-gray-600 text-sm sm:text-base line-clamp-2">{pet.description}</p>
              </div>

              <div className="card-actions justify-end mt-3 sm:mt-4">
                <Link 
                  to={`/admin/dashboard/pets/${pet._id}`}
                  className="btn btn-primary btn-sm w-full sm:w-auto"
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

export default AllPets;

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet-async";

const AllAdoptedPets = () => {
  const {
    data: adoptedPets,
    isLoading,
  } = useQuery({
    queryKey: ["adoptedPets"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/admin/pets/adopted");
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
    <div>
      <Helmet>
        <title>All Adopted Pets | Admin Dashboard</title>
      </Helmet>

      <div className="mb-8">
        <h2 className="text-3xl font-bold">All Adopted Pets</h2>
        <p className="text-gray-600 mt-2">View all pets that have been successfully adopted</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adoptedPets?.map((pet) => (
          <div key={pet._id} className="card bg-base-100 shadow-xl">
            <figure className="px-4 pt-4">
              <img
                src={pet.image}
                alt={pet.name}
                className="rounded-xl h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{pet.name}</h2>
              <p><span className="font-semibold">Category:</span> {pet.category}</p>
              <p><span className="font-semibold">Age:</span> {pet.age}</p>
              <p><span className="font-semibold">Location:</span> {pet.location}</p>
              <div className="badge badge-success">Adopted</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAdoptedPets;

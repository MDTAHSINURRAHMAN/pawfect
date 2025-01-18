import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaPaw, FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { toast } from "react-toastify";

const AllBookmarks = () => {
  const { user } = useContext(AuthContext);

  const { data: bookmarks = [], isLoading, refetch } = useQuery({
    queryKey: ["bookmarks", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3000/user/dashboard/bookmarks?userEmail=${user.email}`
      );
      return res.data;
    },
  });

  const deleteBookmarkMutation = useMutation({
    mutationFn: async (bookmarkId) => {
      const res = await axios.delete(
        `http://localhost:3000/user/dashboard/bookmarks/${bookmarkId}`
      );
      return res.data;
    },
    onSuccess: () => {
      refetch();
      toast.success("Bookmark removed successfully");
    },
    onError: (error) => {
      console.error("Error removing bookmark:", error);
      toast.error("Error removing bookmark. Please try again.");
    }
  });

  const handleDeleteBookmark = (bookmarkId) => {
    deleteBookmarkMutation.mutate(bookmarkId);
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
      <Helmet>
        <title>My Bookmarked Pets | Pawfect</title>
      </Helmet>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary">My Bookmarked Pets</h2>
        <p className="text-gray-600 mt-2">Pets you've saved for later</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark._id}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
          >
            <figure className="px-4 pt-4">
              <img
                src={
                  bookmark.pet?.image ||
                  "https://i.ibb.co/HP0qQXx/pet-placeholder.png"
                }
                alt={bookmark.pet?.name}
                className="rounded-xl h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-primary">
                {bookmark.pet?.name}
                <div className="badge badge-secondary">
                  {bookmark.pet?.species}
                </div>
              </h2>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <FaPaw className="text-primary" />
                  {bookmark.pet?.breed}
                </p>
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary" />
                  {bookmark.pet?.location}
                </p>
                <p className="text-gray-600">{bookmark.pet?.age} years old</p>
                <p className="text-gray-600 line-clamp-2">
                  {bookmark.pet?.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 my-2">
                {bookmark.pet?.isVaccinated && (
                  <span className="badge badge-success">Vaccinated</span>
                )}
                {bookmark.pet?.isSpayedNeutered && (
                  <span className="badge badge-info">Spayed/Neutered</span>
                )}
              </div>

              <div className="card-actions justify-end mt-4">
                <button
                  onClick={() => handleDeleteBookmark(bookmark._id)}
                  className="btn btn-error btn-sm"
                >
                  <FaTrash /> Remove
                </button>
                <Link
                  to={`/adopt/${bookmark.petId}`}
                  className="btn btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bookmarks.length === 0 && (
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold text-gray-600">
            You haven't bookmarked any pets yet
          </h3>
          <Link to="/adopt" className="btn btn-primary mt-4">
            Browse Pets
          </Link>
        </div>
      )}
    </div>
  );
};

export default AllBookmarks;

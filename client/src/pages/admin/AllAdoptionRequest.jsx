import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";

const AllAdoptionRequest = () => {
  const {
    data: adoptionRequests,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["adoptionRequests"],
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost:3000/admin/adoption-requests"
      );
      return res.data;
    },
  });

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to ${newStatus} this adoption request?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      if (result.isConfirmed) {
        await axios.patch(
          `http://localhost:3000/admin/adoption-requests/${id}`,
          {
            approvalStatus: newStatus,
          }
        );

        refetch(); // Refresh the data

        Swal.fire(
          "Updated!",
          "The adoption request has been updated.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire("Error!", "Failed to update the adoption request.", "error");
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
      <Helmet>
        <title>All Adoption Requests | Admin Dashboard</title>
      </Helmet>

      <div className="mb-8">
        <h2 className="text-3xl font-bold">All Adoption Requests</h2>
        <p className="text-gray-600 mt-2">
          Manage adoption requests from users
        </p>
      </div>

      {adoptionRequests?.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-2xl font-semibold text-gray-600">
            No adoption requests found
          </h3>
          <p className="text-gray-500 mt-2">
            There are no pending adoption requests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adoptionRequests?.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={request.pet?.image}
                  alt={request.pet?.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold">{request.pet?.name}</h3>
                  <p className="text-gray-600">{request.pet?.breed}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Requester Email:</span>{" "}
                  {request.customerEmail}
                </p>
                <p>
                  <span className="font-semibold">Transaction ID:</span>{" "}
                  {request.transactionId}
                </p>
                <p>
                  <span className="font-semibold">Amount Paid:</span> $
                  {request.amount / 100}
                </p>
                <p>
                  <span className="font-semibold">Payment Date:</span>{" "}
                  {new Date(request.paymentDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`badge ${
                      request.approvalStatus === "pending"
                        ? "badge-warning"
                        : request.approvalStatus === "approved"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {request.approvalStatus.charAt(0).toUpperCase() +
                      request.approvalStatus.slice(1)}
                  </span>
                </p>
              </div>

              {request.approvalStatus === "pending" && (
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => handleUpdateStatus(request._id, "approved")}
                    className="btn btn-success flex-1"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(request._id, "rejected")}
                    className="btn btn-error flex-1"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllAdoptionRequest;

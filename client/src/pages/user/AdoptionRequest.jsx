import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet-async";

const AdoptionRequest = () => {
  const { user } = useContext(AuthContext);

  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/user/payments/pending/${user?.email}`);
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
      <div className="min-h-screen bg-base-200">
        <Helmet>
          <title>Adoption Requests | Pawfect</title>
        </Helmet>

        <div className="max-w-6xl mx-auto p-8">
          <h2 className="text-3xl font-bold mb-8">My Adoption Requests</h2>

          {payments?.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-2xl font-semibold text-gray-600">No adoption requests found</h3>
              <p className="text-gray-500 mt-2">You haven't made any adoption requests yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {payments?.map((payment) => (
                <div key={payment._id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={payment.pet?.image} 
                      alt={payment.pet?.name}
                      className="w-24 h-24 rounded-lg object-cover" 
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{payment.pet?.name}</h3>
                      <p className="text-gray-600">{payment.pet?.breed}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">Transaction ID:</span>{" "}
                      {payment.transactionId}
                    </p>
                    <p>
                      <span className="font-semibold">Amount Paid:</span>{" "}
                      ${payment.amount / 100}
                    </p>
                    <p>
                      <span className="font-semibold">Payment Date:</span>{" "}
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      {payment.approvalStatus === "pending" ? (
                        <span className="badge badge-warning">Pending Approval</span>
                      ) : payment.approvalStatus === "approved" ? (
                        <span className="badge badge-success">Approved</span>
                      ) : (
                        <span className="badge badge-error">Rejected</span>
                      )}
                    </p>
                  </div>

                  {payment.approvalStatus === "approved" && (
                    <div className="alert alert-success mt-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>Congratulations! Your adoption request has been approved. We will contact you soon with next steps.</span>
                    </div>
                  )}

                  {payment.approvalStatus === "pending" && (
                    <div className="alert alert-info mt-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>Your adoption request is being reviewed. We will notify you once it's approved.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdoptionRequest;

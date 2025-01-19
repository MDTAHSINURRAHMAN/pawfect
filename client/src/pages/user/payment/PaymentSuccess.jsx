import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "../../../components/shared/Navbar";

const PaymentSuccess = () => {
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

  const latestPayment = payments?.[0];

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-base-200">
        <Helmet>
          <title>Payment Success | Pawfect</title>
        </Helmet>

        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white shadow-xl rounded-lg p-8 text-center space-y-6">
            <div className="text-7xl mb-4">🎉</div>
            
            <h2 className="text-3xl font-bold text-primary">
              Payment Successful!
            </h2>

            <div className="text-gray-600">
              <p className="text-lg mb-2">
                Thank you for your payment. Your transaction was successful.
              </p>
              
              <div className="divider"></div>

              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Transaction ID:</span>{" "}
                  {latestPayment?.transactionId}
                </p>
                <p>
                  <span className="font-semibold">Amount Paid:</span>{" "}
                  ${latestPayment?.amount / 100}
                </p>
                <p>
                  <span className="font-semibold">Pet Name:</span>{" "}
                  {latestPayment?.pet?.name}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span className="badge badge-warning">Pending Approval</span>
                </p>
              </div>

              <div className="alert alert-info mt-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Your adoption request is pending approval. We will notify you once it's approved.</span>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Link to="/user/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
              <Link to="/" className="btn btn-ghost">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

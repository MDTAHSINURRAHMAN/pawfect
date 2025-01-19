import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Elements } from "@stripe/react-stripe-js";
import Navbar from "../../../components/shared/Navbar";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const Payment = () => {
  const [clientSecret, setClientSecret] = useState("");
  const { id } = useParams();

  const { data: pet } = useQuery({
    queryKey: ["payment", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/user/payment/${id}`);
      return res.data;
    },
  });

  //   console.log(id);

  // Then create payment intent once we have pet data
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/create-payment-intent",
          {
            price: pet?.adoptionFee,
          }
        );
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    if (pet?.adoptionFee) {
      createPaymentIntent();
    }
  }, [pet]);

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#FF6B6B",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (!pet) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          Complete Your Payment
        </h2>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Payment Details</h3>
            <p className="text-gray-600">Pet Name: {pet.name}</p>
            <p className="text-gray-600">Amount: ${pet.adoptionFee}</p>
          </div>

          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm clientSecret={clientSecret} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;

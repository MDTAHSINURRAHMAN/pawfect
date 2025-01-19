import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";

const CheckoutForm = ({ clientSecret }) => {
  const { user } = useContext(AuthContext);
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    optionalAddress: "",
    postCode: "",
    country: "",
    state: ""
  });

  const { data: pet } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/user/payment/${id}`);
      return res.data;
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: formData.name || "anonymous",
              email: user?.email || "anonymous@gmail.com", 
              phone: formData.phone,
              address: {
                line1: formData.address,
                line2: formData.optionalAddress,
                postal_code: formData.postCode,
                country: formData.country,
                state: formData.state
              }
            },
          },
        }
      );

      if (error) {
        setError(error.message);
        setProcessing(false);
      } else {
        // Save payment data to MongoDB
        await axios.post("http://localhost:3000/confirm-payment", {
          payment_method_id: paymentIntent.payment_method,
          transactionId: paymentIntent.id,
          petId: id,
          pet: pet,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          paymentStatus: paymentIntent.status,
          customerEmail: user?.email,
          customerName: formData.name,
          shippingDetails: formData,
          paymentDate: new Date(),
          paymentMethod: "card",
          approvalStatus: "pending"
        });

        setProcessing(false);
        navigate("/user/payment/success");
      }
    } catch (err) {
      console.error(err);
      setError("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input 
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input 
            type="email"
            value={user?.email || ""}
            className="input input-bordered"
            readOnly
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone Number</span>
          </label>
          <input 
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Address</span>
          </label>
          <input 
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Optional Address</span>
          </label>
          <input 
            type="text"
            name="optionalAddress"
            value={formData.optionalAddress}
            onChange={handleChange}
            className="input input-bordered"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Post Code</span>
          </label>
          <input 
            type="text"
            name="postCode"
            value={formData.postCode}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Country</span>
          </label>
          <input 
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">State</span>
          </label>
          <input 
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>
      </div>

      <div className="w-full mt-6">
        <label className="label">
          <span className="label-text">Card Details</span>
        </label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
          className="p-3 border rounded-md"
        />
      </div>

      {error && <div className="text-error text-sm">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`btn btn-primary w-full ${processing ? "loading" : ""}`}
      >
        {processing ? "Processing..." : `Pay $${pet?.adoptionFee || 0}`}
      </button>
    </form>
  );
};

export default CheckoutForm;

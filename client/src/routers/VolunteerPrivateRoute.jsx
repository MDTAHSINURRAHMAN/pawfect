import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const VolunteerPrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  const { data: volunteerData, isLoading: volunteerLoading } = useQuery({
    queryKey: ["volunteer", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/volunteers/${user.email}`);
      return res.data;
    }
  });

  if (loading || volunteerLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user || !volunteerData?.status === "approved") {
    return <Navigate to="/volunteer/login" state={{ from: location }} replace />;
  }

  return children;
};

export default VolunteerPrivateRoute;

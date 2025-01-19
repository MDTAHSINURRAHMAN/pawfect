import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import VolunteerLogin from "../pages/volunteer/VolunteerLogin";
import VolunteerRegister from "../pages/volunteer/VolunterRegister";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../layouts/AdminDashboard";
import AllUsers from "../pages/admin/AllUsers";
import UserDetails from "../pages/admin/UserDetails";
import AllVolunteers from "../pages/admin/AllVolunteers";
import VolunteerDetails from "../pages/admin/VolunteerDetails";
import PendingVolunteerDetails from "../pages/admin/PendingVolunteerDetails";
import VolunteerDashboard from "../layouts/VolunteerDashboard";
import VolunteerAllUsers from "../pages/volunteer/VolunteerAllUsers";
import AllPets from "../pages/admin/AllPets";
import AddPet from "../pages/admin/AddPet";
import PetDetails from "../pages/admin/PetDetails";
import VolunteerAllPets from "../pages/volunteer/VolunteerAllPets";
import VolunteerAddPet from "../pages/volunteer/VolunteerAddPet";
import PendingPetDetails from "../pages/admin/PendingPetDetails";
import Adopt from "../pages/user/Adopt";
import AdoptNow from "../pages/user/AdoptNow";
import UserDashboard from "../layouts/UserDashboard";
import AllBookmarks from "../pages/user/AllBookmarks";
import Payment from "../pages/user/payment/Payment";
import PaymentSuccess from "../pages/user/payment/PaymentSuccess";
import AdoptionRequest from "../pages/user/AdoptionRequest";
import AllAdoptionRequest from "../pages/admin/AllAdoptionRequest";
import AllAdoptedPets from "../pages/admin/AllAdoptedPets";
import UserPrivateRoute from "./UserPrivateRoute";
import AdminPrivateRoute from "./AdminPrivateRoute";
import VolunteerPrivateRoute from "./VolunteerPrivateRoute";
import Error from "../components/shared/Error";
import Rescue from "../pages/Rescue";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: "/adopt",
    element: <Adopt></Adopt>,
  },
  {
    path: "/adopt/:id",
    element: (
      <UserPrivateRoute>
        <AdoptNow></AdoptNow>
      </UserPrivateRoute>
    ),
  },
  {
    path: "/rescue",
    element: <Rescue></Rescue>,
  },
  {
    path: "/user/dashboard",
    element: (
      <UserPrivateRoute>
        <UserDashboard></UserDashboard>
      </UserPrivateRoute>
    ),
    children: [
      {
        path: "bookmarks",
        element: <AllBookmarks></AllBookmarks>,
      },
      {
        path: "adoption-request",
        element: <AdoptionRequest></AdoptionRequest>,
      },
    ],
  },
  {
    path: "/user/payment/:id",
    element: (
      <UserPrivateRoute>
        <Payment></Payment>
      </UserPrivateRoute>
    ),
  },
  {
    path: "/user/payment/success",
    element: (
      <UserPrivateRoute>
        <PaymentSuccess></PaymentSuccess>
      </UserPrivateRoute>
    ),
  },
  {
    path: "/auth/login",
    element: <Login></Login>,
  },
  {
    path: "/auth/register",
    element: <Register></Register>,
  },

  {
    path: "/volunteer/login",
    element: <VolunteerLogin></VolunteerLogin>,
  },
  {
    path: "/volunteer/register",
    element: <VolunteerRegister></VolunteerRegister>,
  },
  {
    path: "/admin/login",
    element: <AdminLogin></AdminLogin>,
  },
  {
    path: "/admin/dashboard",
    element: (
      <AdminPrivateRoute>
        <AdminDashboard></AdminDashboard>
      </AdminPrivateRoute>
    ),
    children: [
      {
        path: "users",
        element: <AllUsers></AllUsers>,
      },
      {
        path: "users/:email",
        element: <UserDetails></UserDetails>,
      },
      {
        path: "volunteers",
        element: <AllVolunteers></AllVolunteers>,
      },
      {
        path: "volunteers/:email",
        element: <VolunteerDetails></VolunteerDetails>,
      },
      {
        path: "volunteers/pending/:email",
        element: <PendingVolunteerDetails></PendingVolunteerDetails>,
      },
      {
        path: "pets",
        element: <AllPets></AllPets>,
      },
      {
        path: "pets/add",
        element: <AddPet></AddPet>,
      },
      {
        path: "pets/:id",
        element: <PetDetails></PetDetails>,
      },
      {
        path: "pets/pending/:id",
        element: <PendingPetDetails></PendingPetDetails>,
      },
      {
        path: "adoption-requests",
        element: <AllAdoptionRequest></AllAdoptionRequest>,
      },
      {
        path: "adopted-pets",
        element: <AllAdoptedPets></AllAdoptedPets>,
      },
    ],
  },
  {
    path: "/volunteer/dashboard",
    element: (
      <VolunteerPrivateRoute>
        <VolunteerDashboard></VolunteerDashboard>
      </VolunteerPrivateRoute>
    ),
    children: [
      {
        path: "users",
        element: <VolunteerAllUsers></VolunteerAllUsers>,
      },
      {
        path: "pets",
        element: <VolunteerAllPets></VolunteerAllPets>,
      },
      {
        path: "pets/add",
        element: <VolunteerAddPet></VolunteerAddPet>,
      },
    ],
  },
  {
    path: "*",
    element: <Error></Error>,
  },
]);

export default router;

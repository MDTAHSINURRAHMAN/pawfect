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
    element: <AdoptNow></AdoptNow>,
  },
  {
    path: "/user/dashboard",
    element: <UserDashboard></UserDashboard>,
    children: [
      {
        path: "bookmarks",
        element: <AllBookmarks></AllBookmarks>,
      },
    ],
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
    element: <AdminDashboard></AdminDashboard>,
    children: [
      {
        path: "users", // Changed from absolute path to relative path
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
    ],
  },
  {
    path: "/volunteer/dashboard",
    element: <VolunteerDashboard></VolunteerDashboard>,
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
]);

export default router;

import { Link, Outlet } from "react-router-dom";
import { MdDashboard, MdPets } from "react-icons/md";
import { FaHandHoldingHeart, FaPaw, FaUsers } from "react-icons/fa";

const VolunteerDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="drawer lg:drawer-open">
        <input id="volunteer-drawer" type="checkbox" className="drawer-toggle" />
        
        <div className="drawer-content p-8">
          {/* Page content */}
          <label htmlFor="volunteer-drawer" className="btn btn-primary drawer-button lg:hidden mb-4">
            Open Menu
          </label>
          <div className="bg-white rounded-lg min-h-[calc(100vh-4rem)] p-6">
            <Outlet />
          </div>
        </div>

        <div className="drawer-side">
          <label htmlFor="volunteer-drawer" className="drawer-overlay"></label>
          <div className="menu p-4 w-80 min-h-full bg-white text-base-content">
            {/* Sidebar content */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-center text-primary mb-2">Volunteer Dashboard</h2>
              <p className="text-center text-gray-600">Help pets find their forever homes</p>
            </div>

            <ul className="space-y-2">
              <li>
                <Link to="/volunteer/dashboard" className="flex items-center p-3 text-gray-700 hover:bg-primary hover:text-white rounded-lg">
                  <MdDashboard className="w-5 h-5 mr-2" />
                  Dashboard Overview
                </Link>
              </li>
              <li>
                <Link to="/volunteer/dashboard/users" className="flex items-center p-3 text-gray-700 hover:bg-primary hover:text-white rounded-lg">
                  <FaUsers className="w-5 h-5 mr-2" />
                  Manage Users
                </Link>
              </li>
              <li>
                <Link to="/volunteer/dashboard/pets" className="flex items-center p-3 text-gray-700 hover:bg-primary hover:text-white rounded-lg">
                  <MdPets className="w-5 h-5 mr-2" />
                  Available Pets
                </Link>
              </li>
              <li>
                <Link to="/volunteer/dashboard/adoptions" className="flex items-center p-3 text-gray-700 hover:bg-primary hover:text-white rounded-lg">
                  <FaPaw className="w-5 h-5 mr-2" />
                  Adoption Requests
                </Link>
              </li>
              <li>
                <Link to="/volunteer/dashboard/activities" className="flex items-center p-3 text-gray-700 hover:bg-primary hover:text-white rounded-lg">
                  <FaHandHoldingHeart className="w-5 h-5 mr-2" />
                  My Activities
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;

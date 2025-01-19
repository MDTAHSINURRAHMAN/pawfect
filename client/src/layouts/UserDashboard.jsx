import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaHome, FaPaw, FaBookmark } from "react-icons/fa";

const UserDashboard = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-8">
        {/* Page content here */}
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden mb-4"
        >
          Open Menu
        </label>
        <Outlet></Outlet>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 h-full bg-base-200 text-base-content space-y-2">
          {/* Sidebar content here */}
          <li className="mb-4">
            <Link to="/" className="text-xl font-bold text-primary">
              <FaHome />
              Back to Home
            </Link>
          </li>
          <div className="divider"></div>
          <li>
            <Link to="/user/dashboard/adoption-request">
              <FaPaw />
              My Adoption Requests
            </Link>
          </li>
          <li>
            <Link to="/user/dashboard/bookmarks">
              <FaBookmark />
              Bookmarked Pets
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;


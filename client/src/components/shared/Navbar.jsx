import { useContext } from "react";
import { FaRegUser, FaUser, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import Logo from "./logo";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const links = [
    {
      key: 1,
      label: "Home",
      to: "/",
      isPublic: true,
    },
    {
      key: 2,
      label: "Adopt",
      to: "/adopt",
      isPublic: true,
    },
    {
      key: 3,
      label: "Rescue",
      to: "/rescue",
      isPublic: true,
    },
    {
      key: 4,
      label: "Donate",
      to: "/donate",
      isPublic: true,
    },
    {
      key: 5,
      label: "Contact Us",
      to: "/contact",
      isPublic: true,
    },
    {
      key: 6,
      label: "Be Our Volunteer",
      to: "/volunteer/login",
      isPublic: true,
    },
    {
      key: 7,
      label: "Dashboard",
      to: "/user/dashboard",
      isPublic: false,
    },
  ];

  // Filter links based on user authentication
  const filteredLinks = links.filter((link) => link.isPublic || user);
  return (
    <div>
      <Logo></Logo>
      <div className="w-11/12 mx-auto navbar font-lato">
        <div className="navbar-start">
          <div className="dropdown relative">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[9999] absolute left-0 top-full w-56 p-0 shadow"
            >
              {filteredLinks.map((link) => (
                <li key={link.key}>
                  <NavLink
                    className={({ isActive }) =>
                      `tracking-widest text-md font-medium font-poppins ${
                        isActive
                          ? "text-hover-color"
                          : "text-black hover:text-hover-color"
                      }`
                    }
                    to={link.to}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <Link
            to="/"
            className="text-xl md:text-2xl lg:text-4xl font-extrabold text-navColor tracking-widest leading-tight"
          ></Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-5">
            {filteredLinks.map((link) => (
              <li key={link.key}>
                <NavLink
                  className={({ isActive }) =>
                    `tracking-widest text-md font-medium font-poppins ${
                      isActive
                        ? "text-hover-color"
                        : "text-black hover:text-hover-color"
                    }`
                  }
                  to={link.to}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end">
          {user && user?.email ? (
            <div className="flex gap-3 items-center">
              <div className="relative group w-8 md:w-10 h-8 md:h-10"></div>

              {/* Logout Button */}
              <div
                onClick={logOut}
                className="flex items-center gap-2 font-lato tracking-widest px-2 md:px-3 py-2 bg-primary hover:bg-primary/80 text-white font-medium rounded-md cursor-pointer"
              >
                <FaSignOutAlt />
                Logout
              </div>
            </div>
          ) : (
            <div className="flex gap-3 items-center">
              <Link
                to="/auth/login"
                className="flex items-center gap-2 font-lato px-3 py-2 bg-primary hover:bg-primary/80 text-white font-medium rounded-md cursor-pointer"
              >
                <FaRegUser />
                <h2>Login</h2>
              </Link>
              <Link
                to="/auth/register"
                className="flex items-center gap-2 font-lato px-3 py-2 bg-primary hover:bg-primary/80 text-white font-medium rounded-md cursor-pointer"
              >
                <FaUserPlus />
                <h2>Register</h2>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

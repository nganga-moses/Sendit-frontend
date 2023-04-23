import { useEffect, useState } from "react";
import { FaTruck } from "react-icons/fa";
import { BiUserCircle } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../slices/loggedInUserSlice";
import Swal from "sweetalert2";

const Nav = () => {
  const { user } = useSelector((state) => state.loggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [state, setState] = useState(false);
  const [nav, setNav] = useState(false);
  const handleClick = () => setNav(!nav);

  function logout() {
    if (user.id) {
      fetch("/logout", {
        method: "delete",
      }).then((res) => {
        if (res.status === 204) {
          dispatch(logoutUser());
          setTimeout(() => navigate("/"), 1000);
        }
      });
    }
  }

  function orders() {
    if (user.id) {
      if (user.user_type === "Customer") {
        navigate("/orders");
      } else {
        navigate("/all-orders");
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "You have to be logged in to see your orders",
        timer: 1500,
      });
      setTimeout(() => navigate("/login"), 1500);
    }
  }

  useEffect(() => {
    document.onclick = (e) => {
      const target = e.target;
      if (!target.closest(".menu-btn")) setState(false);
      if (!target.closest(".profile-btn")) setNav(false);
    };
  }, []);

  return (
    <nav
      className={`bg-white pb-0 md:text-sm ${
        state
          ? "shadow-lg rounded-xl border mx-0 mt-2 md:shadow-none md:border-none md:mx-2 md:mt-0"
          : ""
      }`}
    >
      <div className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8">
        <div className="flex items-center justify-between py-5 md:block">
          <Link to="/" className="flex gap-2 items-center">
            <span className="text-3xl text-indigo-500">
              <FaTruck />
            </span>
            <h1 className="text-indigo-500 font-mono font-bold text-xl">
              SENDIT
            </h1>
          </Link>

          {/* Dropdown */}
          <div className="relative inline-block m-2 text-left md:hidden">
            <div onClick={handleClick}>
              <button
                type="button"
                className="profile-btn inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-slate-900 hover:text-white"
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true"
              >
                <BiUserCircle size={20} />
                <h1>{user.username}</h1>
                <svg
                  className="-mr-1 h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div
              className={
                !nav
                  ? "hidden"
                  : "absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              }
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabindex="-1"
            >
              <div className="py-1" role="none">
                {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
                <Link
                  to="/"
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-0"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-1"
                >
                  About
                </Link>
                <Link
                  to="/contact-us"
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-2"
                >
                  Contact Us
                </Link>
                {user.id && (
                  <button
                    className="text-gray-700 block w-full px-4 py-2 text-left text-sm border-none hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                    tabindex="-1"
                    id="menu-item-3"
                    onClick={logout}
                  >
                    Log out
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation bar */}
        <div
          className={`flex-1 items-center mt-8 md:mt-0 md:flex ${
            state ? "block" : "hidden"
          } `}
        >
          {/* Links */}
          <ul className="justify-center text-xl items-center space-y-6 md:flex md:space-x-6 md:space-y-0 sm:hidden">
            <Link to="/about" className="text-gray-900 hover:text-gray-300">
              About
            </Link>
            <Link
              to="/contact-us"
              className="text-gray-900 hover:text-gray-300"
            >
              Contact Us
            </Link>

            {/* When User Logs in */}

            {user.id && (
              <button onClick={orders} className="text-black">
                {user.user_type === "Customer" ? "Your Orders" : "All Orders"}
              </button>
            )}
          </ul>

          <div className="flex-1 gap-x-6 items-center justify-end mt-6 space-y-6 md:flex md:space-y-0 md:mt-0">
            {!user.id && (
              <Link to="/login" className="text-black">
                Log in
              </Link>
            )}

            {!user.id && (
              <Link
                to="/sign-up"
                className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex"
              >
                Sign in
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            )}
          </div>
          {/* Dropdown */}
          <div className="relative inline-block m-2 text-left">
            <div onClick={handleClick}>
              <button
                type="button"
                className="profile-btn inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-slate-900 hover:text-white"
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true"
              >
                <BiUserCircle size={20} />
                <h1>{user.username}</h1>
                <svg
                  className="-mr-1 h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div
              className={
                !nav
                  ? "hidden"
                  : "absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              }
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
              tabindex="-1"
            >
              <div className="py-1" role="none">
                {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
                <h1 className="text-gray-700 first-letter:block px-4 py-2 text-sm font-medium">{user.email}</h1>
                <Link
                  to="/"
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-0"
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-1"
                >
                  About
                </Link>

                <Link
                  to="/contact-us"
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  role="menuitem"
                  tabindex="-1"
                  id="menu-item-2"
                >
                  Contact Us
                </Link>
                {user.id && (
                  <button
                    className="text-gray-700 block w-full px-4 py-2 text-left text-sm border-none hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    role="menuitem"
                    tabindex="-1"
                    id="menu-item-3"
                    onClick={logout}
                  >
                    Log out
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;

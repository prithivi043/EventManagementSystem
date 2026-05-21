import {
  FaHome,
  FaCalendarAlt,
  FaClipboardList,
  FaUsers,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell,
} from "react-icons/fa";

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useState } from "react";

import { motion } from "framer-motion";

const Sidebar = ({
  activeSection,
  setActiveSection,
}) => {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [open, setOpen] =
    useState(false);

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const role =
    user?.role;

  // LOGOUT

  const handleLogout = () => {

    localStorage.removeItem(
      "user"
    );

    navigate("/login");
  };

  // ADMIN MENUS

  const adminMenus = [

    {
      name: "Dashboard",
      section: "dashboard",
      icon: <FaHome />,
    },

    {
      name: "Event Management",
      section: "events",
      icon: <FaCalendarAlt />,
    },

    {
      name: "Registrations",
      section: "registrations",
      icon: <FaClipboardList />,
    },

    {
      name: "User Management",
      section: "users",
      icon: <FaUsers />,
    },

    {
      name: "Settings",
      section: "settings",
      icon: <FaCog />,
    },
  ];

  // STUDENT MENUS

  const studentMenus = [

    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },

    {
      name: "My Registrations",
      path: "/my-registrations",
      icon: <FaClipboardList />,
    },

    {
      name: "Profile",
      path: "/profile",
      icon: <FaUserCircle />,
    },
  ];

  return (

    <>

      {/* MOBILE TOPBAR */}

      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-950 border-b border-slate-800 px-5 py-4 flex items-center justify-between">

        <h1 className="text-2xl font-bold text-white">

          Event System

        </h1>

        <button
          onClick={() =>
            setOpen(!open)
          }

          className="text-white text-2xl"
        >

          {open
            ? <FaTimes />
            : <FaBars />}

        </button>

      </div>

      {/* OVERLAY */}

      {open && (

        <div
          onClick={() =>
            setOpen(false)
          }

          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />

      )}

      {/* SIDEBAR */}

      <motion.div

        initial={{
          x: -100,
        }}

        animate={{
          x: 0,
        }}

        className={`
          fixed lg:static top-0 left-0 z-50
          w-72 h-screen
          bg-slate-950 border-r border-slate-800
          flex flex-col
          overflow-hidden
          transition-all duration-300

          ${open
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"}
        `}
      >

        {/* SCROLLABLE CONTENT */}

        <div className="flex-1 overflow-y-auto p-6">

          {/* HEADER */}

          <div className="flex items-center justify-between mb-10 mt-10 lg:mt-0">

            <div>

              <h1 className="text-3xl font-bold text-white">

                Event System

              </h1>

              <p className="text-gray-400 mt-2">

                {role === "admin"
                  ? "Admin Panel"
                  : "Student Panel"}

              </p>

            </div>

            <button
              onClick={() =>
                setOpen(false)
              }

              className="lg:hidden text-white text-2xl"
            >

              <FaTimes />

            </button>

          </div>

          {/* USER CARD */}

          <motion.div

            whileHover={{
              scale: 1.02,
            }}

            className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-5 rounded-3xl mb-10 shadow-2xl"
          >

            <div className="flex items-center gap-4">

              {/* IMAGE */}

              <img
                src={
                  user?.profile_image ||

                  "https://i.pravatar.cc/300"
                }

                alt="profile"

                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
              />

              {/* INFO */}

              <div className="flex-1 min-w-0">

                <h2 className="text-white text-lg font-bold truncate">

                  {user?.name}

                </h2>

                <p className="text-gray-400 text-sm truncate">

                  {user?.email}

                </p>

              </div>

              {/* BELL */}

              <button className="bg-slate-700 hover:bg-blue-600 min-w-[40px] h-10 rounded-full flex items-center justify-center transition">

                <FaBell />

              </button>

            </div>

            {/* ROLE */}

            <div className="mt-5">

              <span className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm capitalize">

                {role}

              </span>

            </div>

          </motion.div>

          {/* MENUS */}

          <div className="space-y-3">

            {/* ADMIN MENUS */}

            {role === "admin" &&

              adminMenus.map(
                (menu, index) => (

                  <button
                    key={index}

                    onClick={() => {

                      setActiveSection(
                        menu.section
                      );

                      setOpen(false);
                    }}

                    className={`
                      w-full flex items-center gap-4
                      px-5 py-4 rounded-2xl
                      transition-all duration-300

                      ${activeSection === menu.section

                        ? "bg-blue-600 text-white shadow-lg"

                        : "bg-slate-900 hover:bg-slate-800 text-gray-300"}
                    `}
                  >

                    <span className="text-xl">

                      {menu.icon}

                    </span>

                    <span className="text-lg font-medium">

                      {menu.name}

                    </span>

                  </button>

                )
              )
            }

            {/* STUDENT MENUS */}

            {role !== "admin" &&

              studentMenus.map(
                (menu, index) => {

                  const active =
                    location.pathname ===
                    menu.path;

                  return (

                    <Link
                      key={index}

                      to={menu.path}

                      onClick={() =>
                        setOpen(false)
                      }

                      className={`
                        flex items-center gap-4
                        px-5 py-4 rounded-2xl
                        transition-all duration-300

                        ${active

                          ? "bg-blue-600 text-white shadow-lg"

                          : "bg-slate-900 hover:bg-slate-800 text-gray-300"}
                      `}
                    >

                      <span className="text-xl">

                        {menu.icon}

                      </span>

                      <span className="text-lg font-medium">

                        {menu.name}

                      </span>

                    </Link>

                  );
                }
              )
            }

          </div>

        </div>

        {/* LOGOUT FIXED */}

        <div className="p-6 border-t border-slate-800 bg-slate-950">

          <button
            onClick={handleLogout}

            className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl transition-all duration-300 shadow-lg"
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </motion.div>

    </>

  );
};

export default Sidebar;
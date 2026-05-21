import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {

  const { user, logout } =
    useContext(AuthContext);

  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-900 border-b border-slate-800 z-50">

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        <Link
          to="/"
          className="text-2xl font-bold text-blue-500"
        >
          EMS
        </Link>

        <div className="flex gap-6 items-center">

          <Link to="/">Home</Link>

          <Link to="/events">
            Events
          </Link>

          {!user ? (
            <>
              <Link to="/login">
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 px-4 py-2 rounded-lg"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard">
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="bg-red-600 px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>
    </nav>
  );
};

export default Navbar;
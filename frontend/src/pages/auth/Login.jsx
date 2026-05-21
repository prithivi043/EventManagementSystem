import { useState, useContext } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import { AuthContext } from "../../context/AuthContext";

import { supabase } from "../../services/supabase";

const Login = () => {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const { login } =
    useContext(AuthContext);

  const navigate =
    useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !email ||
      !password
    ) {

      toast.error(
        "All fields are required"
      );

      return;
    }

    try {

      setLoading(true);

      // LOGIN USER

      const {
        data,
        error,
      } = await login(
        email,
        password
      );

      if (error) {

        toast.error(
          error.message
        );

        return;
      }

      // FETCH USER ROLE

      const {
        data: userData,
        error: fetchError,
      } = await supabase
        .from("users")
        .select("*")
        .eq(
          "id",
          data.user.id
        )
        .single();

      if (fetchError) {

        toast.error(
          fetchError.message
        );

        return;
      }

      // STORE USER

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      toast.success(
        "Login Successful"
      );

      // ROLE BASED NAVIGATION

      if (
        userData.role === "admin"
      ) {

        navigate("/admin");

      } else {

        navigate("/dashboard");
      }

    } catch (err) {

      console.log(err);

      toast.error(
        "Login Failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-3xl w-full max-w-md shadow-2xl"
      >

        <h1 className="text-4xl font-bold text-white text-center mb-8">

          Login

        </h1>

        {/* EMAIL */}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-4 rounded-xl bg-slate-800 text-white mb-5 outline-none"
        />

        {/* PASSWORD */}

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-4 rounded-xl bg-slate-800 text-white mb-6 outline-none"
        />

        {/* BUTTON */}

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl"
        >

          {loading
            ? "Logging in..."
            : "Login"}

        </button>

        <p className="text-gray-400 mt-6 text-center">

          Don't have an account?

          <Link
            to="/register"
            className="text-blue-400 ml-2"
          >
            Register
          </Link>

        </p>

      </form>

    </div>
  );
};

export default Login;
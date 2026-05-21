import { useState, useContext } from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import toast from "react-hot-toast";

import { AuthContext } from "../../context/AuthContext";

import { supabase } from "../../services/supabase";

const Register = () => {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("student");

  const [loading, setLoading] =
    useState(false);

  const { signup } =
    useContext(AuthContext);

  const navigate =
    useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !name ||
      !email ||
      !password
    ) {

      toast.error(
        "All fields are required"
      );

      return;
    }

    if (password.length < 6) {

      toast.error(
        "Password must be at least 6 characters"
      );

      return;
    }

    try {

      setLoading(true);

      // SUPABASE AUTH SIGNUP

      const {
        data,
        error,
      } = await signup(
        email,
        password
      );

      if (error) {

        toast.error(
          error.message
        );

        return;
      }

      // INSERT USER INTO DATABASE TABLE

      const {
        error: insertError,
      } = await supabase
        .from("users")
        .insert([
          {
            id: data.user.id,
            name,
            email,
            role,
          },
        ]);

      if (insertError) {

        toast.error(
          insertError.message
        );

        return;
      }

      // SAVE USER LOCALLY

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          name,
          email,
          role,
        })
      );

      toast.success(
        "Registration Successful"
      );

      navigate("/login");

    } catch (err) {

      console.log(err);

      toast.error(
        "Registration Failed"
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

          Register

        </h1>

        {/* NAME */}

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full p-4 rounded-xl bg-slate-800 text-white mb-5 outline-none"
        />

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
          className="w-full p-4 rounded-xl bg-slate-800 text-white mb-5 outline-none"
        />

        {/* ROLE */}

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          className="w-full p-4 rounded-xl bg-slate-800 text-white mb-6 outline-none"
        >

          <option value="student">
            Student
          </option>

          <option value="admin">
            Admin
          </option>

        </select>

        {/* BUTTON */}

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl"
        >

          {loading
            ? "Registering..."
            : "Register"}

        </button>

        <p className="text-gray-400 mt-6 text-center">

          Already have an account?

          <Link
            to="/login"
            className="text-blue-400 ml-2"
          >
            Login
          </Link>

        </p>

      </form>

    </div>
  );
};

export default Register;
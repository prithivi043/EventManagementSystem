import { useEffect, useState } from "react";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
} from "react-icons/fa";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

import { useParams } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import { supabase } from "../../services/supabase";

const EventDetails = () => {

  const { id } =
    useParams();

  const [event, setEvent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  useEffect(() => {

    fetchEvent();

  }, []);

  // FETCH EVENT

  const fetchEvent =
    async () => {

      const {
        data,
        error,
      } = await supabase

        .from("events")

        .select("*")

        .eq("id", id)

        .single();

      if (!error) {

        setEvent(data);
      }

      setLoading(false);
    };

  // REGISTER EVENT

  const registerEvent =
    async () => {

      if (!user) {

        toast.error(
          "Please Login First"
        );

        return;
      }

      // CHECK EXISTING

      const {
        data: existing,
      } = await supabase

        .from("registrations")

        .select("*")

        .eq(
          "user_id",
          user.id
        )

        .eq(
          "event_id",
          event.id
        );

      if (
        existing.length > 0
      ) {

        toast.error(
          "Already Registered"
        );

        return;
      }

      // INSERT

      const { error } =
        await supabase

          .from("registrations")

          .insert([
            {
              user_id: user.id,
              event_id: event.id,
            },
          ]);

      if (error) {

        toast.error(
          error.message
        );

      } else {

        toast.success(
          "Registered Successfully"
        );

        // UPDATE SEATS

        await supabase

          .from("events")

          .update({
            available_seats:
              event.available_seats -
              1,
          })

          .eq(
            "id",
            event.id
          );

        fetchEvent();
      }
    };

  // LOADING

  if (loading) {

    return (

      <MainLayout>

        <div className="min-h-screen bg-slate-950 p-10">

          <div className="max-w-6xl mx-auto h-[700px] bg-slate-900 rounded-3xl animate-pulse" />

        </div>

      </MainLayout>
    );
  }

  return (

    <MainLayout>

      <div className="min-h-screen bg-slate-950 text-white py-16">

        <div className="max-w-6xl mx-auto px-4">

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl"
          >

            {/* IMAGE */}

            <img
              src={event.image_url}

              alt={event.title}

              className="w-full h-[450px] object-cover"
            />

            {/* CONTENT */}

            <div className="p-10">

              {/* TOP */}

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div>

                  <span className="bg-blue-600/20 text-blue-400 px-5 py-2 rounded-full text-sm">

                    {event.category}

                  </span>

                  <h1 className="text-6xl font-bold mt-6">

                    {event.title}

                  </h1>

                </div>

                <button
                  onClick={
                    registerEvent
                  }

                  className="bg-blue-600 hover:bg-blue-700 px-10 py-5 rounded-2xl text-lg font-semibold transition"
                >

                  Register Now

                </button>

              </div>

              {/* DESCRIPTION */}

              <p className="mt-10 text-gray-400 text-xl leading-relaxed">

                {event.description}

              </p>

              {/* DETAILS */}

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-14">

                <div className="bg-slate-800 p-6 rounded-3xl">

                  <FaCalendarAlt
                    size={28}
                    className="text-blue-400"
                  />

                  <h3 className="mt-5 text-gray-400">

                    Date

                  </h3>

                  <p className="text-2xl font-bold mt-2">

                    {event.date}

                  </p>

                </div>

                <div className="bg-slate-800 p-6 rounded-3xl">

                  <FaClock
                    size={28}
                    className="text-green-400"
                  />

                  <h3 className="mt-5 text-gray-400">

                    Time

                  </h3>

                  <p className="text-2xl font-bold mt-2">

                    {event.time}

                  </p>

                </div>

                <div className="bg-slate-800 p-6 rounded-3xl">

                  <FaMapMarkerAlt
                    size={28}
                    className="text-pink-400"
                  />

                  <h3 className="mt-5 text-gray-400">

                    Venue

                  </h3>

                  <p className="text-2xl font-bold mt-2">

                    {event.venue}

                  </p>

                </div>

                <div className="bg-slate-800 p-6 rounded-3xl">

                  <FaUsers
                    size={28}
                    className="text-yellow-400"
                  />

                  <h3 className="mt-5 text-gray-400">

                    Available Seats

                  </h3>

                  <p className="text-2xl font-bold mt-2">

                    {
                      event.available_seats
                    }

                  </p>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>

    </MainLayout>
  );
};

export default EventDetails;
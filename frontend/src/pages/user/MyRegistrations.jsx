import { useEffect, useState } from "react";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTrash,
} from "react-icons/fa";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";

import { supabase } from "../../services/supabase";

const MyRegistrations = () => {

  const [registrations,
    setRegistrations] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  useEffect(() => {

    if (user?.id) {

      fetchRegistrations();

      // REALTIME SUBSCRIPTION

      const channel =
        supabase
          .channel(
            "registration-realtime"
          )

          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table:
                "registrations",
            },

            () => {

              fetchRegistrations();
            }
          )

          .subscribe();

      return () => {

        supabase.removeChannel(
          channel
        );
      };
    }

  }, []);

  // FETCH USER REGISTRATIONS

  const fetchRegistrations =
    async () => {

      setLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from("registrations")

        .select(`
          id,
          registered_at,

          events (
            id,
            title,
            date,
            venue,
            image_url,
            category
          )
        `)

        .eq(
          "user_id",
          user.id
        )

        .order(
          "registered_at",
          {
            ascending: false,
          }
        );

      if (!error) {

        setRegistrations(data);
      }

      setLoading(false);
    };

  // CANCEL REGISTRATION

  const cancelRegistration =
    async (id) => {

      const { error } =
        await supabase
          .from("registrations")
          .delete()
          .eq("id", id);

      if (!error) {

        toast.success(
          "Registration Cancelled"
        );

        fetchRegistrations();
      }
    };

  return (

    <DashboardLayout>

      <div className="text-white">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold">

            My Registrations

          </h1>

          <p className="text-gray-400 mt-3">

            View and manage your registered events

          </p>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {[1, 2, 3].map(
              (item) => (

                <div
                  key={item}
                  className="bg-slate-900 h-[350px] rounded-3xl animate-pulse"
                />
              )
            )}

          </div>

        ) : registrations.length === 0 ? (

          <div className="bg-slate-900 rounded-3xl p-16 text-center">

            <h2 className="text-4xl font-bold">

              No Registrations Yet

            </h2>

            <p className="text-gray-400 mt-4">

              Register for events to see them here

            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {registrations.map(
              (registration) => {

                const event =
                  registration.events;

                return (

                  <motion.div
                    key={
                      registration.id
                    }

                    whileHover={{
                      y: -8,
                    }}

                    className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl"
                  >

                    {/* EVENT IMAGE */}

                    <img
                      src={
                        event
                          ?.image_url ||
                        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop"
                      }

                      alt={
                        event?.title
                      }

                      className="w-full h-56 object-cover"
                    />

                    {/* CONTENT */}

                    <div className="p-6">

                      {/* CATEGORY */}

                      <div className="flex items-center justify-between">

                        <span className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm">

                          {
                            event?.category
                          }

                        </span>

                        <span className="text-green-400 font-medium">

                          Registered

                        </span>

                      </div>

                      {/* TITLE */}

                      <h2 className="text-3xl font-bold mt-5">

                        {event?.title}

                      </h2>

                      {/* DETAILS */}

                      <div className="mt-6 space-y-4 text-gray-300">

                        <div className="flex items-center gap-3">

                          <FaCalendarAlt />

                          <span>

                            {
                              event?.date
                            }

                          </span>

                        </div>

                        <div className="flex items-center gap-3">

                          <FaMapMarkerAlt />

                          <span>

                            {
                              event?.venue
                            }

                          </span>

                        </div>

                      </div>

                      {/* REGISTERED DATE */}

                      <div className="mt-6 text-gray-400 text-sm">

                        Registered On:

                        {" "}

                        {new Date(
                          registration.registered_at
                        ).toLocaleDateString()}

                      </div>

                      {/* BUTTON */}

                      <button
                        onClick={() =>
                          cancelRegistration(
                            registration.id
                          )
                        }

                        className="w-full mt-8 bg-red-600 hover:bg-red-700 py-4 rounded-2xl flex items-center justify-center gap-3 transition"
                      >

                        <FaTrash />

                        Cancel Registration

                      </button>

                    </div>

                  </motion.div>

                );
              }
            )}

          </div>

        )}

      </div>

    </DashboardLayout>
  );
};

export default MyRegistrations;
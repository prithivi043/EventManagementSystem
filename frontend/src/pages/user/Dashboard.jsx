import { useEffect, useState } from "react";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

import {
  useNavigate,
} from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import { supabase } from "../../services/supabase";

const Dashboard = () => {

  const [events, setEvents] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [registeredEvents,
    setRegisteredEvents] =
    useState([]);

  const navigate =
    useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  useEffect(() => {

    fetchEvents();

    if (user?.id) {

      fetchRegistrations();
    }

    // REALTIME EVENTS

    const eventChannel =
      supabase

        .channel(
          "events-channel"
        )

        .on(
          "postgres_changes",

          {
            event: "*",
            schema: "public",
            table: "events",
          },

          () => {

            fetchEvents();
          }
        )

        .subscribe();

    // REALTIME REGISTRATIONS

    const registrationChannel =
      supabase

        .channel(
          "registration-channel"
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
        eventChannel
      );

      supabase.removeChannel(
        registrationChannel
      );
    };

  }, []);

  // FETCH EVENTS

  const fetchEvents =
    async () => {

      setLoading(true);

      const {
        data,
        error,
      } = await supabase

        .from("events")

        .select("*")

        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (!error) {

        setEvents(data);
      }

      setLoading(false);
    };

  // FETCH REGISTRATIONS

  const fetchRegistrations =
    async () => {

      const {
        data,
        error,
      } = await supabase

        .from("registrations")

        .select("*")

        .eq(
          "user_id",
          user.id
        );

      if (!error) {

        const registeredIds =
          data.map(
            (item) =>
              item.event_id
          );

        setRegisteredEvents(
          registeredIds
        );
      }
    };

  // REGISTER EVENT

  const registerEvent =
    async (eventId) => {

      try {

        // LOGIN CHECK

        if (!user) {

          toast.error(
            "Please login first"
          );

          navigate("/login");

          return;
        }

        // FIND EVENT

        const selectedEvent =
          events.find(
            (event) =>
              event.id ===
              eventId
          );

        // SOLD OUT CHECK

        if (
          selectedEvent.available_seats <= 0
        ) {

          toast.error(
            "Event Sold Out"
          );

          return;
        }

        // ALREADY REGISTERED

        if (
          registeredEvents.includes(
            eventId
          )
        ) {

          toast.error(
            "Already Registered"
          );

          return;
        }

        // INSERT REGISTRATION

        const { error } =
          await supabase

            .from(
              "registrations"
            )

            .insert([
              {
                user_id:
                  user.id,

                event_id:
                  eventId,
              },
            ]);

        if (error) {

          toast.error(
            error.message
          );

          return;
        }

        // UPDATE SEATS

        await supabase

          .from("events")

          .update({
            available_seats:
              selectedEvent.available_seats -
              1,
          })

          .eq(
            "id",
            eventId
          );

        toast.success(
          "Registration Successful"
        );

        fetchEvents();

        fetchRegistrations();

      } catch (err) {

        console.log(err);

        toast.error(
          "Registration Failed"
        );
      }
    };

  // FILTER EVENTS

  const filteredEvents =
    events.filter((event) =>
      event.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (

    <DashboardLayout>

      <div className="text-white">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

          <div>

            <h1 className="text-5xl font-bold">

              Explore Events

            </h1>

            <p className="text-gray-400 mt-3">

              Discover and register for upcoming events

            </p>

          </div>

          {/* SEARCH */}

          <div className="bg-slate-900 px-5 py-4 rounded-2xl flex items-center gap-4 w-full md:w-[350px]">

            <FaSearch />

            <input
              type="text"

              placeholder="Search events..."

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              className="bg-transparent outline-none w-full"
            />

          </div>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="grid md:grid-cols-3 gap-8">

            {[1, 2, 3].map(
              (item) => (

                <div
                  key={item}

                  className="bg-slate-900 h-[420px] rounded-3xl animate-pulse"
                />
              )
            )}

          </div>

        ) : filteredEvents.length === 0 ? (

          <div className="bg-slate-900 rounded-3xl p-16 text-center">

            <h2 className="text-3xl font-bold">

              No Events Found

            </h2>

            <p className="text-gray-400 mt-4">

              Events will appear here once admin creates them

            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {filteredEvents.map(
              (event) => {

                const isRegistered =
                  registeredEvents.includes(
                    event.id
                  );

                const isSoldOut =
                  event.available_seats <=
                  0;

                return (

                  <motion.div
                    key={event.id}

                    whileHover={{
                      y: -8,
                    }}

                    className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl"
                  >

                    {/* IMAGE */}

                    <img
                      src={
                        event.image_url ||

                        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop"
                      }

                      alt={event.title}

                      className="w-full h-60 object-cover"
                    />

                    {/* CONTENT */}

                    <div className="p-6">

                      {/* TOP */}

                      <div className="flex items-center justify-between">

                        <span className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm">

                          {event.category}

                        </span>

                        <span className="text-green-400 text-sm font-medium">

                          {
                            event.available_seats
                          } Seats

                        </span>

                      </div>

                      {/* TITLE */}

                      <h2 className="text-3xl font-bold mt-5">

                        {event.title}

                      </h2>

                      {/* DESCRIPTION */}

                      <p className="text-gray-400 mt-4 line-clamp-3">

                        {
                          event.description
                        }

                      </p>

                      {/* DETAILS */}

                      <div className="mt-6 space-y-3 text-gray-300">

                        <div className="flex items-center gap-3">

                          <FaCalendarAlt />

                          <span>

                            {event.date}

                          </span>

                        </div>

                        <div className="flex items-center gap-3">

                          <FaMapMarkerAlt />

                          <span>

                            {event.venue}

                          </span>

                        </div>

                      </div>

                      {/* BUTTONS */}

                      <div className="flex gap-4 mt-8">

                        {/* VIEW DETAILS */}

                        <button
                          onClick={() =>
                            navigate(
                              `/events/${event.id}`
                            )
                          }

                          className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-2xl font-semibold transition"
                        >

                          View Details

                        </button>

                        {/* REGISTER */}

                        <button
                          onClick={() =>
                            registerEvent(
                              event.id
                            )
                          }

                          disabled={
                            isRegistered ||
                            isSoldOut
                          }

                          className={`flex-1 py-3 rounded-2xl font-semibold transition ${
                            isRegistered

                              ? "bg-green-800 cursor-not-allowed"

                              : isSoldOut

                              ? "bg-gray-700 cursor-not-allowed"

                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >

                          {isRegistered
                            ? "Registered"

                            : isSoldOut

                            ? "Sold Out"

                            : "Register"}

                        </button>

                      </div>

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

export default Dashboard;
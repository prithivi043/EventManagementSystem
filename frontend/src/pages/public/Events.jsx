import { useEffect, useState } from "react";

import {
  FaSearch,
  FaCalendarAlt,
} from "react-icons/fa";

import { motion } from "framer-motion";

import MainLayout from "../../layouts/MainLayout";

import EventCard from "../../components/events/EventCard";

import { supabase } from "../../services/supabase";

const Events = () => {

  const [events, setEvents] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchEvents();

    // REALTIME EVENTS

    const channel =
      supabase
        .channel("events-page")

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

    return () => {

      supabase.removeChannel(
        channel
      );
    };

  }, []);

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

  const filteredEvents =
    events.filter((event) =>
      event.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (

    <MainLayout>

      <div className="min-h-screen bg-slate-950 text-white">

        {/* HEADER */}

        <div className="max-w-7xl mx-auto px-4 pt-20 pb-10">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <h1 className="text-6xl font-bold">

                Explore Events

              </h1>

              <p className="text-gray-400 mt-4 text-lg">

                Discover upcoming conferences, workshops and realtime events

              </p>

            </div>

            {/* SEARCH */}

            <div className="bg-slate-900 border border-slate-800 px-5 py-4 rounded-2xl flex items-center gap-4 w-full lg:w-[400px]">

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

        </div>

        {/* EVENTS */}

        <div className="max-w-7xl mx-auto px-4 pb-20">

          {loading ? (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

              {[1, 2, 3].map(
                (item) => (

                  <div
                    key={item}
                    className="h-[450px] rounded-3xl bg-slate-900 animate-pulse"
                  />
                )
              )}

            </div>

          ) : filteredEvents.length === 0 ? (

            <div className="bg-slate-900 rounded-3xl p-16 text-center">

              <FaCalendarAlt
                size={60}
                className="mx-auto text-blue-400"
              />

              <h2 className="text-4xl font-bold mt-6">

                No Events Found

              </h2>

            </div>

          ) : (

            <motion.div
              layout

              className="grid md:grid-cols-2 xl:grid-cols-3 gap-8"
            >

              {filteredEvents.map(
                (event) => (

                  <EventCard
                    key={event.id}
                    event={event}
                  />

                )
              )}

            </motion.div>

          )}

        </div>

      </div>

    </MainLayout>
  );
};

export default Events;
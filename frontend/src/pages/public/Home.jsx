import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { motion } from "framer-motion";

import MainLayout from "../../layouts/MainLayout";

const Home = () => {

  return (

    <MainLayout>

      <div className="min-h-screen bg-slate-950 text-white overflow-hidden">

        {/* HERO SECTION */}

        <section className="relative">

          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 py-24 relative z-10">

            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* LEFT */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: -50,
                }}

                animate={{
                  opacity: 1,
                  x: 0,
                }}

                transition={{
                  duration: 0.7,
                }}
              >

                <span className="bg-blue-600/20 text-blue-400 px-5 py-2 rounded-full text-sm">

                  🔥 Realtime Event Platform

                </span>

                <h1 className="text-6xl lg:text-7xl font-bold leading-tight mt-8">

                  Discover,
                  Register &
                  Manage Events

                </h1>

                <p className="mt-8 text-xl text-gray-400 leading-relaxed">

                  Join conferences,
                  hackathons, workshops,
                  networking events and
                  festivals from anywhere
                  with realtime updates.

                </p>

                {/* BUTTONS */}

                <div className="flex flex-wrap gap-5 mt-10">

                  <Link
                    to="/events"

                    className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl flex items-center gap-3 text-lg transition"
                  >

                    Explore Events

                    <FaArrowRight />

                  </Link>

                  <Link
                    to="/register"

                    className="border border-slate-700 hover:border-blue-500 px-8 py-4 rounded-2xl text-lg transition"
                  >

                    Get Started

                  </Link>

                </div>

                {/* STATS */}

                <div className="grid grid-cols-3 gap-6 mt-14">

                  <div>

                    <h2 className="text-4xl font-bold text-blue-400">

                      50+

                    </h2>

                    <p className="text-gray-400 mt-2">

                      Events

                    </p>

                  </div>

                  <div>

                    <h2 className="text-4xl font-bold text-green-400">

                      10K+

                    </h2>

                    <p className="text-gray-400 mt-2">

                      Participants

                    </p>

                  </div>

                  <div>

                    <h2 className="text-4xl font-bold text-pink-400">

                      25+

                    </h2>

                    <p className="text-gray-400 mt-2">

                      Organizers

                    </p>

                  </div>

                </div>

              </motion.div>

              {/* RIGHT */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: 50,
                }}

                animate={{
                  opacity: 1,
                  x: 0,
                }}

                transition={{
                  duration: 0.7,
                }}

                className="relative"
              >

                <img
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop"

                  alt="event"

                  className="rounded-[40px] shadow-2xl border border-slate-800"
                />

                {/* FLOATING CARD */}

                <div className="absolute -bottom-10 -left-10 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl w-[280px]">

                  <div className="flex items-center gap-4">

                    <div className="bg-blue-600 p-4 rounded-2xl">

                      <FaCalendarAlt size={25} />

                    </div>

                    <div>

                      <h3 className="text-2xl font-bold">

                        150+

                      </h3>

                      <p className="text-gray-400">

                        Live Registrations

                      </p>

                    </div>

                  </div>

                </div>

              </motion.div>

            </div>

          </div>

        </section>

      </div>

    </MainLayout>
  );
};

export default Home;
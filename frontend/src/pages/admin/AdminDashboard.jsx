import { useEffect, useState } from "react";

import {
  FaUsers,
  FaCalendarAlt,
  FaClipboardList,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaDownload,
  FaTimes,
  FaCog,
} from "react-icons/fa";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";

import { supabase } from "../../services/supabase";

const AdminDashboard = () => {

  // ACTIVE SECTION

  const [activeSection,
    setActiveSection] =
    useState("dashboard");

  // STATES

  const [stats, setStats] =
    useState({
      events: 0,
      users: 0,
      registrations: 0,
    });

  const [events, setEvents] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [registrations,
    setRegistrations] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [showModal,
    setShowModal] =
    useState(false);

  const [editingEvent,
    setEditingEvent] =
    useState(null);

  const [loading,
    setLoading] =
    useState(false);

  const [formData,
    setFormData] =
    useState({
      title: "",
      description: "",
      category: "",
      date: "",
      time: "",
      venue: "",
      seats: "",
      organizer: "",
      image_url: "",
    });

  // FETCH DATA

  useEffect(() => {

    fetchDashboardData();

    // REALTIME

    const channel =
      supabase

        .channel(
          "admin-dashboard"
        )

        .on(
          "postgres_changes",

          {
            event: "*",
            schema: "public",
            table: "events",
          },

          () => {
            fetchDashboardData();
          }
        )

        .on(
          "postgres_changes",

          {
            event: "*",
            schema: "public",
            table: "users",
          },

          () => {
            fetchDashboardData();
          }
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
            fetchDashboardData();
          }
        )

        .subscribe();

    return () => {

      supabase.removeChannel(
        channel
      );
    };

  }, []);

  // FETCH

  const fetchDashboardData =
    async () => {

      try {

        const {
          data: eventData,
        } = await supabase

          .from("events")

          .select("*")

          .order(
            "created_at",
            {
              ascending: false,
            }
          );

        const {
          data: userData,
        } = await supabase

          .from("users")

          .select("*");

        const {
          data: registrationData,
        } = await supabase

          .from("registrations")

          .select(`
            *,
            users(name,email),
            events(title)
          `);

        setEvents(
          eventData || []
        );

        setUsers(
          userData || []
        );

        setRegistrations(
          registrationData ||
          []
        );

        setStats({
          events:
            eventData?.length ||
            0,

          users:
            userData?.length ||
            0,

          registrations:
            registrationData?.length ||
            0,
        });

      } catch (err) {

        console.log(err);
      }
    };

  // HANDLE INPUT

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      setFormData(
        (prev) => ({
          ...prev,
          [name]: value,
        })
      );
    };

  // OPEN CREATE

  const openCreateModal =
    () => {

      setEditingEvent(null);

      setFormData({
        title: "",
        description: "",
        category: "",
        date: "",
        time: "",
        venue: "",
        seats: "",
        organizer: "",
        image_url: "",
      });

      setShowModal(true);
    };

  // OPEN EDIT

  const openEditModal =
    (event) => {

      setEditingEvent(
        event
      );

      setFormData({
        ...event,
      });

      setShowModal(true);
    };

  // SAVE EVENT

  const saveEvent =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const payload = {

          title:
            formData.title,

          description:
            formData.description,

          category:
            formData.category,

          date:
            formData.date,

          time:
            formData.time,

          venue:
            formData.venue,

          seats:
            Number(
              formData.seats
            ),

          available_seats:
            Number(
              formData.seats
            ),

          organizer:
            formData.organizer,

          image_url:
            formData.image_url,
        };

        // UPDATE

        if (editingEvent) {

          const {
            error,
          } = await supabase

            .from("events")

            .update(payload)

            .eq(
              "id",
              editingEvent.id
            );

          if (error) {

            toast.error(
              error.message
            );

            return;
          }

          toast.success(
            "Event Updated"
          );

        } else {

          // CREATE

          const {
            error,
          } = await supabase

            .from("events")

            .insert([
              payload,
            ]);

          if (error) {

            toast.error(
              error.message
            );

            return;
          }

          toast.success(
            "Event Created"
          );
        }

        setShowModal(false);

        fetchDashboardData();

      } catch (err) {

        console.log(err);

        toast.error(
          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

  // DELETE EVENT

  const deleteEvent =
    async (id) => {

      try {

        const confirmDelete =
          window.confirm(
            "Delete this event?"
          );

        if (!confirmDelete)
          return;

        const {
          error,
        } = await supabase

          .from("events")

          .delete()

          .eq("id", id);

        if (error) {

          toast.error(
            error.message
          );

          return;
        }

        toast.success(
          "Event Deleted"
        );

      } catch (err) {

        console.log(err);
      }
    };

  // DELETE USER

  const deleteUser =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this user?"
        );

      if (!confirmDelete)
        return;

      await supabase

        .from("users")

        .delete()

        .eq("id", id);

      toast.success(
        "User Deleted"
      );
    };

  // CHANGE ROLE

  const changeRole =
    async (
      userId,
      currentRole
    ) => {

      const newRole =
        currentRole ===
        "admin"
          ? "student"
          : "admin";

      await supabase

        .from("users")

        .update({
          role: newRole,
        })

        .eq("id", userId);

      toast.success(
        "Role Updated"
      );
    };

  // EXPORT USERS

  const exportUsers =
    () => {

      const csvContent =
        [
          [
            "Name",
            "Email",
            "Role",
          ],

          ...users.map(
            (user) => [
              user.name,
              user.email,
              user.role,
            ]
          ),
        ]

          .map((e) =>
            e.join(",")
          )

          .join("\n");

      const blob =
        new Blob(
          [csvContent],
          {
            type: "text/csv",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;

      a.download =
        "users.csv";

      a.click();
    };

  // FILTER USERS

  const filteredUsers =
    users.filter((user) =>
      user.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (

    <DashboardLayout

      activeSection={
        activeSection
      }

      setActiveSection={
        setActiveSection
      }
    >

      <div className="text-white">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

          <div>

            <h1 className="text-5xl font-bold">

              Admin Dashboard

            </h1>

            <p className="text-gray-400 mt-3">

              Manage your event platform in realtime

            </p>

          </div>

          {activeSection ===
            "events" && (

            <button
              onClick={
                openCreateModal
              }

              className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-2xl flex items-center gap-3"
            >

              <FaPlus />

              Create Event

            </button>

          )}

        </div>

        {/* DASHBOARD */}

        {activeSection ===
          "dashboard" && (

          <div className="grid md:grid-cols-3 gap-6">

            <motion.div

              whileHover={{
                scale: 1.03,
              }}

              className="bg-slate-900 border border-slate-800 p-8 rounded-3xl"
            >

              <div className="flex justify-between">

                <div>

                  <p className="text-gray-400">

                    Total Events

                  </p>

                  <h2 className="text-5xl font-bold mt-4">

                    {stats.events}

                  </h2>

                </div>

                <FaCalendarAlt
                  size={35}
                />

              </div>

            </motion.div>

            <motion.div

              whileHover={{
                scale: 1.03,
              }}

              className="bg-slate-900 border border-slate-800 p-8 rounded-3xl"
            >

              <div className="flex justify-between">

                <div>

                  <p className="text-gray-400">

                    Total Users

                  </p>

                  <h2 className="text-5xl font-bold mt-4">

                    {stats.users}

                  </h2>

                </div>

                <FaUsers
                  size={35}
                />

              </div>

            </motion.div>

            <motion.div

              whileHover={{
                scale: 1.03,
              }}

              className="bg-slate-900 border border-slate-800 p-8 rounded-3xl"
            >

              <div className="flex justify-between">

                <div>

                  <p className="text-gray-400">

                    Registrations

                  </p>

                  <h2 className="text-5xl font-bold mt-4">

                    {
                      stats.registrations
                    }

                  </h2>

                </div>

                <FaClipboardList
                  size={35}
                />

              </div>

            </motion.div>

          </div>

        )}

        {/* EVENT MANAGEMENT */}

        {activeSection ===
  "events" && (

  <div className="bg-slate-900 rounded-3xl p-4 md:p-8">

    {/* DESKTOP TABLE */}

    <div className="hidden lg:block overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b border-slate-700 text-left">

            <th className="py-4">
              Image
            </th>

            <th>
              Event
            </th>

            <th>
              Category
            </th>

            <th>
              Venue
            </th>

            <th>
              Seats
            </th>

            <th>
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {events.map(
            (event) => (

              <tr
                key={event.id}
                className="border-b border-slate-800"
              >

                <td className="py-4">

                  <img
                    src={
                      event.image_url
                    }

                    alt="event"

                    className="w-24 h-16 rounded-xl object-cover"
                  />

                </td>

                <td className="font-medium">

                  {event.title}

                </td>

                <td>

                  {event.category}

                </td>

                <td>

                  {event.venue}

                </td>

                <td>

                  {
                    event.available_seats
                  }

                </td>

                <td>

                  <div className="flex gap-3">

                    <button
                      onClick={() =>
                        openEditModal(
                          event
                        )
                      }

                      className="bg-yellow-500 hover:bg-yellow-600 px-4 py-3 rounded-xl transition"
                    >

                      <FaEdit />

                    </button>

                    <button
                      onClick={() =>
                        deleteEvent(
                          event.id
                        )
                      }

                      className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl transition"
                    >

                      <FaTrash />

                    </button>

                  </div>

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

    {/* MOBILE CARD VIEW */}

    <div className="lg:hidden space-y-5">

      {events.map(
        (event) => (

          <div
            key={event.id}

            className="bg-slate-800 rounded-3xl overflow-hidden border border-slate-700"
          >

            {/* IMAGE */}

            <img
              src={
                event.image_url
              }

              alt="event"

              className="w-full h-52 object-cover"
            />

            {/* CONTENT */}

            <div className="p-5">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h3 className="text-2xl font-bold text-white">

                    {event.title}

                  </h3>

                  <p className="text-gray-400 mt-2">

                    {event.category}

                  </p>

                </div>

                <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm whitespace-nowrap">

                  {
                    event.available_seats
                  } Seats

                </span>

              </div>

              {/* DETAILS */}

              <div className="mt-5 space-y-3">

                <div className="flex justify-between">

                  <span className="text-gray-400">

                    Venue

                  </span>

                  <span className="text-white">

                    {event.venue}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-400">

                    Date

                  </span>

                  <span className="text-white">

                    {event.date}

                  </span>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex gap-3 mt-6">

                <button
                  onClick={() =>
                    openEditModal(
                      event
                    )
                  }

                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 py-3 rounded-2xl flex items-center justify-center gap-2 transition"
                >

                  <FaEdit />

                  Edit

                </button>

                <button
                  onClick={() =>
                    deleteEvent(
                      event.id
                    )
                  }

                  className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-2xl flex items-center justify-center gap-2 transition"
                >

                  <FaTrash />

                  Delete

                </button>

              </div>

            </div>

          </div>

        )
      )}

    </div>

  </div>

)}

        {/* USERS */}

        {activeSection ===
          "users" && (

          <div className="bg-slate-900 rounded-3xl p-8 overflow-x-auto">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

              <div className="bg-slate-800 px-4 py-3 rounded-xl flex items-center gap-3">

                <FaSearch />

                <input
                  type="text"

                  placeholder="Search users..."

                  value={search}

                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }

                  className="bg-transparent outline-none"
                />

              </div>

              <button
                onClick={
                  exportUsers
                }

                className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl flex items-center gap-2"
              >

                <FaDownload />

                Export

              </button>

            </div>

            <table className="w-full min-w-[700px]">

              <thead>

                <tr className="border-b border-slate-700 text-left">

                  <th className="py-4">
                    Name
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.map(
                  (user) => (

                    <tr
                      key={user.id}
                      className="border-b border-slate-800"
                    >

                      <td className="py-5">

                        {user.name}

                      </td>

                      <td>

                        {user.email}

                      </td>

                      <td>

                        <button
                          onClick={() =>
                            changeRole(
                              user.id,
                              user.role
                            )
                          }

                          className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full"
                        >

                          {user.role}

                        </button>

                      </td>

                      <td>

                        <button
                          onClick={() =>
                            deleteUser(
                              user.id
                            )
                          }

                          className="bg-red-600 px-4 py-3 rounded-xl"
                        >

                          <FaTrash />

                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

        {/* REGISTRATIONS */}

        {activeSection ===
          "registrations" && (

          <div className="bg-slate-900 rounded-3xl p-8 overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead>

                <tr className="border-b border-slate-700 text-left">

                  <th className="py-4">
                    User
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Event
                  </th>

                </tr>

              </thead>

              <tbody>

                {registrations.map(
                  (item) => (

                    <tr
                      key={item.id}
                      className="border-b border-slate-800"
                    >

                      <td className="py-5">

                        {
                          item.users
                            ?.name
                        }

                      </td>

                      <td>

                        {
                          item.users
                            ?.email
                        }

                      </td>

                      <td>

                        {
                          item.events
                            ?.title
                        }

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

        {/* SETTINGS */}

        {activeSection ===
          "settings" && (

          <div className="bg-slate-900 rounded-3xl p-10">

            <div className="flex items-center gap-4 mb-8">

              <FaCog
                size={30}
              />

              <h2 className="text-4xl font-bold">

                Settings

              </h2>

            </div>

            <div className="space-y-5">

              <div className="bg-slate-800 p-6 rounded-2xl">

                <h3 className="text-2xl font-semibold">

                  Platform Settings

                </h3>

                <p className="text-gray-400 mt-3">

                  Manage application preferences and configurations.

                </p>

              </div>

              <div className="bg-slate-800 p-6 rounded-2xl">

                <h3 className="text-2xl font-semibold">

                  Security

                </h3>

                <p className="text-gray-400 mt-3">

                  Configure admin security and permissions.

                </p>

              </div>

            </div>

          </div>

        )}

        {/* MODAL */}

        {showModal && (

          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

            <div className="bg-slate-900 w-full max-w-3xl rounded-3xl p-8">

              <div className="flex items-center justify-between mb-8">

                <h2 className="text-3xl font-bold">

                  {editingEvent
                    ? "Edit Event"
                    : "Create Event"}

                </h2>

                <button
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                >

                  <FaTimes
                    size={24}
                  />

                </button>

              </div>

              <form
                onSubmit={
                  saveEvent
                }

                className="grid md:grid-cols-2 gap-5"
              >

                <input
                  type="text"
                  name="title"
                  placeholder="Event Title"
                  value={
                    formData.title
                  }
                  onChange={
                    handleChange
                  }
                  className="bg-slate-800 p-4 rounded-xl outline-none"
                />

                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                  className="bg-slate-800 p-4 rounded-xl outline-none"
                />

                <input
                  type="date"
                  name="date"
                  value={
                    formData.date
                  }
                  onChange={
                    handleChange
                  }
                  className="bg-slate-800 p-4 rounded-xl outline-none"
                />

                <input
                  type="text"
                  name="time"
                  placeholder="Time"
                  value={
                    formData.time
                  }
                  onChange={
                    handleChange
                  }
                  className="bg-slate-800 p-4 rounded-xl outline-none"
                />

                <input
                  type="text"
                  name="venue"
                  placeholder="Venue"
                  value={
                    formData.venue
                  }
                  onChange={
                    handleChange
                  }
                  className="bg-slate-800 p-4 rounded-xl outline-none"
                />

                <input
                  type="number"
                  name="seats"
                  placeholder="Seats"
                  value={
                    formData.seats
                  }
                  onChange={
                    handleChange
                  }
                  className="bg-slate-800 p-4 rounded-xl outline-none"
                />

                <input
                  type="text"
                  name="organizer"
                  placeholder="Organizer"
                  value={
                    formData.organizer
                  }
                  onChange={
                    handleChange
                  }
                  className="bg-slate-800 p-4 rounded-xl outline-none"
                />

                <input
                  type="text"
                  name="image_url"
                  placeholder="Image URL"
                  value={
                    formData.image_url
                  }
                  onChange={
                    handleChange
                  }
                  className="bg-slate-800 p-4 rounded-xl outline-none"
                />

                <textarea
                  name="description"
                  placeholder="Description"
                  rows="5"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  className="md:col-span-2 bg-slate-800 p-4 rounded-xl outline-none"
                />

                <button
                  disabled={
                    loading
                  }

                  className="md:col-span-2 bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl text-lg font-semibold"
                >

                  {loading
                    ? "Saving..."
                    : editingEvent
                    ? "Update Event"
                    : "Create Event"}

                </button>

              </form>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>
  );
};

export default AdminDashboard;
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {

  return (

    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-800 hover:border-blue-500 transition">

      <img
        src={
          event.image_url ||
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop"
        }
        alt={event.title}
        className="w-full h-56 object-cover"
      />

      <div className="p-6">

        <h2 className="text-2xl font-bold text-white">

          {event.title}

        </h2>

        <p className="text-gray-400 mt-3">

          📍 {event.venue}

        </p>

        <p className="text-gray-400 mt-2">

          📅 {event.date}

        </p>

        <p className="text-blue-400 mt-2">

          🎟 Seats:
          {event.available_seats}
        </p>

        <Link
          to={`/events/${event.id}`}
          className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
        >
          View Details
        </Link>

      </div>

    </div>
  );
};

export default EventCard;
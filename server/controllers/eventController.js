const supabase =
  require("../services/supabaseClient");

exports.getEvents =
  async (req, res) => {

    try {

      const {
        data,
        error,
      } =
        await supabase
          .from("events")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

      if (error) throw error;

      res.json(data);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };

exports.getSingleEvent =
  async (req, res) => {

    try {

      const {
        data,
        error,
      } =
        await supabase
          .from("events")
          .select("*")
          .eq("id", req.params.id)
          .single();

      if (error) throw error;

      res.json(data);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };

exports.createEvent =
  async (req, res) => {

    try {

      const {
        title,
        description,
        category,
        date,
        time,
        venue,
        seats,
        organizer,
        image_url,
      } = req.body;

      const {
        data,
        error,
      } =
        await supabase
          .from("events")
          .insert([
            {
              title,
              description,
              category,
              date,
              time,
              venue,
              seats,
              available_seats:
                seats,
              organizer,
              image_url,
            },
          ])
          .select();

      if (error) throw error;

      res.status(201).json(data);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };

exports.updateEvent =
  async (req, res) => {

    try {

      const {
        data,
        error,
      } =
        await supabase
          .from("events")
          .update(req.body)
          .eq("id", req.params.id)
          .select();

      if (error) throw error;

      res.json(data);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };

exports.deleteEvent =
  async (req, res) => {

    try {

      const { error } =
        await supabase
          .from("events")
          .delete()
          .eq("id", req.params.id);

      if (error) throw error;

      res.json({
        message:
          "Event Deleted Successfully",
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };
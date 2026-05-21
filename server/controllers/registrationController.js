const supabase =
  require("../services/supabaseClient");

exports.registerForEvent =
  async (req, res) => {

    try {

      const { event_id } =
        req.body;

      const user_id =
        req.user.id;

      const {
        data: existing,
      } =
        await supabase
          .from("registrations")
          .select("*")
          .eq("user_id", user_id)
          .eq("event_id", event_id);

      if (existing.length > 0) {

        return res.status(400).json({
          message:
            "Already Registered",
        });
      }

      await supabase
        .from("registrations")
        .insert([
          {
            user_id,
            event_id,
          },
        ]);

      const {
        data: event,
      } =
        await supabase
          .from("events")
          .select("*")
          .eq("id", event_id)
          .single();

      await supabase
        .from("events")
        .update({
          available_seats:
            event.available_seats - 1,
        })
        .eq("id", event_id);

      res.status(201).json({
        message:
          "Registration Successful",
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };

exports.getMyRegistrations =
  async (req, res) => {

    try {

      const {
        data,
        error,
      } =
        await supabase
          .from("registrations")
          .select(`
            *,
            events(*)
          `)
          .eq(
            "user_id",
            req.user.id
          );

      if (error) throw error;

      res.json(data);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };
const supabase =
  require("../services/supabaseClient");

exports.getUsers =
  async (req, res) => {

    try {

      const {
        data,
        error,
      } =
        await supabase
          .from("users")
          .select("*");

      if (error) throw error;

      res.json(data);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };

exports.deleteUser =
  async (req, res) => {

    try {

      const { error } =
        await supabase
          .from("users")
          .delete()
          .eq("id", req.params.id);

      if (error) throw error;

      res.json({
        message:
          "User Deleted Successfully",
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };
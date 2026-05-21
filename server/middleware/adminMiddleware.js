const supabase =
  require("../services/supabaseClient");

const adminMiddleware =
  async (req, res, next) => {

    try {

      const { data, error } =
        await supabase
          .from("users")
          .select("*")
          .eq("id", req.user.id)
          .single();

      if (
        error ||
        data.role !== "admin"
      ) {

        return res.status(403).json({
          message: "Admin Access Only",
        });
      }

      next();

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };

module.exports =
  adminMiddleware;
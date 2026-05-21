const supabase =
  require("../services/supabaseClient");

const authMiddleware =
  async (req, res, next) => {

    try {

      const token =
        req.headers.authorization?.split(
          " "
        )[1];

      if (!token) {

        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      const {
        data: { user },
        error,
      } =
        await supabase.auth.getUser(
          token
        );

      if (error || !user) {

        return res.status(401).json({
          message: "Invalid Token",
        });
      }

      req.user = user;

      next();

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };

module.exports =
  authMiddleware;
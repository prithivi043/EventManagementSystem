const supabase =
  require("../services/supabaseClient");

exports.registerUser =
  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
      } = req.body;

      const {
        data,
        error,
      } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (error) throw error;

      await supabase
        .from("users")
        .insert([
          {
            id: data.user.id,
            name,
            email,
            role: "user",
          },
        ]);

      res.status(201).json({
        message:
          "User Registered Successfully",
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });
    }
  };
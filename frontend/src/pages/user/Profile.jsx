import { useEffect, useState } from "react";

import {
  FaUserEdit,
  FaEnvelope,
  FaUserShield,
  FaCamera,
  FaSave,
} from "react-icons/fa";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";

import { supabase } from "../../services/supabase";

const Profile = () => {

  const storedUser =
    JSON.parse(
      localStorage.getItem("user")
    );

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState("");

  const [profileImage,
    setProfileImage] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  useEffect(() => {

    fetchProfile();

    // REALTIME PROFILE UPDATE

    const channel =
      supabase
        .channel(
          "profile-realtime"
        )

        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "users",
          },

          () => {

            fetchProfile();
          }
        )

        .subscribe();

    return () => {

      supabase.removeChannel(
        channel
      );
    };

  }, []);

  // FETCH PROFILE

  const fetchProfile =
    async () => {

      const {
        data,
        error,
      } = await supabase

        .from("users")

        .select("*")

        .eq(
          "id",
          storedUser.id
        )

        .single();

      if (!error && data) {

        setName(data.name);

        setEmail(data.email);

        setRole(data.role);

        setProfileImage(
          data.profile_image
        );
      }
    };

  // IMAGE UPLOAD

  const handleImageUpload =
  async (e) => {

    try {

      const file =
        e.target.files[0];

      if (!file) return;

      // FILE VALIDATION

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        toast.error(
          "Only image files allowed"
        );

        return;
      }

      // FILE SIZE

      if (
        file.size >
        5 * 1024 * 1024
      ) {

        toast.error(
          "Image must be below 5MB"
        );

        return;
      }

      const fileExt =
        file.name.split(".").pop();

      const fileName =
        `${storedUser.id}-${Date.now()}.${fileExt}`;

      // UPLOAD IMAGE

      const {
        data: uploadData,
        error: uploadError,
      } = await supabase.storage

        .from("profiles")

        .upload(
          fileName,
          file,
          {
            upsert: true,
          }
        );

      if (uploadError) {

        console.log(
          uploadError
        );

        toast.error(
          uploadError.message
        );

        return;
      }

      // GET PUBLIC URL

      const {
        data: publicUrlData,
      } = supabase.storage

        .from("profiles")

        .getPublicUrl(
          fileName
        );

      const imageUrl =
        publicUrlData.publicUrl;

      // UPDATE USER TABLE

      const {
        error: updateError,
      } = await supabase

        .from("users")

        .update({
          profile_image:
            imageUrl,
        })

        .eq(
          "id",
          storedUser.id
        );

      if (updateError) {

        toast.error(
          updateError.message
        );

        return;
      }

      // UPDATE STATE

      setProfileImage(
        imageUrl
      );

      // UPDATE LOCAL STORAGE

      const updatedUser = {
        ...storedUser,
        profile_image:
          imageUrl,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(
          updatedUser
        )
      );

      toast.success(
        "Profile Image Updated"
      );

    } catch (err) {

      console.log(err);

      toast.error(
        "Upload Failed"
      );
    }
  };

  // UPDATE PROFILE

  const updateProfile =
    async () => {

      setLoading(true);

      const { error } =
        await supabase

          .from("users")

          .update({
            name,
          })

          .eq(
            "id",
            storedUser.id
          );

      setLoading(false);

      if (error) {

        toast.error(
          error.message
        );

      } else {

        const updatedUser = {
          ...storedUser,
          name,
          profile_image:
            profileImage,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(
            updatedUser
          )
        );

        toast.success(
          "Profile Updated"
        );
      }
    };

  return (

    <DashboardLayout>

      <div className="text-white">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold">

            My Profile

          </h1>

          <p className="text-gray-400 mt-3">

            Manage your account details and profile image

          </p>

        </div>

        {/* PROFILE CARD */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl max-w-5xl"
        >

          {/* TOP SECTION */}

          <div className="flex flex-col md:flex-row items-center gap-10">

            {/* PROFILE IMAGE */}

            <div className="relative">

              <img
                src={
                  profileImage ||

                  "https://i.pravatar.cc/300"
                }

                alt="profile"

                className="w-40 h-40 rounded-full object-cover border-4 border-blue-600"
              />

              <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 p-4 rounded-full cursor-pointer transition">

                <FaCamera />

                <input
                  type="file"
                  hidden
                  onChange={
                    handleImageUpload
                  }
                />

              </label>

            </div>

            {/* USER INFO */}

            <div className="flex-1">

              <h2 className="text-4xl font-bold">

                {name}

              </h2>

              <p className="text-gray-400 mt-3 text-lg">

                {email}

              </p>

              <span className="inline-block mt-5 bg-blue-600/20 text-blue-400 px-5 py-2 rounded-full">

                {role}

              </span>

            </div>

          </div>

          {/* FORM */}

          <div className="grid md:grid-cols-2 gap-6 mt-12">

            {/* NAME */}

            <div>

              <label className="text-gray-400 mb-3 block">

                Full Name

              </label>

              <div className="bg-slate-800 px-5 py-4 rounded-2xl flex items-center gap-4">

                <FaUserEdit />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }

                  className="bg-transparent outline-none w-full"
                />

              </div>

            </div>

            {/* EMAIL */}

            <div>

              <label className="text-gray-400 mb-3 block">

                Email Address

              </label>

              <div className="bg-slate-800 px-5 py-4 rounded-2xl flex items-center gap-4">

                <FaEnvelope />

                <input
                  type="email"
                  value={email}
                  disabled

                  className="bg-transparent outline-none w-full text-gray-400"
                />

              </div>

            </div>

            {/* ROLE */}

            <div>

              <label className="text-gray-400 mb-3 block">

                Account Role

              </label>

              <div className="bg-slate-800 px-5 py-4 rounded-2xl flex items-center gap-4">

                <FaUserShield />

                <input
                  type="text"
                  value={role}
                  disabled

                  className="bg-transparent outline-none w-full text-gray-400 capitalize"
                />

              </div>

            </div>

          </div>

          {/* SAVE BUTTON */}

          <button
            onClick={updateProfile}

            disabled={loading}

            className="mt-10 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl flex items-center gap-4 text-lg transition"
          >

            <FaSave />

            {loading
              ? "Saving..."
              : "Save Changes"}

          </button>

        </motion.div>

      </div>

    </DashboardLayout>
  );
};

export default Profile;
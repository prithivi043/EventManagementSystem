const supabase =
  require("../services/supabaseClient");

const uploadImage =
  async (file) => {

    const fileName =
      `${Date.now()}-${file.originalname}`;

    const {
      data,
      error,
    } =
      await supabase.storage
        .from("event-images")
        .upload(
          fileName,
          file.buffer,
          {
            contentType:
              file.mimetype,
          }
        );

    if (error) {
      throw error;
    }

    const {
      data: publicUrl,
    } =
      supabase.storage
        .from("event-images")
        .getPublicUrl(
          fileName
        );

    return publicUrl.publicUrl;
  };

module.exports =
  uploadImage;
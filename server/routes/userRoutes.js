const express = require("express");

const router =
  express.Router();

const {
  getUsers,
  deleteUser,
} = require(
  "../controllers/userController"
);

const authMiddleware =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getUsers
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteUser
);

module.exports = router;
const express = require("express");

const router =
  express.Router();

const {
  registerForEvent,
  getMyRegistrations,
} = require(
  "../controllers/registrationController"
);

const authMiddleware =
  require("../middleware/authMiddleware");

router.post(
  "/",
  authMiddleware,
  registerForEvent
);

router.get(
  "/my",
  authMiddleware,
  getMyRegistrations
);

module.exports = router;
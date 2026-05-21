const express = require("express");

const router =
  express.Router();

const {
  getEvents,
  getSingleEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require(
  "../controllers/eventController"
);

const authMiddleware =
  require("../middleware/authMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

router.get("/", getEvents);

router.get(
  "/:id",
  getSingleEvent
);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createEvent
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateEvent
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteEvent
);

module.exports = router;
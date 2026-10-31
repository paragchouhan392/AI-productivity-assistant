import { Router } from "express";
import {
  addEvent,
  listEvents,
  upcomingEvents,
  getEvent,
  editEvent,
  removeEvent,
} from "../controllers/events.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  handleValidation,
  eventIdRule,
  createEventRules,
  updateEventRules,
  listEventsRules,
  upcomingEventsRules,
} from "../middleware/validate.middleware.js";

const router = Router();

router.use(protect);

router.get("/", listEventsRules, handleValidation, listEvents);
router.post("/", createEventRules, handleValidation, addEvent);

router.get("/upcoming", upcomingEventsRules, handleValidation, upcomingEvents);

router.get("/:id", eventIdRule, handleValidation, getEvent);
router.patch("/:id", eventIdRule, updateEventRules, handleValidation, editEvent);
router.delete("/:id", eventIdRule, handleValidation, removeEvent);

export default router;
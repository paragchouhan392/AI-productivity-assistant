import {
  createEvent,
  getEventsInRange,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../models/event.model.js";
import { getToday, addDays, daysBetween } from "../utils/date.js";

const MAX_RANGE_DAYS = 62;

// TIME columns come back as "HH:MM:SS"; send "HH:MM" (or null for all-day)
const formatEvent = (row) => ({
  ...row,
  event_time: row.event_time ? row.event_time.slice(0, 5) : null,
});

const monthRange = (month) => {
  const [year, mon] = month.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, mon, 0)).getUTCDate();
  return {
    from: `${month}-01`,
    to: `${month}-${String(lastDay).padStart(2, "0")}`,
  };
};

export const addEvent = async (req, res, next) => {
  try {
    const { event_title, event_description, event_date, event_time, event_type } = req.body;

    const event = await createEvent({
      userId: req.user.id,
      title: event_title,
      description: event_description ?? "",
      date: event_date,
      time: event_time,
      type: event_type,
    });

    res.status(201).json({ message: "Event created", event: formatEvent(event) });
  } catch (err) {
    next(err);
  }
};

// Calendar data: ?month=2026-11  or  ?from=2026-10-26&to=2026-12-06
export const listEvents = async (req, res, next) => {
  try {
    const { month, from: fromQuery, to: toQuery, type } = req.query;

    if (month && (fromQuery || toQuery)) {
      return res.status(400).json({ message: "Use either month or from/to, not both" });
    }
    if (Boolean(fromQuery) !== Boolean(toQuery)) {
      return res.status(400).json({ message: "Provide both from and to" });
    }

    let from;
    let to;

    if (month) {
      ({ from, to } = monthRange(month));
    } else if (fromQuery && toQuery) {
      from = fromQuery;
      to = toQuery;
    } else {
      ({ from, to } = monthRange(getToday().slice(0, 7)));
    }

    if (from > to) {
      return res.status(400).json({ message: "from must be before or equal to to" });
    }
    if (daysBetween(from, to) > MAX_RANGE_DAYS) {
      return res.status(400).json({
        message: `Date range can be at most ${MAX_RANGE_DAYS} days`,
      });
    }

    const events = (
      await getEventsInRange({ userId: req.user.id, from, to, type })
    ).map(formatEvent);

    // For the dots/badges on the calendar
    const countsByDate = events.reduce((counts, event) => {
      counts[event.event_date] = (counts[event.event_date] || 0) + 1;
      return counts;
    }, {});

    res.json({ from, to, events, counts_by_date: countsByDate });
  } catch (err) {
    next(err);
  }
};

// Today + the next N days, for reminders and the dashboard
export const upcomingEvents = async (req, res, next) => {
  try {
    const days = req.query.days || 7;
    const today = getToday();
    const to = addDays(today, days);

    const events = (
      await getEventsInRange({ userId: req.user.id, from: today, to })
    ).map(formatEvent);

    res.json({
      from: today,
      to,
      today_events: events.filter((e) => e.event_date === today),
      events,
    });
  } catch (err) {
    next(err);
  }
};

export const getEvent = async (req, res, next) => {
  try {
    const event = await getEventById({
      eventId: req.params.id,
      userId: req.user.id,
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ event: formatEvent(event) });
  } catch (err) {
    next(err);
  }
};

export const editEvent = async (req, res, next) => {
  try {
    const { event_title, event_description, event_date, event_time, event_type } = req.body;

    const event = await updateEvent({
      eventId: req.params.id,
      userId: req.user.id,
      fields: {
        title: event_title,
        description: event_description,
        date: event_date,
        time: event_time,
        type: event_type,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event updated", event: formatEvent(event) });
  } catch (err) {
    next(err);
  }
};

export const removeEvent = async (req, res, next) => {
  try {
    const deleted = await deleteEvent({
      eventId: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted" });
  } catch (err) {
    next(err);
  }
};
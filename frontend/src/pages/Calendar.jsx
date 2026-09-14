import { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "../components/Sidebar.jsx";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../api/events.js";
import "./Dashboard.css";
import "./Calendar.css";

const toDateString = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const priorityColor = {
  high: "var(--state-missed)",
  medium: "var(--state-partial)",
  low: "var(--accent)",
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const emptyForm = {
  title: "",
  type: "task",
  time: "",
  priority: "medium",
  notes: "",
};

const getMonthGridDates = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) {
    cells.push(new Date(year, month, i - startWeekday + 1));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1];
    const next = new Date(last);
    next.setDate(last.getDate() + 1);
    cells.push(next);
  }
  return cells;
};

const getWeekDates = (date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

const isSameDay = (a, b) => toDateString(a) === toDateString(b);

const Calendar = () => {
  const [view, setView] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const today = new Date();

  const monthDates = useMemo(() => getMonthGridDates(selectedDate), [selectedDate]);
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  const rangeStart = view === "month" ? monthDates[0] : weekDates[0];
  const rangeEnd =
    view === "month" ? monthDates[monthDates.length - 1] : weekDates[6];
  const dayStart = selectedDate;

  const startStr =
    view === "day" ? toDateString(dayStart) : toDateString(rangeStart);
  const endStr = view === "day" ? toDateString(dayStart) : toDateString(rangeEnd);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchEvents({ startDate: startStr, endDate: endStr });
      setEvents(data);
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setLoading(false);
    }
  }, [startStr, endStr]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [events]);

  const dayEvents = eventsByDate[toDateString(selectedDate)] || [];

  const shift = (delta) => {
    const next = new Date(selectedDate);
    if (view === "day") next.setDate(next.getDate() + delta);
    else if (view === "week") next.setDate(next.getDate() + delta * 7);
    else next.setMonth(next.getMonth() + delta);
    setSelectedDate(next);
  };

  const goToday = () => setSelectedDate(new Date());

  const jumpToDay = (date) => {
    setSelectedDate(date);
    setView("day");
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    if (view !== "day") setView("day");
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setForm({
      title: item.title,
      type: item.type,
      time: item.time || "",
      priority: item.priority,
      notes: item.notes || "",
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      if (editingId) {
        await updateEvent(editingId, form);
      } else {
        await createEvent({ ...form, date: toDateString(selectedDate) });
      }
      setShowForm(false);
      loadEvents();
    } catch (err) {
      console.error("Failed to save event", err);
    }
  };

  const toggleComplete = async (item) => {
    try {
      await updateEvent(item._id, { completed: !item.completed });
      loadEvents();
    } catch (err) {
      console.error("Failed to update event", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      loadEvents();
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  const headerLabel = () => {
    if (view === "day") {
      return selectedDate.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }
    if (view === "week") {
      const start = weekDates[0];
      const end = weekDates[6];
      const sameMonth = start.getMonth() === end.getMonth();
      const startLabel = start.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      const endLabel = end.toLocaleDateString(undefined, {
        month: sameMonth ? undefined : "short",
        day: "numeric",
      });
      return `${startLabel} – ${endLabel}`;
    }
    return selectedDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content calendar-main">
        <div className="calendar-header">
          <div className="date-nav">
            <button onClick={() => shift(-1)} aria-label="Previous">‹</button>
            <span className="date-label">{headerLabel()}</span>
            <button onClick={() => shift(1)} aria-label="Next">›</button>
            <button className="date-today-btn" onClick={goToday}>Today</button>
          </div>

          <div className="view-switcher">
            <button
              className={view === "day" ? "active" : ""}
              onClick={() => setView("day")}
            >
              Day
            </button>
            <button
              className={view === "week" ? "active" : ""}
              onClick={() => setView("week")}
            >
              Week
            </button>
            <button
              className={view === "month" ? "active" : ""}
              onClick={() => setView("month")}
            >
              Month
            </button>
          </div>

          <button className="add-task-btn" onClick={openAddForm}>
            + Add
          </button>
        </div>

        {showForm && (
          <form className="task-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <div className="task-form-row">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="task">Task</option>
                <option value="event">Event</option>
                <option value="appointment">Appointment</option>
              </select>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <div className="task-form-actions">
              <button type="button" className="form-cancel" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="form-save">
                {editingId ? "Save changes" : "Add"}
              </button>
            </div>
          </form>
        )}

        {view === "month" && (
          <div className="month-grid">
            <div className="month-weekday-row">
              {WEEKDAY_LABELS.map((label) => (
                <div key={label} className="month-weekday">{label}</div>
              ))}
            </div>
            <div className="month-cells">
              {monthDates.map((date) => {
                const inMonth = date.getMonth() === selectedDate.getMonth();
                const dateItems = eventsByDate[toDateString(date)] || [];
                const isToday = isSameDay(date, today);
                return (
                  <div
                    key={date.toISOString()}
                    className={`month-cell ${inMonth ? "" : "outside"} ${isToday ? "today" : ""}`}
                    onClick={() => jumpToDay(date)}
                  >
                    <span className={`month-cell-date ${isToday ? "today-badge" : ""}`}>
                      {date.getDate()}
                    </span>
                    <div className="month-cell-events">
                      {dateItems.slice(0, 3).map((item) => (
                        <div
                          key={item._id}
                          className="month-event-pill"
                          style={{ "--priority-color": priorityColor[item.priority] }}
                        >
                          {item.title}
                        </div>
                      ))}
                      {dateItems.length > 3 && (
                        <div className="month-more">+{dateItems.length - 3} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === "week" && (
          <div className="week-grid">
            {weekDates.map((date) => {
              const dateItems = eventsByDate[toDateString(date)] || [];
              const isToday = isSameDay(date, today);
              return (
                <div
                  key={date.toISOString()}
                  className={`week-column ${isToday ? "today" : ""}`}
                  onClick={() => jumpToDay(date)}
                >
                  <div className="week-column-header">
                    <span className="week-weekday">
                      {date.toLocaleDateString(undefined, { weekday: "short" })}
                    </span>
                    <span className={`week-date ${isToday ? "today-badge" : ""}`}>
                      {date.getDate()}
                    </span>
                  </div>
                  <div className="week-column-events">
                    {dateItems.length === 0 && <span className="week-empty">—</span>}
                    {dateItems.map((item) => (
                      <div
                        key={item._id}
                        className={`week-event-pill ${item.completed ? "completed" : ""}`}
                        style={{ "--priority-color": priorityColor[item.priority] }}
                      >
                        {item.time && <span className="week-event-time">{item.time}</span>}
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === "day" && (
          <>
            {loading ? (
              <p className="empty-state">Loading…</p>
            ) : dayEvents.length === 0 ? (
              <p className="empty-state">Nothing on the books for this day.</p>
            ) : (
              <div className="task-list">
                {dayEvents.map((item) => (
                  <div
                    key={item._id}
                    className={`task-row ${item.completed ? "completed" : ""}`}
                    style={{ "--priority-color": priorityColor[item.priority] }}
                  >
                    <input
                      type="checkbox"
                      className="task-checkbox"
                      checked={item.completed}
                      onChange={() => toggleComplete(item)}
                    />
                    <div className="task-body">
                      <div className="task-title-row">
                        <span className="task-title">{item.title}</span>
                        <span className="task-type-tag">{item.type}</span>
                      </div>
                      <div className="task-meta">
                        {item.time && `${item.time} · `}
                        {item.priority} priority
                      </div>
                      {item.notes && <div className="task-notes">{item.notes}</div>}
                    </div>
                    <div className="task-actions">
                      <button onClick={() => openEditForm(item)}>Edit</button>
                      <button onClick={() => handleDelete(item._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Calendar;

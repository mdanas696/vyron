import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar.jsx";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../api/events.js";
import "./Dashboard.css";
import "./Calendar.css";

const toDateString = (d) => d.toISOString().split("T")[0];

const priorityColor = {
  high: "var(--state-missed)",
  medium: "var(--state-partial)",
  low: "var(--accent)",
};

const emptyForm = {
  title: "",
  type: "task",
  time: "",
  priority: "medium",
  notes: "",
};

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const dateStr = toDateString(selectedDate);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchEvents(dateStr);
      setItems(data);
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setLoading(false);
    }
  }, [dateStr]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const shiftDay = (delta) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + delta);
    setSelectedDate(next);
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
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
        await createEvent({ ...form, date: dateStr });
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

  const dateLabel = selectedDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <div className="calendar-header">
          <div className="date-nav">
            <button onClick={() => shiftDay(-1)} aria-label="Previous day">‹</button>
            <span className="date-label">{dateLabel}</span>
            <button onClick={() => shiftDay(1)} aria-label="Next day">›</button>
            <button className="date-today-btn" onClick={() => setSelectedDate(new Date())}>
              Today
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
              <button
                type="button"
                className="form-cancel"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="form-save">
                {editingId ? "Save changes" : "Add"}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="empty-state">Loading…</p>
        ) : items.length === 0 ? (
          <p className="empty-state">Nothing on the books for this day.</p>
        ) : (
          <div className="task-list">
            {items.map((item) => (
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
      </main>
    </div>
  );
};

export default Calendar;

import api from "./axios";

export const fetchEvents = (params) => api.get("/events", { params });
export const createEvent = (payload) => api.post("/events", payload);
export const updateEvent = (id, payload) => api.put(`/events/${id}`, payload);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

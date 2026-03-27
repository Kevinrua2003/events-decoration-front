import { Event } from "@/lib/types";
import api from "@/lib/axios";

export async function getEvents(): Promise<Event[]> {
    
    try {
        const response = await api.get('/events');
        return response.data;
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
}

export async function getEvent(eventId: number): Promise<Event> {
    
    try {
        const response = await api.get(`/events/${eventId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching event:", error);
        throw error;
    }
}

export async function createEvent(event: Event): Promise<Event> {
    try {
        const { id, ...eventData } = event;
        const response = await api.post('/events', eventData);
        return response.data;
    } catch (error) {
        console.error("Error creating event:", error);
        throw error;
    }
}

export async function deleteEvent(id: number): Promise<Event> {
    try {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting event:", error);
        throw error;
    }
}

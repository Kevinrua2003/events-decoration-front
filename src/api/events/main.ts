import { Event } from "@/lib/types";
import axios from "axios";

export async function getEvents(): Promise<Event[]> {
    
    try {
        const response = await axios.get(`${process.env.BACKEND}/events`);
        return response.data;
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
}

export async function createEvent(event: Event): Promise<Event> {
    try {
        const { id, ...eventData } = event;
        const response = await axios.post(`${process.env.BACKEND}/events`, eventData);
        return response.data;
    } catch (error) {
        console.error("Error creating event:", error);
        throw error;
    }
}

export async function deleteEvent(id: number): Promise<Event> {
    try {
        const response = await axios.delete(`${process.env.BACKEND}/events/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting event:", error);
        throw error;
    }
}

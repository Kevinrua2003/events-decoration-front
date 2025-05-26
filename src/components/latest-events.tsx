'use client'
import { getEvents } from '@/api/events/main';
import { Event, EventType } from '@/lib/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Skeleton } from './ui/skeleton';
import { LucideBriefcaseBusiness, LucideIcon, MoonStarIcon, PartyPopperIcon, SearchSlashIcon } from 'lucide-react';
import { format } from 'date-fns';

const eventTypeIcons = [
    {
        type: EventType.BIRTHDAY,
        icon: PartyPopperIcon
    },
    {
        type: EventType.CORPORATE,
        icon: LucideBriefcaseBusiness
    },
    {
        type: EventType.WEDDING,
        icon: MoonStarIcon
    },
    {
        type: EventType.OTHER,
        icon: SearchSlashIcon
    },
]

function LatestEventItem({ event }: { event: Event }) {
    const item = eventTypeIcons.find(x => x.type === event.type);

    return (
        <div className="flex items-center gap-4 p-4 m-0.5 bg-white rounded-lg shadow-md border border-gray-200">
            {item && <item.icon className="w-6 h-6" />} {/* Ícono con tamaño y color */}
            <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-800">{event.name.substring(0,30).concat(`${event.name.length >= 30 ? "..." : ""}`)}</span> {/* Nombre del evento */}
                <span className="text-sm text-gray-500">Personas: {event.amount}</span> {/* Cantidad de asistentes */}
                <span className="text-sm text-gray-400">{format(event.startDate, 'PP')}</span> {/* Fecha formateada */}
            </div>
        </div>
    );
}


function LatestEvents() {

    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        async function fetchEvents(){            
            const result = await getEvents();            
            const sorted = result.sort((x,y) => new Date(y.startDate).getTime() - new Date(x.startDate).getTime());
            const latestEvents: Event[] = sorted.slice(0,5);
            setEvents(latestEvents);
        }
        fetchEvents();
    }, []);

  return (
    <div className='flex flex-nowrap overflow-x-scroll lg:overflow-x-hidden justify-around'>
        {events.map((event) => {
            return (
                <div key={event.id}>
                    <LatestEventItem event={event}/>
                </div>
            )
        })}
    </div>
  )
}

export default LatestEvents;
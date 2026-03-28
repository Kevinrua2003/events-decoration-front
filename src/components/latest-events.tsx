'use client'
import { getEvents } from '@/api/events/main';
import { Event, EventType } from '@/lib/types';
import React, { useEffect, useState } from 'react'
import { LucideBriefcaseBusiness, MoonStarIcon, PartyPopperIcon, SearchSlashIcon } from 'lucide-react';
import { format } from 'date-fns';

const eventTypeIcons = [
    {
        type: EventType.BIRTHDAY,
        icon: PartyPopperIcon,
        color: 'text-orange-500'
    },
    {
        type: EventType.CORPORATE,
        icon: LucideBriefcaseBusiness,
        color: 'text-blue-500'
    },
    {
        type: EventType.WEDDING,
        icon: MoonStarIcon,
        color: 'text-pink-500'
    },
    {
        type: EventType.OTHER,
        icon: SearchSlashIcon,
        color: 'text-muted-foreground'
    },
]

function LatestEventItem({ event }: { event: Event }) {
    const item = eventTypeIcons.find(x => x.type === event.type);

    return (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer min-w-[180px]">
            {item && (
                <div className={`p-2 rounded-full bg-muted ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                </div>
            )}
            <div className="flex flex-col min-w-0">
                <span className="font-medium text-sm truncate">{event.name}</span>
                <span className="text-xs text-muted-foreground">{event.amount} personas</span>
                <span className="text-xs text-muted-foreground">{format(event.startDate, 'dd MMM')}</span>
            </div>
        </div>
    );
}


function LatestEvents() {

    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents(){            
            const result = await getEvents();            
            const sorted = result.sort((x,y) => new Date(y.startDate).getTime() - new Date(x.startDate).getTime());
            const latestEvents: Event[] = sorted.slice(0,5);
            setEvents(latestEvents);
            setLoading(false);
        }
        fetchEvents();
    }, []);

  return (
    <div>
        {loading ? (
            <div className="p-4 text-center text-muted-foreground">Cargando...</div>
        ) : events.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No hay eventos</div>
        ) : (
            <div className='flex gap-3 overflow-x-auto pb-2 -mx-2 px-2'>
                {events.map((event) => (
                    <LatestEventItem key={event.id} event={event}/>
                ))}
            </div>
        )}
    </div>
  )
}

export default LatestEvents;

'use client'
import { Event, EventType } from '@/lib/types';
import React from 'react'
import { LucideBriefcaseBusiness, MoonStarIcon, PartyPopperIcon, SearchSlashIcon } from 'lucide-react';
import { format } from 'date-fns';

const eventTypeIcons: Record<EventType, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
    [EventType.BIRTHDAY]: { icon: PartyPopperIcon, color: 'text-orange-500' },
    [EventType.CORPORATE]: { icon: LucideBriefcaseBusiness, color: 'text-blue-500' },
    [EventType.WEDDING]: { icon: MoonStarIcon, color: 'text-pink-500' },
    [EventType.OTHER]: { icon: SearchSlashIcon, color: 'text-muted-foreground' },
}

interface LatestEventItemProps {
    event: Event;
}

const LatestEventItem = React.memo(function LatestEventItem({ event }: LatestEventItemProps) {
    const { icon: Icon, color } = eventTypeIcons[event.type] || eventTypeIcons[EventType.OTHER];

    return (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer min-w-[180px]">
            <div className={`p-2 rounded-full bg-muted ${color}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
                <span className="font-medium text-sm truncate">{event.name}</span>
                <span className="text-xs text-muted-foreground">{event.amount} personas</span>
                <span className="text-xs text-muted-foreground">{format(event.startDate, 'dd MMM')}</span>
            </div>
        </div>
    );
});

interface LatestEventsProps {
    events?: Event[];
}

function LatestEvents({ events: initialEvents }: LatestEventsProps) {
    const events = initialEvents || [];

    if (events.length === 0) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                No hay eventos
            </div>
        );
    }

    return (
        <div className='flex gap-3 overflow-x-auto pb-2 -mx-2 px-2'>
            {events.map((event) => (
                <LatestEventItem key={event.id} event={event} />
            ))}
        </div>
    );
}

export default LatestEvents;

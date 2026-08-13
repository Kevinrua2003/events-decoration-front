'use client'
import { Event, EventType } from '@/lib/types';
import React, { memo, useMemo } from 'react'
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

const LatestEventItem = memo(function LatestEventItem({ event }: { event: Event }) {
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
});

function getLatestEvents(events: Event[], count: number): Event[] {
    const sorted = events
        .slice()
        .sort(
            (x, y) =>
                new Date(y.startDate).getTime() - new Date(x.startDate).getTime()
        );
    return sorted.slice(0, count);
}

function LatestEvents({ events, loading }: { events: Event[]; loading?: boolean }) {
    const latest = useMemo(() => getLatestEvents(events, 5), [events]);

    return (
        <div>
            {loading ? (
                <div className="p-4 text-center text-muted-foreground">Cargando...</div>
            ) : latest.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No hay eventos</div>
            ) : (
                <div className='flex gap-3 overflow-x-auto pb-2 -mx-2 px-2'>
                    {latest.map((event) => (
                        <LatestEventItem key={event.id} event={event}/>
                    ))}
                </div>
            )}
        </div>
    )
}

export default LatestEvents;

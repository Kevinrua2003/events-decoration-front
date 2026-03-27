'use client'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"  
import { format } from 'date-fns';
import { DeleteIcon, EyeIcon, PackagePlusIcon, PersonStandingIcon, SearchIcon, UserPlus2Icon } from 'lucide-react';
import Swal from 'sweetalert2';  
import { deleteEvent, getEvents } from '@/api/events/main';
import { Event } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Span from '@/components/Span';

interface EventRowProps {
    event: Event;
    onDelete: (id: number) => () => void;
    onViewDetails: () => void;
    onAddResources: () => void;
}

const EventRow = React.memo(function EventRow({ event, onDelete, onViewDetails, onAddResources }: EventRowProps) {
    return (
        <TableRow className="hover:bg-muted/50">
            <TableCell className="font-medium truncate max-w-[180px]">
                {event.name}
            </TableCell>
            <TableCell className="hidden md:table-cell text-center">
                {event.type}
            </TableCell>
            <TableCell className="hidden lg:table-cell text-center text-muted-foreground">
                {event.location}
            </TableCell>
            <TableCell className="text-center">
                {format(event.startDate, "dd MMM")}
            </TableCell>
            <TableCell className="hidden sm:table-cell text-center text-muted-foreground">
                {format(event.endDate, "dd MMM")}
            </TableCell>
            <TableCell className="text-center">
                <span className="inline-flex items-center gap-1">
                    {event.amount}
                    <PersonStandingIcon className="h-3 w-3 text-muted-foreground" />
                </span>
            </TableCell>
            <TableCell className="text-right">
                <div className='flex gap-1 justify-end'>
                    <button 
                        type='button'
                        title='Ver detalles'
                        className='p-2 rounded-md hover:bg-muted transition-colors'
                        onClick={onViewDetails}
                    >
                        <EyeIcon className="h-4 w-4 text-muted-foreground"/>
                    </button>
                    <button 
                        type='button'
                        title='Agregar recursos'
                        className='p-2 rounded-md hover:bg-muted transition-colors'
                        onClick={onAddResources}
                    >
                        <PackagePlusIcon className="h-4 w-4 text-muted-foreground"/>
                    </button>
                    <button 
                        type='button'
                        title='Eliminar'
                        className='p-2 rounded-md hover:bg-muted transition-colors'
                        onClick={onDelete(event.id)}
                    >
                        <DeleteIcon className="h-4 w-4 text-muted-foreground hover:text-destructive"/>
                    </button>
                </div>
            </TableCell>
        </TableRow>
    );
});

EventRow.displayName = 'EventRow';

function EventsPage() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const debouncedSearch = useMemo(() => {
        let timeoutId: NodeJS.Timeout;
        return (value: string) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setSearch(value), 300);
        };
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const response = await getEvents();
            setEvents(response);
            setLoading(false);
        };
        fetchEvents();
    }, []);

    const filteredEvents = useMemo(() => {
        if (!search) return events;
        const searchLower = search.toLowerCase();
        return events.filter(event => event.name.toLowerCase().includes(searchLower));
    }, [events, search]);

    const handleDelete = useCallback((id: number) => {
        return async () => {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esto",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
            });

            if (result.isConfirmed) {
                await deleteEvent(id);
                Swal.fire('Eliminado', 'El evento ha sido eliminado', 'success');
                setEvents(prev => prev.filter(event => event.id !== id));
            }
        };
    }, []);

    const handleViewDetails = useCallback(() => {
        Swal.fire("Implementar");
    }, []);

    const handleAddResources = useCallback((eventId: number) => {
        return () => router.push(`/dashboard/resources/${eventId}`);
    }, [router]);

    return (
        <div className="minimal-card">
            <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            type="text" 
                            placeholder="Buscar eventos..."
                            className="pl-9 w-full sm:w-64"
                            onChange={(e) => debouncedSearch(e.target.value)}
                        />
                    </div>
                </div>
                <Button onClick={() => router.push('/dashboard/new-event')} className="minimal-button">
                    <UserPlus2Icon className="h-4 w-4 mr-2" />
                    Nuevo Evento
                </Button>
            </div>
            
            {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                    Cargando...
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                    No hay eventos para mostrar
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[180px]">Evento</TableHead>
                                <TableHead className="hidden md:table-cell text-center">Tipo</TableHead>
                                <TableHead className="hidden lg:table-cell text-center">Ubicación</TableHead>
                                <TableHead className="text-center">Inicio</TableHead>
                                <TableHead className="hidden sm:table-cell text-center">Fin</TableHead>
                                <TableHead className="text-center">Invitados</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEvents.map((event) => (
                                <EventRow 
                                    key={event.id} 
                                    event={event} 
                                    onDelete={handleDelete}
                                    onViewDetails={handleViewDetails}
                                    onAddResources={handleAddResources(event.id)}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}

export default EventsPage

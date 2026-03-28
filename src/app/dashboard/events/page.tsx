'use client'
import React, { useEffect, useState } from 'react'
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

  function EventsPage() {

    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [data, setData] = useState<Event[]>([]);
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchEvents = async () => {
        setLoading(true);
        const response = await getEvents();
        setData(response);
        setEvents(response);
        setLoading(false);
      }
      fetchEvents();
    }, []);

    const handleSearch = (value: string) => {
      setSearch(value);
      if (value === '') {
        setEvents(data);
        return;
      }
      const filtered = data.filter((event) => 
        event.name.toLowerCase().includes(value.toLowerCase())
      );
      setEvents(filtered);
    };

    function onDelete(id: number) {
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
      }
    }

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
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
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
        ) : events.length === 0 ? (
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
                {events.map((event) => (
                  <TableRow key={event.id} className="hover:bg-muted/50">
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
                          onClick={() => Swal.fire("Implementar")}
                        >
                          <EyeIcon className="h-4 w-4 text-muted-foreground"/>
                        </button>
                        <button 
                          type='button'
                          title='Agregar recursos'
                          className='p-2 rounded-md hover:bg-muted transition-colors'
                          onClick={() => router.push(`/dashboard/resources/${event.id}`)}
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
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    )
  }

export default EventsPage

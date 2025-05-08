'use client'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableFooter,
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

  function EventsPage() {

    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [data, setData] = useState<Event[]>([]);
    const [search, setSearch] = useState<string>('');

    useEffect(() => {
      const fetchEvents = async () => {
        const response = await getEvents();
        setData(response);
        setEvents(response);
      }
      fetchEvents();
    }, []);

    useEffect(() => {
      const filterEvents = async () => {
        const aux = data.filter((event) => {
          const name = event.name.toLowerCase();
          return name.includes(search.toLowerCase());
        })
        setEvents(aux);
      };
      filterEvents();
    }, [search]);

    function onDelete(id: number) {
      return async () => {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
        });

        if (result.isConfirmed) {
          await deleteEvent(id);
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          setEvents(prev => prev.filter(event => event.id !== id));
        }
      }
    }

    return (
      <div className="m-3 border rounded-2xl shadow-sm md:shadow-xl overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-50px)]">
          <div className="flex w-auto items-center space-x-2 m-2">
            <SearchIcon/>
            <Input 
              type="text" 
              placeholder="Search events by name"
              onKeyUp={e => setSearch(e.currentTarget.value)}
              />
            <Button variant='default' onClick={() => router.push('/dashboard/new-event')}>
              <UserPlus2Icon/>
              <span className="text-sm">Add new event</span>
            </Button>
          </div>  
          <Table className="min-w-[800px] md:w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px] text-left">Event</TableHead>
                <TableHead className="hidden md:table-cell text-center">Type</TableHead>
                <TableHead className="hidden lg:table-cell text-center">Location</TableHead>
                <TableHead className="text-center">Start Date</TableHead>
                <TableHead className="hidden sm:table-cell text-center">End Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
                <TableHead className="text-right">Guests</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className=''>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium text-left truncate max-w-[180px]">
                    {event.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-center">
                    <span className="hidden sm:inline">{event.type}</span>
                    <span className="sm:hidden">{event.type.toString().slice(0,3)}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-center">
                    {event.location}
                  </TableCell>
                  <TableCell className="text-center">
                    {format(event.startDate, "MMM dd")}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    {format(event.endDate, "MMM dd")}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className='flex gap-2 justify-center'>
                      <button 
                        type='button'
                        title='Delete event'
                        className='p-1 rounded-md hover:bg-gray-100 transition-colors'
                        onClick={onDelete(event.id)}
                      >
                        <DeleteIcon className="h-4 w-4"/>
                      </button>
                      <button 
                        type='button'
                        title='Event details'
                        className='p-1 rounded-md hover:bg-gray-100 transition-colors'
                        onClick={() => Swal.fire("Implement")}
                      >
                        <EyeIcon className="h-4 w-4"/>
                      </button>
                      <button 
                        type='button'
                        title='Add resources to event'
                        className='p-1 rounded-md hover:bg-gray-100 transition-colors'
                        onClick={() => router.push(`/dashboard/resources/${event.id}`)}
                      >
                        <PackagePlusIcon className="h-4 w-4"/>
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className='flex items-center justify-end gap-2'>
                      {event.amount}<PersonStandingIcon />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {/* <TableFooter>
              <TableRow>
                <TableCell colSpan={6} className="text-lg hidden md:table-cell">
                  Total
                </TableCell>
                <TableCell colSpan={2} className="text-lg md:hidden">
                  Total
                </TableCell>
                <TableCell className="text-right">
                  ${events.reduce((sum, item) => sum + item.amount, 0)}
                </TableCell>
              </TableRow>
            </TableFooter> */}
          </Table>
        </div>
      </div>
    )
  }

export default EventsPage
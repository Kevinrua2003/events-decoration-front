'use client'
import { createEvent } from '@/api/events/main';
import ToggleItemsSelector from '@/components/toggle-items-selector';
import { Button } from '@/components/ui/button';
import { ComboboxDemo } from '@/components/ui/combobox';
import { DatePickerWithRange } from '@/components/ui/datepicker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Event, EventType, Location } from '@/lib/types';
import { addDays, format } from 'date-fns';
import { LucideBriefcaseBusiness, MoonStarIcon, PartyPopperIcon, PlusIcon, SearchSlashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { FormEvent } from 'react'
import { DateRange } from 'react-day-picker';
import Swal from 'sweetalert2';
import { injectSwalStyles } from '@/lib/swal-config';

const items = [
  { id: 1, name: EventType.WEDDING, icon: MoonStarIcon },
  { id: 2, name: EventType.BIRTHDAY, icon: PartyPopperIcon },
  { id: 3, name: EventType.CORPORATE, icon: LucideBriefcaseBusiness },
  { id: 4, name: EventType.OTHER, icon: SearchSlashIcon },
];

function CreateEvent() {
  const [location, setLocation] = React.useState("")
  const [selectedType, setSelectedType] = React.useState("")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = (data.get('name') as string).trim();
    const cant = (data.get('cant') as string).trim();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const missingFields = [];
    if (!name) missingFields.push("Event name");
    if (!cant) missingFields.push("Guests quantity");
    if (!dateRange?.from) missingFields.push("Start date");
    if (!dateRange?.to) missingFields.push("End date");
    if (!location) missingFields.push("Event place");
    if (!selectedType) missingFields.push("Event type");

    if (missingFields.length > 0) {
      injectSwalStyles();
      return Swal.fire({
        title: "Campos incompletos",
        text: `Por favor completa todos los campos requeridos: ${missingFields.join(', ')}`,
        icon: "error",
        confirmButtonColor: "#d4af37",
        background: "#1a1a1a",
        color: "#f5f5f0",
      });
    }

    if (isNaN(parseInt(cant, 10)) || parseInt(cant, 10) <= 0) {
      injectSwalStyles();
      return Swal.fire({
        title: "Cantidad inválida",
        text: "La cantidad de invitados debe ser un número mayor a 0",
        icon: "error",
        confirmButtonColor: "#d4af37",
        background: "#1a1a1a",
        color: "#f5f5f0",
      });
    }

    if(dateRange?.from === undefined || dateRange?.to === undefined) {
      injectSwalStyles();
      return Swal.fire({
        title: "Rango de fechas inválido",
        text: "Por favor selecciona un rango de fechas válido",
        icon: "error",
        confirmButtonColor: "#d4af37",
        background: "#1a1a1a",
        color: "#f5f5f0",
      });
    }

    const startDate = new Date(dateRange.from);
    startDate.setHours(0, 0, 0, 0);
    
    if (startDate < today) {
      injectSwalStyles();
      return Swal.fire({
        title: "Rango de fechas incorrecto",
        text: `La fecha de inicio no puede ser anterior a hoy: ${format(today, 'PP')}. Por favor selecciona otra fecha`,
        icon: "error",
        confirmButtonColor: "#d4af37",
        background: "#1a1a1a",
        color: "#f5f5f0",
      });
    }

    if (dateRange.from > dateRange.to) {
      injectSwalStyles();
      return Swal.fire({
        title: "Fechas inválidas",
        text: "La fecha final no puede ser anterior a la fecha de inicio",
        icon: "error",
        confirmButtonColor: "#d4af37",
        background: "#1a1a1a",
        color: "#f5f5f0",
      });
    }

    const event: Event = {
      id: 0,
      name,
      type: selectedType as EventType,
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
      location: location as Location,
      amount: Number(cant)
    };

    let createdEvent: Event;

    try {
      createdEvent = await createEvent(event);      
    } catch (error) {
      console.error("Error creating event:", error);
      injectSwalStyles();
      return Swal.fire({
        title: "Error",
        text: `${error}`,
        icon: "error",
        confirmButtonColor: "#d4af37",
        background: "#1a1a1a",
        color: "#f5f5f0",
      });      
    }

    injectSwalStyles();
    Swal.fire({
      title: "¡Nuevo Evento!",
      html: `
        <div class="text-left" style="color: #f5f5f0;">
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Invitados:</strong> ${cant}</p>
          <p><strong>Fechas:</strong> ${format(dateRange.from, 'PP')} - ${format(dateRange.to, 'PP')}</p>
          <p><strong>Ubicación:</strong> ${location}</p>
          <p><strong>Tipo:</strong> ${selectedType}</p>
        </div>
      `,
      icon: "success",
      confirmButtonColor: "#d4af37",
      background: "#1a1a1a",
      color: "#f5f5f0",
    });
    
    router.push(`../dashboard/resources/${createdEvent.id}`);
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 md:gap-2 m-1 md:m-1 p-3 md:p-5 shadow-xl md:shadow-2xl rounded-xl md:rounded-2xl">
          <div className="text-center text-2xl md:text-2xl">New Event</div>
          <Separator/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="grid gap-2 md:gap-3">
              <Label className="text-sm md:text-base" htmlFor="name">Event name</Label>
              <Input className="text-sm md:text-base" id="name" type="text" name="name" placeholder="My event"/>
              <Label className="text-sm md:text-base" htmlFor="cant">Guests quantity</Label>
              <Input className="text-sm md:text-base" id="cant" type="number" name="cant" placeholder="10"/>
            </div>
            <div className="grid gap-2 md:gap-3">
              <Label className="text-sm md:text-base" htmlFor="date-range">Range of days</Label>
              <DatePickerWithRange id='date' date={dateRange} onDateChange={setDateRange}/>
              <Label className="text-sm md:text-base" htmlFor="location">Event place</Label>
              <ComboboxDemo key="location" value={location} onValueChange={setLocation}/>
            </div>                
          </div>
          <div className="grid gap-2 md:gap-3 p-2 md:p-3 rounded-md border-2">
            <h2 className='text-center text-sm md:text-base'>Event type</h2>
            <ToggleItemsSelector items={items} value={selectedType} onValueChange={setSelectedType}/>
          </div>
          <Button className="w-full text-sm md:text-base" type="submit">
            <PlusIcon className="h-4 w-4 md:h-5 md:w-5"/>
            <span className="whitespace-normal">Add new event and select services for it!</span>
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateEvent;
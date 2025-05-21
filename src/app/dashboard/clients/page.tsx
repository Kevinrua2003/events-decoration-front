'use client'

import { deleteClient, getClients } from '@/api/clients/main'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Client, Employee } from '@/lib/types'
import { DeleteIcon, PencilIcon, SearchIcon, UserPlus2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import Swal from 'sweetalert2'

function Clients() {

  const router = useRouter();
  const [clients, setClients] = React.useState<Client[]>([]);
  const  [data, setData] = React.useState<Client[]>([]);
  const [search, setSearch] = React.useState<string>('');

  useEffect(() => {
    const fetchClients = async () => {
      const response = await getClients();
      setData(response);
      setClients(response);
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const filterClients = async () => {
      const aux = data.filter((client) => {
        const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
        const email = client.email.toLowerCase();
        return fullName.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
      })
      setClients(aux);
    };
    filterClients();
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
        await deleteClient(id);
        Swal.fire('Deleted!', 'Client has been deleted.', 'success');
        setClients(prev => prev.filter(event => event.id !== id));
      }
    }
  }

  return (
    <div className="m-1 border rounded-2xl shadow-sm md:shadow-xl overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-50px)]">
          <div className="flex w-auto items-center space-x-2 m-2">
            <SearchIcon/>
            <Input 
              type="text" 
              placeholder="Search clients by email or name"
              onKeyUp={e => setSearch(e.currentTarget.value)}
              />
          </div>          
          <Table className="min-w-[800px] md:w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px] text-left">Complete name</TableHead>
                <TableHead className="hidden md:table-cell text-center">Email</TableHead>
                <TableHead className="hidden lg:table-cell text-center">Phone</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium text-left truncate max-w-[180px]">
                    {client.firstName + ' ' + client.lastName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-center">
                    {client.email}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-center">
                    {client.phone}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className='flex gap-2 justify-center'>
                      <button 
                        type='button'
                        title='Delete client'
                        className='p-1 rounded-md hover:bg-gray-100 transition-colors'
                        onClick={onDelete(client.id)}
                      >
                        <DeleteIcon className="h-4 w-4"/>
                      </button>
                      <button 
                        type='button'
                        title='Update client data'
                        className='p-1 rounded-md hover:bg-gray-100 transition-colors'
                        onClick={() => router.push(``)}
                      >
                        <PencilIcon className="h-4 w-4"/>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
  )
}

export default Clients;
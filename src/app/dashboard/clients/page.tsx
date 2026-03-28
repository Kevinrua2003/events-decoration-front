'use client'

import { deleteClient, getClients } from '@/api/clients/main'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Client } from '@/lib/types'
import { DeleteIcon, PencilIcon, SearchIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import Span from '@/components/Span'

function Clients() {

  const [clients, setClients] = useState<Client[]>([]);
  const [data, setData] = useState<Client[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      const response = await getClients();
      setData(response);
      setClients(response);
      setLoading(false);
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
  }, [search, data]);

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
        await deleteClient(id);
        Swal.fire('Eliminado', 'El cliente ha sido eliminado', 'success');
        setClients(prev => prev.filter(client => client.id !== id));
      }
    }
  }

  return (
    <div className="minimal-card">
      <div className="p-4 border-b border-border">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Buscar clientes por nombre o email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">
          Cargando...
        </div>
      ) : clients.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No hay clientes para mostrar
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[200px]">Nombre</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Teléfono</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {client.firstName} {client.lastName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {client.email}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {client.phone}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className='flex gap-1 justify-end'>
                      <button 
                        type='button'
                        title='Editar'
                        className='p-2 rounded-md hover:bg-muted transition-colors'
                        onClick={() => Swal.fire("IMPLEMENTAR")}
                      >
                        <PencilIcon className="h-4 w-4 text-muted-foreground"/>
                      </button>
                      <button 
                        type='button'
                        title='Eliminar'
                        className='p-2 rounded-md hover:bg-muted transition-colors'
                        onClick={onDelete(client.id)}
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

export default Clients;

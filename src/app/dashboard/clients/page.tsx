'use client'

import { deleteClient, getClients } from '@/api/clients/main'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Client } from '@/lib/types'
import EditClientDialog from '@/components/edit-client-dialog'
import { DeleteIcon, PencilIcon, SearchIcon } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { confirmDelete, showSuccess } from '@/lib/swal-config'

function Clients() {

  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleClientSaved = (updated: Client) => {
    setClients(prev => prev.map(client => client.id === updated.id ? updated : client));
  };

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      const response = await getClients();
      setClients(response);
      setLoading(false);
    };
    fetchClients();
  }, []);

  // Derived during render: filtering never mutates the source list.
  const visibleClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return clients;
    return clients.filter((client) => {
      const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
      const email = client.email.toLowerCase();
      return fullName.includes(query) || email.includes(query);
    });
  }, [clients, search]);

  function onDelete(id: number) {
    return async () => {
      const confirmed = await confirmDelete();
      if (confirmed) {
        await deleteClient(id);
        showSuccess('¡Eliminado!', 'El cliente ha sido eliminado correctamente');
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
      ) : visibleClients.length === 0 ? (
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
              {visibleClients.map((client) => (
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
                        onClick={() => setEditingClient(client)}
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
        </div>        )}
      <EditClientDialog
        client={editingClient}
        open={!!editingClient}
        onOpenChange={(open) => !open && setEditingClient(null)}
        onSaved={handleClientSaved}
      />
    </div>
  )
}

export default Clients;

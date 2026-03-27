'use client'

import { deleteClient, getClients } from '@/api/clients/main'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Client } from '@/lib/types'
import { DeleteIcon, PencilIcon, SearchIcon } from 'lucide-react'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import Swal from 'sweetalert2'
import Span from '@/components/Span'

interface ClientRowProps {
    client: Client;
    onDelete: (id: number) => () => void;
    onEdit: () => void;
}

const ClientRow = React.memo(function ClientRow({ client, onDelete, onEdit }: ClientRowProps) {
    return (
        <TableRow className="hover:bg-muted/50">
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
                        onClick={onEdit}
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
    );
});

ClientRow.displayName = 'ClientRow';

function Clients() {
    const [clients, setClients] = useState<Client[]>([]);
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
        const fetchClients = async () => {
            setLoading(true);
            const response = await getClients();
            setClients(response);
            setLoading(false);
        };
        fetchClients();
    }, []);

    const filteredClients = useMemo(() => {
        if (!search) return clients;
        const searchLower = search.toLowerCase();
        return clients.filter(client => {
            const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
            const email = client.email.toLowerCase();
            return fullName.includes(searchLower) || email.includes(searchLower);
        });
    }, [clients, search]);

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
                await deleteClient(id);
                Swal.fire('Eliminado', 'El cliente ha sido eliminado', 'success');
                setClients(prev => prev.filter(client => client.id !== id));
            }
        };
    }, []);

    const handleEdit = useCallback(() => {
        Swal.fire("IMPLEMENTAR");
    }, []);

    return (
        <div className="minimal-card">
            <div className="p-4 border-b border-border">
                <div className="relative max-w-md">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        type="text" 
                        placeholder="Buscar clientes por nombre o email..."
                        className="pl-9"
                        onChange={(e) => debouncedSearch(e.target.value)}
                    />
                </div>
            </div>
            
            {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                    Cargando...
                </div>
            ) : filteredClients.length === 0 ? (
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
                            {filteredClients.map((client) => (
                                <ClientRow 
                                    key={client.id} 
                                    client={client}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}

export default Clients;

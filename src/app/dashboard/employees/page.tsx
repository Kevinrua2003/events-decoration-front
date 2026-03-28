'use client'

import { createEmployee, deleteEmployee, getEmployees } from '@/api/employees/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Employee } from '@/lib/types'
import { DeleteIcon, PencilIcon, SearchIcon, UserPlus2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { injectSwalStyles, showSuccess } from '@/lib/swal-config'

function page() {

  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [data, setData] = useState<Employee[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      const response = await getEmployees();
      setData(response);
      setEmployees(response);
      setLoading(false);
    };
    fetchEmployees();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value === '') {
      setEmployees(data);
      return;
    }
    const filtered = data.filter((employee) => {
      const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      const email = employee.email.toLowerCase();
      return fullName.includes(value.toLowerCase()) || email.includes(value.toLowerCase());
    });
    setEmployees(filtered);
  };

  function onDelete(id: number) {
    return async () => {
      injectSwalStyles();
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: '#1a1a1a',
        color: '#f5f5f0',
        confirmButtonColor: '#d4af37',
        cancelButtonColor: '#333333',
      });

      if (result.isConfirmed) {
        await deleteEmployee(id);
        showSuccess('¡Eliminado!', 'Empleado eliminado correctamente');
        setEmployees(prev => prev.filter(employee => employee.id !== id));
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
              placeholder="Buscar empleados..."
              className="pl-9 w-full sm:w-64"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={() => router.push("new-employee")}>
          <UserPlus2Icon className="h-4 w-4 mr-2" />
          Nuevo Empleado
        </Button>
      </div>
      
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">
          Cargando...
        </div>
      ) : employees.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No hay empleados para mostrar
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[200px]">Nombre</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Teléfono</TableHead>
                <TableHead className="text-center">Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {employee.email}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {employee.phone}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted">
                      {employee.role}
                    </span>
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
                        onClick={onDelete(employee.id)}
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

export default page

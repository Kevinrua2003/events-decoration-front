'use client'

import { createEmployee, deleteEmployee, getEmployees } from '@/api/employees/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Employee } from '@/lib/types'
import { DeleteIcon, PencilIcon, SearchIcon, UserPlus2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import Swal from 'sweetalert2'

function page() {

  const router = useRouter();
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const  [data, setData] = React.useState<Employee[]>([]);
  const [search, setSearch] = React.useState<string>('');

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await getEmployees();
      setData(response);
      setEmployees(response);
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filterEmployees = async () => {
      const aux = data.filter((employee) => {
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        const email = employee.email.toLowerCase();
        return fullName.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
      })
      setEmployees(aux);
    };
    filterEmployees();
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
        await deleteEmployee(id);
        Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
        setEmployees(prev => prev.filter(event => event.id !== id));
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
              placeholder="Search employees by email or name"
              onKeyUp={e => setSearch(e.currentTarget.value)}
              />
            <Button onClick={() => router.push("new-employee")} variant='default'>
            <UserPlus2Icon/>
            <span className="text-sm">Add new employee</span>
          </Button>
          </div>          
          <Table className="min-w-[800px] md:w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px] text-left">Complete name</TableHead>
                <TableHead className="hidden md:table-cell text-center">Email</TableHead>
                <TableHead className="hidden lg:table-cell text-center">Phone</TableHead>
                <TableHead className="text-center">Ocupation</TableHead>               
                <TableHead className="text-center">Credentials</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium text-left truncate max-w-[180px]">
                    {employee.firstName + ' ' + employee.lastName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-center">
                    {employee.email}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-center">
                    {employee.phone}
                  </TableCell>
                  <TableCell className="text-center">
                    {employee.role}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    User: {employee.username} <br/>
                    Password: {employee.password}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className='flex gap-2 justify-center'>
                      <button 
                        type='button'
                        title='Delete employee'
                        className='p-1 rounded-md hover:bg-gray-100 transition-colors'
                        onClick={onDelete(employee.id)}
                      >
                        <DeleteIcon className="h-4 w-4"/>
                      </button>
                      <button 
                        type='button'
                        title='Update employee data'
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

export default page
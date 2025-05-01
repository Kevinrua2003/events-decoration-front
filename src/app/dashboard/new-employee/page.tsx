'use client'
import { createEmployee } from '@/api/employees/main';
import ToggleItemsSelector from '@/components/toggle-items-selector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Employee, EmployeeRole } from '@/lib/types';
import { addDays } from 'date-fns';
import { CalculatorIcon, CrownIcon, HandshakeIcon, PlusIcon, UserIcon, UsersIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { FormEvent } from 'react'
import { DateRange } from 'react-day-picker';
import Swal from 'sweetalert2';

const items = [
  {
    id: 1,
    name: EmployeeRole.ACCOUNTING_MANAGER,
    icon: CalculatorIcon, 
  },
  {
    id: 2,
    name: EmployeeRole.CEO,
    icon: CrownIcon, 
  },
  {
    id: 3,
    name: EmployeeRole.HR_MANAGER,
    icon: UsersIcon, 
  },
  {
    id: 4,
    name: EmployeeRole.STAFF,
    icon: UserIcon, 
  },
  {
    id: 5,
    name: EmployeeRole.UNION_SECRETARY,
    icon: HandshakeIcon, 
  },
];

function CreateEmployee() {

  const [location, setLocation] = React.useState("")
  const [selectedType, setSelectedType] = React.useState("")
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
  
    const firstName = (data.get("name") as string).trim();
    const lastName = (data.get("lastname") as string).trim();
    const email = (data.get("email") as string).trim();
    const phone = (data.get("phone") as string).trim();
    const user = (data.get("user") as string).trim();
    const pass = (data.get("pass") as string).trim();
    const role = selectedType as EmployeeRole;
  
    const missingFields = [];
    if (!firstName) missingFields.push("First Name");
    if (!lastName) missingFields.push("Last Name");
    if (!email) missingFields.push("Email");
    if (!phone) missingFields.push("Phone");
    if (!user) missingFields.push("Username");
    if (!pass) missingFields.push("Password");
    if (!selectedType) missingFields.push("Role");
  
    if (missingFields.length > 0) {
      return Swal.fire({
        title: "Missing fields",
        text: `Please fill in all required fields: ${missingFields.join(', ')}`,
        icon: "error",
        confirmButtonColor: "black",
        iconColor: "black",
      });
    }
  
    if (!/^\d{8}$/.test(phone)) {
      return Swal.fire({
        title: "Invalid Phone",
        text: "Phone number must contain exactly 8 digits",
        icon: "error",
        confirmButtonColor: "black",
        iconColor: "black",
      });
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Swal.fire({
        title: "Invalid Email",
        text: "Please enter a valid email address",
        icon: "error",
        confirmButtonColor: "black",
        iconColor: "black",
      });
    }
  
    if (pass.length < 6) {
      return Swal.fire({
        title: "Weak Password",
        text: "Password must be at least 6 characters long",
        icon: "error",
        confirmButtonColor: "black",
        iconColor: "black",
      });
    }
  
    const employee: Employee = {
      id: 0,
      firstName,
      lastName,
      email,
      phone,
      role,
      username: user,
      password: pass
    };
    
    createEmployee(employee);
    
    Swal.fire({
      title: "Employee Created!",
      text: "The employee has been successfully registered",
      icon: "success",
      confirmButtonColor: "black",
      iconColor: "black",
    });
  
    router.push(`../dashboard/employees`);
  }

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-6 m-3 p-5 shadow-2xl rounded-2xl">
              <div className="relative text-center text-3xl">
                New Employee               
              </div>
              <Separator/>
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">First name</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Name"
                  />
                  <Label htmlFor="cant">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="email@gmail.com"
                  />
                  <Label htmlFor="name">Username</Label>
                  <Input
                    id="user"
                    type="text"
                    name="user"
                    placeholder="User name"
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="date-range">Last name</Label>
                  </div>
                  <Input
                    id="lastname"
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                  />
                  <Label htmlFor="location">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="55555555"
                  />
                  <Label htmlFor="name">Password</Label>
                  <Input
                    id="pass"
                    type="password"
                    name="pass"
                    placeholder="password"
                  />
                </div>                
              </div>
              <div className="grid gap-3 m-2 p-2 rounded-md border-2">
                  <h2 className='text-center text-black'>Ocupation</h2>
                  <ToggleItemsSelector key={"type"} items={items} value={selectedType} onValueChange={setSelectedType}/>
                </div>
                <Button className="w-full" type="submit">
                  <PlusIcon/>
                  Add new employee
                </Button>
            </div>
          </form>
    </div>
  )
}

export default CreateEmployee;
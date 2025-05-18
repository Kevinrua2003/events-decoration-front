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
  { id: 1, name: EmployeeRole.ACCOUNTING_MANAGER, icon: CalculatorIcon },
  { id: 2, name: EmployeeRole.CEO, icon: CrownIcon },
  { id: 3, name: EmployeeRole.HR_MANAGER, icon: UsersIcon },
  { id: 4, name: EmployeeRole.STAFF, icon: UserIcon },
  { id: 5, name: EmployeeRole.UNION_SECRETARY, icon: HandshakeIcon },
];

function CreateEmployee() {
  const [selectedType, setSelectedType] = React.useState("")
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

    router.push(`../dashboard/employees`);
    
    Swal.fire({
      title: "Employee Created!",
      text: "The employee has been successfully registered",
      icon: "success",
      confirmButtonColor: "black",
      iconColor: "black",
    });    
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 md:gap-6 m-3 p-4 md:p-5 shadow-xl md:shadow-2xl rounded-xl md:rounded-2xl">
          <div className="text-center text-2xl md:text-3xl">New Employee</div>
          <Separator/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="grid gap-2 md:gap-3">
              <Label className="text-sm md:text-base" htmlFor="name">First name</Label>
              <Input className="text-sm md:text-base" id="name" type="text" name="name" placeholder="Name"/>
              <Label className="text-sm md:text-base" htmlFor="email">Email</Label>
              <Input className="text-sm md:text-base" id="email" type="email" name="email" placeholder="email@gmail.com"/>
              <Label className="text-sm md:text-base" htmlFor="user">Username</Label>
              <Input className="text-sm md:text-base" id="user" type="text" name="user" placeholder="User name"/>
            </div>
            <div className="grid gap-2 md:gap-3">
              <Label className="text-sm md:text-base" htmlFor="lastname">Last name</Label>
              <Input className="text-sm md:text-base" id="lastname" type="text" name="lastname" placeholder="Last Name"/>
              <Label className="text-sm md:text-base" htmlFor="phone">Phone</Label>
              <Input className="text-sm md:text-base" id="phone" type="tel" name="phone" placeholder="55555555"/>
              <Label className="text-sm md:text-base" htmlFor="pass">Password</Label>
              <Input className="text-sm md:text-base" id="pass" type="password" name="pass" placeholder="password"/>
            </div>                
          </div>
          <div className="grid gap-2 md:gap-3 p-2 md:p-3 rounded-md border-2">
            <h2 className='text-center text-sm md:text-base'>Occupation</h2>
            <ToggleItemsSelector items={items} value={selectedType} onValueChange={setSelectedType}/>
          </div>
          <Button className="w-full text-sm md:text-base" type="submit">
            <PlusIcon className="h-4 w-4 md:h-5 md:w-5"/>
            Add new employee
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateEmployee;
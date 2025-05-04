import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum EventType {
  WEDDING = "WEDDING",
  BIRTHDAY = "BIRTHDAY",
  CORPORATE = "CORPORATE",
  OTHER = "OTHER",
}

export enum Location {
  PLAYA = 'PLAYA',
  SAN_MIGUEL_DEL_PADRON = 'SAN_MIGUEL_DEL_PADRON',
  PLAZA = 'PLAZA',
  HABANA_DEL_ESTE = 'HABANA_DEL_ESTE',
  CENTRO_HABANA = 'CENTRO_HABANA',
  DIEZ_DE_OCTUBRE = 'DIEZ_DE_OCTUBRE',
  CERRO = 'CERRO',
  HABANA_VIEJA = 'HABANA_VIEJA',
}

export enum EmployeeRole {
  CEO = "CEO",
  HR_MANAGER = "HR_MANAGER",
  ACCOUNTING_MANAGER = "ACCOUNTING_MANAGER",
  UNION_SECRETARY = "UNION_SECRETARY",
  STAFF = "STAFF",
}

export enum ResourceType {
  PRODUCT = "PRODUCT",
  SERVICE = "SERVICE",
}

export interface Product {
  id: number
  name: string
  price: number
  image: string
  providerId: number
}

export interface Service {
  id: number
  name: string
  price: number
  description: string
  providerId: number
}

export interface Event {
  id: number
  name: string
  type: EventType
  startDate: string
  endDate: string
  location: Location
  amount: number
}

export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  role: EmployeeRole
  username: string
  password: string
  
}

export interface Client {
  id: number
  firstName: string
  lastName: string
  email: string   
  phone: string
}

export interface Provider {
  id: number
  name: string
  phone: string
  email: string
}

export interface Contract {
  id: number
  clientId: number
  eventId: number
  createdAt: Date
}

export interface ContractItem {
  id: number
  contractId: number
  resourceId: number
  type: ResourceType
}

export interface ContractModifications {
  id: number
  contractId: number
  description: string
  modifiedAt: Date
}






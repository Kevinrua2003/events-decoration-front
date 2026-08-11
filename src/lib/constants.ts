import {
  CalculatorIcon,
  CrownIcon,
  HandshakeIcon,
  LucideBriefcaseBusiness,
  MoonStarIcon,
  PartyPopperIcon,
  SearchSlashIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"
import { EmployeeRole, EventType } from "./types"

export const eventTypeItems = [
  { id: 1, name: EventType.WEDDING, icon: MoonStarIcon },
  { id: 2, name: EventType.BIRTHDAY, icon: PartyPopperIcon },
  { id: 3, name: EventType.CORPORATE, icon: LucideBriefcaseBusiness },
  { id: 4, name: EventType.OTHER, icon: SearchSlashIcon },
]

export const employeeRoleItems = [
  { id: 1, name: EmployeeRole.ACCOUNTING_MANAGER, icon: CalculatorIcon },
  { id: 2, name: EmployeeRole.CEO, icon: CrownIcon },
  { id: 3, name: EmployeeRole.HR_MANAGER, icon: UsersIcon },
  { id: 4, name: EmployeeRole.STAFF, icon: UserIcon },
  { id: 5, name: EmployeeRole.UNION_SECRETARY, icon: HandshakeIcon },
]

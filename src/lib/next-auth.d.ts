import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {      
      id: number;
      email: string;
      username: string;
      role: EmployeeRole;
    };

    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}

import { JWT } from "next-auth/jwt";
import { EmployeeRole } from "./types";

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: number;
      email: string;
      username: string;
      role: EmployeeRole;
    };

    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}

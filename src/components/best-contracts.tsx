"use client";
import { getClients } from "@/api/clients/main";
import { getContractItems, getContracts } from "@/api/contracts/main";
import { getEvents } from "@/api/events/main";
import { Contract } from "@/lib/types";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { format } from "date-fns";

interface Props {
  contractId: number;
  clientName: string;
  eventName: string;
  money: number;
}

function BestContracts() {
  const [listItems, setListItems] = useState<Props[]>([]);

  useEffect(() => {
    async function fetchItems() {
      try {
        const [contracts, events, clients, contractItems] = await Promise.all([
          getContracts(),
          getEvents(),
          getClients(),
          getContractItems(),
        ]);

        const contractItemsMap = contractItems.reduce((acc, item) => {
          const currentSum = acc.get(item.contractId) || 0;
          acc.set(item.contractId, currentSum + item.price);
          return acc;
        }, new Map<number, number>());

        const eventsMap = new Map(events.map((event) => [event.id, event]));
        const clientsMap = new Map(
          clients.map((client) => [client.id, client])
        );

        const list = contracts.map((contract) => {
          const amount = contractItemsMap.get(contract.id) || 0;
          const event = eventsMap.get(contract.eventId);
          const client = clientsMap.get(contract.clientId);

          return {
            contractId: contract.id,
            clientName: client
              ? `${client.firstName} ${client.lastName}`
              : "not found",
            eventName: event ? event.name : "not found",
            money: amount,
          };
        });

        const sorted = list.sort((a, b) => b.money - a.money);
        setListItems(sorted.slice(0, 10));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchItems();
  }, []);

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Event</TableHead>
          <TableHead className="text-center">Client</TableHead>
          <TableHead className="text-center">Earned</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="">
        {listItems.map((item) => (
          <TableRow key={item.contractId}>
            <TableCell className="font-medium text-left truncate max-w-[180px]">
              {item.eventName}
            </TableCell>
            <TableCell className="hidden md:table-cell text-center">
              {item.clientName}
            </TableCell>
            <TableCell className="hidden lg:table-cell text-center">
              ${item.money}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default BestContracts;

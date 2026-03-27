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

interface Props {
  contractId: number;
  clientName: string;
  eventName: string;
  money: number;
}

function BestContracts() {
  const [listItems, setListItems] = useState<Props[]>([]);
  const [loading, setLoading] = useState(true);

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
              : "Sin cliente",
            eventName: event ? event.name : "Sin evento",
            money: amount,
          };
        });

        const sorted = list.sort((a, b) => b.money - a.money);
        setListItems(sorted.slice(0, 10));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="p-4 text-center text-muted-foreground">Cargando...</div>
      ) : listItems.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">No hay contratos</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Evento</TableHead>
              <TableHead className="hidden md:table-cell text-center">Cliente</TableHead>
              <TableHead className="text-right">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listItems.map((item) => (
              <TableRow key={item.contractId} className="hover:bg-muted/50">
                <TableCell className="font-medium truncate max-w-[150px]">
                  {item.eventName}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {item.clientName}
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${item.money.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default BestContracts;

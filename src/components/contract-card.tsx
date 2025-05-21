'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Client, Contract, ContractItem, ContractModifications, Event } from '@/lib/types';
import { getClient } from '@/api/clients/main';
import { getEvent } from '@/api/events/main';
import { getContractItems, getContractModifications } from '@/api/contracts/main';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-EN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

interface ContractCardProps {
  contract: Contract;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract }) => {
  const [items, setItems] = useState<ContractItem[]>([]);
  const [modifications, setModifications] = useState<ContractModifications[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [clientData, eventData, allItems, allMods] = await Promise.all([
          getClient(contract.clientId),
          getEvent(contract.eventId),
          getContractItems(),
          getContractModifications()
        ]);

        setClient(clientData);
        setEvent(eventData);
        setItems(allItems.filter(item => item.contractId === contract.id));
        setModifications(allMods.filter(mod => mod.contractId === contract.id));
      } catch (error) {
        console.error("Error fetching contract data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Card className="mb-4 shadow-lg transition-transform hover:scale-105">
      <CardHeader className="bg-gray-200 p-4">
        <h2 className="text-xl font-bold">Contrato #{contract.id}</h2>
        <p>Client: {client ? client.firstName + " " + client.lastName : contract.clientId}</p>
        <p>Event: {event ? event.name : contract.eventId}</p>
        <p>Created: {formatDate(contract.createdAt)}</p>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? 
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-slate-200" />
                <Skeleton className="h-4 w-[200px] bg-slate-200" />
            </div>
            :
            <>
                <Badge className='bg-slate-500'>Contract has {modifications.length} modifications</Badge> 
                <Badge className='bg-slate-500'>{items.length} resources has been contracted</Badge>
            </>
        }        
        <Button variant="default" disabled={loading} className='m-1'>
          {loading ? "...Please wait" :"Show details"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ContractCard;

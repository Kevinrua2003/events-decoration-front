'use client'
import { Suspense, useEffect, useState } from 'react';
import BestContracts from '@/components/best-contracts';
import EventsChart from '@/components/events-chart';
import LatestEvents from '@/components/latest-events';
import Span from '@/components/Span';
import { Skeleton } from '@/components/ui/skeleton';
import { getEvents } from '@/api/events/main';
import { getContracts, getContractItems } from '@/api/contracts/main';
import { getClients } from '@/api/clients/main';
import { Event, Contract, Client, ContractItem } from '@/lib/types';

function LatestEventsSkeleton() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="min-w-[180px] h-[72px] rounded-lg" />
      ))}
    </div>
  );
}

function BestContractsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );
}

function EventsChartSkeleton() {
  return <Skeleton className="h-[250px] w-full rounded-lg" />;
}

interface ContractData {
  contractId: number;
  clientName: string;
  eventName: string;
  money: number;
}

export default function Page() {
  const [latestEvents, setLatestEvents] = useState<Event[]>([]);
  const [bestContracts, setBestContracts] = useState<ContractData[]>([]);
  const [eventsByType, setEventsByType] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [events, contracts, clients, contractItems] = await Promise.all([
          getEvents(),
          getContracts(),
          getClients(),
          getContractItems(),
        ]);

        const sorted = events
          .sort((x, y) => new Date(y.startDate).getTime() - new Date(x.startDate).getTime())
          .slice(0, 5);
        setLatestEvents(sorted);

        const contractItemsMap = contractItems.reduce((acc, item) => {
          const currentSum = acc.get(item.contractId) || 0;
          acc.set(item.contractId, currentSum + item.price);
          return acc;
        }, new Map<number, number>());

        const eventsMap = new Map(events.map((e) => [e.id, e]));
        const clientsMap = new Map(clients.map((c) => [c.id, c]));

        const list = contracts.map((contract) => {
          const amount = contractItemsMap.get(contract.id) || 0;
          const event = eventsMap.get(contract.eventId);
          const client = clientsMap.get(contract.clientId);

          return {
            contractId: contract.id,
            clientName: client ? `${client.firstName} ${client.lastName}` : 'Sin cliente',
            eventName: event ? event.name : 'Sin evento',
            money: amount,
          };
        });

        setBestContracts(list.sort((a, b) => b.money - a.money).slice(0, 10));

        const eventCountByType = events.reduce((acc, event) => {
          acc[event.type] = (acc[event.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        setEventsByType(eventCountByType);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="minimal-card p-6">
        <Span text={'Eventos Recientes'} font={'lg'}/>
        <Suspense fallback={<LatestEventsSkeleton />}>
          <LatestEvents events={latestEvents} />
        </Suspense>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="minimal-card p-6">
          <Span text={'Contratos Destacados'} font={'md'}/>
          <Suspense fallback={<BestContractsSkeleton />}>
            <BestContracts initialData={bestContracts} />
          </Suspense>
        </div>
        <div className="minimal-card p-6">
          <Span text={'Eventos por Mes'} font={'md'}/>
          <Suspense fallback={<EventsChartSkeleton />}>
            <EventsChart initialData={eventsByType} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

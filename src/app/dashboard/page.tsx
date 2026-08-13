"use client";
import BestContracts from '@/components/best-contracts'
import LatestEvents from '@/components/latest-events'
import Span from '@/components/Span'
import { getClients } from '@/api/clients/main'
import { getContractItems, getContracts } from '@/api/contracts/main'
import { getEvents } from '@/api/events/main'
import { Client, Contract, ContractItem, Event } from '@/lib/types'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

// recharts is the heaviest dependency on the dashboard; load it only when
// the chart is about to render (client-side, since it needs the browser).
const EventsChart = dynamic(
  () => import('@/components/events-chart'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
        Cargando...
      </div>
    ),
  }
)

function Page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [contractItems, setContractItems] = useState<ContractItem[]>([]);
  const [loading, setLoading] = useState(true);

  // One parallel round-trip for every collection the dashboard needs; the
  // widgets render from these props instead of fetching on their own.
  useEffect(() => {
    async function loadDashboard() {
      try {
        const [eventsResult, contractsResult, clientsResult, itemsResult] =
          await Promise.all([
            getEvents(),
            getContracts(),
            getClients(),
            getContractItems(),
          ]);
        setEvents(eventsResult);
        setContracts(contractsResult);
        setClients(clientsResult);
        setContractItems(itemsResult);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <div className="minimal-card p-6">
        <Span text={'Eventos Recientes'} font={'lg'}/>
        <LatestEvents events={events} loading={loading} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="minimal-card p-6">
          <Span text={'Contratos Destacados'} font={'md'}/>
          <BestContracts
            contracts={contracts}
            events={events}
            clients={clients}
            contractItems={contractItems}
            loading={loading}
          />
        </div>
        <div className="minimal-card p-6">
          <Span text={'Eventos por Mes'} font={'md'}/>
          <EventsChart events={events} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default Page

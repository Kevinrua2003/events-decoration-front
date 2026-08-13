'use client'
import React, { useEffect, useMemo, useState } from 'react';
import ContractCard from '@/components/contract-card'
import { Client, Contract, ContractItem, ContractModifications, Event, Product, Service } from '@/lib/types';
import { getContracts } from '@/api/contracts/main';
import { getClients } from '@/api/clients/main';
import { getEvents } from '@/api/events/main';
import { getContractItems, getContractModifications } from '@/api/contracts/main';
import { getProducts } from '@/api/products/main';
import { getServices } from '@/api/services/main';
import { Skeleton } from '@/components/ui/skeleton';

const ContractsDashboard = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [items, setItems] = useState<ContractItem[]>([]);
  const [modifications, setModifications] = useState<ContractModifications[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // One parallel round-trip for everything the grid and its details need
        // (no N+1: resources are resolved once and shared by every card).
        const [
          contractsResult,
          clientsResult,
          eventsResult,
          itemsResult,
          modsResult,
          productsResult,
          servicesResult,
        ] = await Promise.all([
          getContracts(),
          getClients(),
          getEvents(),
          getContractItems(),
          getContractModifications(),
          getProducts(),
          getServices(),
        ]);
        setContracts(contractsResult);
        setClients(clientsResult);
        setEvents(eventsResult);
        setItems(itemsResult);
        setModifications(modsResult);
        setProducts(productsResult);
        setServices(servicesResult);
      } catch (error) {
        console.error("Error loading contracts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const clientsMap = useMemo(
    () => new Map(clients.map((client) => [client.id, client])),
    [clients]
  );
  const eventsMap = useMemo(
    () => new Map(events.map((event) => [event.id, event])),
    [events]
  );
  // Catalog lookups shared by the resource details of every contract card.
  const productsMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );
  const servicesMap = useMemo(
    () => new Map(services.map((service) => [service.id, service])),
    [services]
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contracts.map((contract) => (
        <ContractCard
          key={contract.id}
          contract={contract}
          client={clientsMap.get(contract.clientId)}
          event={eventsMap.get(contract.eventId)}
          items={items.filter((item) => item.contractId === contract.id)}
          modifications={modifications.filter(
            (mod) => mod.contractId === contract.id
          )}
          productsMap={productsMap}
          servicesMap={servicesMap}
        />
      ))}
    </div>
  );
};

export default ContractsDashboard;

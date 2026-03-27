'use server'
import { getData } from '@/lib/cache';
import { Contract, Event, Client, ContractItem, ContractModifications } from '@/lib/types';

export async function getDashboardData() {
  const [contracts, events, clients, contractItems, contractModifications] = await Promise.all([
    getData<Contract[]>('/contracts'),
    getData<Event[]>('/events'),
    getData<Client[]>('/clients'),
    getData<ContractItem[]>('/contract-items'),
    getData<ContractModifications[]>('/contract-modifications'),
  ]);

  return {
    contracts,
    events,
    clients,
    contractItems,
    contractModifications,
  };
}

export async function getLatestEvents() {
  const events = await getData<Event[]>('/events');
  return events
    .sort((x, y) => new Date(y.startDate).getTime() - new Date(x.startDate).getTime())
    .slice(0, 5);
}

export async function getBestContracts() {
  const [contracts, events, clients, contractItems] = await Promise.all([
    getData<Contract[]>('/contracts'),
    getData<Event[]>('/events'),
    getData<Client[]>('/clients'),
    getData<ContractItem[]>('/contract-items'),
  ]);

  const contractItemsMap = contractItems.reduce((acc, item) => {
    const currentSum = acc.get(item.contractId) || 0;
    acc.set(item.contractId, currentSum + item.price);
    return acc;
  }, new Map<number, number>());

  const eventsMap = new Map(events.map((event) => [event.id, event]));
  const clientsMap = new Map(clients.map((client) => [client.id, client]));

  const list = contracts.map((contract) => {
    const amount = contractItemsMap.get(contract.id) || 0;
    const event = eventsMap.get(contract.eventId);
    const client = clientsMap.get(contract.clientId);

    return {
      contractId: contract.id,
      clientName: client
        ? `${client.firstName} ${client.lastName}`
        : 'Sin cliente',
      eventName: event ? event.name : 'Sin evento',
      money: amount,
    };
  });

  return list.sort((a, b) => b.money - a.money).slice(0, 10);
}

export async function getEventsByType() {
  const events = await getData<Event[]>('/events');
  
  const eventCountByType = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return eventCountByType;
}

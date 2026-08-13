"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Client,
  Contract,
  ContractItem,
  ContractModifications,
  Event,
  Product,
  ResourceType,
  Service,
} from "@/lib/types";
import { Badge } from "./ui/badge";
import { SheetViewer } from "./sheet-generic-viewer";
import ResourceListItem from "./resource-list-item";

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

interface ContractCardProps {
  contract: Contract;
  client?: Client;
  event?: Event;
  items: ContractItem[];
  modifications: ContractModifications[];
  productsMap: Map<number, Product>;
  servicesMap: Map<number, Service>;
}

// Presentational: the parent page resolves all related data in parallel and
// passes it here, so rendering N cards does not trigger 4N API calls.
const ContractCard: React.FC<ContractCardProps> = ({
  contract,
  client,
  event,
  items,
  modifications,
  productsMap,
  servicesMap,
}) => {
  const resourceFor = (item: ContractItem) =>
    item.type === ResourceType.PRODUCT
      ? productsMap.get(item.resourceId)
      : servicesMap.get(item.resourceId);
  return (
    <Card className="minimal-card hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">Contrato #{contract.id}</h3>
            <p className="text-sm text-muted-foreground">
              {client ? `${client.firstName} ${client.lastName}` : `Cliente #${contract.clientId}`}
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDate(contract.createdAt)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Evento: {event ? event.name : `#${contract.eventId}`}
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">
            {items.length} recurso{items.length !== 1 ? 's' : ''}
          </Badge>
          {modifications.length > 0 && (
            <Badge variant="outline">
              {modifications.length} modificacion{modifications.length !== 1 ? 'es' : ''}
            </Badge>
          )}
        </div>
        <SheetViewer
          trigger={
            <Button variant="outline" size="sm" className="w-full">
              Ver detalles
            </Button>
          }
          title={<></>}
          body={
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Modificaciones</h4>
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  {modifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">
                      Sin modificaciones
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {modifications.map((mod) => (
                        <div
                          key={mod.id}
                          className="p-2 text-sm hover:bg-muted rounded transition-colors"
                        >
                          {mod.description}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Recursos Contratados</h4>
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">
                      Sin recursos contratados
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {items.map((item) => (
                        <ResourceListItem
                          item={item}
                          resource={resourceFor(item)}
                          key={item.id}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          }
          footer={<div className="mt-4"></div>}
        />
      </CardContent>
    </Card>
  );
};

export default ContractCard;

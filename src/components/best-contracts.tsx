"use client";
import React, { useMemo } from "react";
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

interface BestContractsProps {
  initialData?: Props[];
}

const TableRowComponent = React.memo(function TableRowComponent({ item }: { item: Props }) {
  return (
    <TableRow className="hover:bg-muted/50">
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
  );
});

TableRowComponent.displayName = 'TableRowComponent';

function BestContracts({ initialData }: BestContractsProps) {
  const listItems = useMemo(() => initialData || [], [initialData]);

  if (listItems.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No hay contratos
      </div>
    );
  }

  return (
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
          <TableRowComponent key={item.contractId} item={item} />
        ))}
      </TableBody>
    </Table>
  );
}

export default BestContracts;

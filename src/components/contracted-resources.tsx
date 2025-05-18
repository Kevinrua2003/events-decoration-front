import React from 'react'
import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';
import { Product, ResourceType, Service } from '@/lib/types';
import { Button } from './ui/button';
import { Sumana } from 'next/font/google';

interface ContractedResourcesProps {
    products: Product[]
    services: Service[]
}

function ContractedResources({products, services} : ContractedResourcesProps) {

  const total = products.reduce((acc, prod) => acc + prod.price, 0) + services.reduce((acc, serv) => acc + Number(serv.price), 0);

  return (
    <div>
        <div className="m-2 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            
        </div>
        <ScrollArea className='m-1 border rounded-2xl shadow-sm md:shadow-xl overflow-hidden overflow-x-auto overflow-y-auto max-h-[calc(35vh-20px)]'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='text-left'>CONTRACTED</TableHead>
                        <TableHead className='text-center'>RESOURCE TYPE</TableHead>
                        <TableHead className='text-right'>PRICE</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((prod) => (
                        <TableRow key={`product-${prod.id}`}>
                            <TableCell className=" text-left">{prod.name.substring(0,20) + `${prod.name.length > 20 ? "..." : ""}`}</TableCell>
                            <TableCell className='text-center'>{ResourceType.PRODUCT}</TableCell>
                            <TableCell className="text-right">${prod.price.toFixed(2)}</TableCell>
                        </TableRow>
                        ))}

                    {services.map((serv) => (
                        <TableRow key={`service-${serv.id}`}>
                            <TableCell className="text-left">{serv.name.substring(0,20) + `${serv.name.length > 20 ? "..." : ""}`}</TableCell>
                            <TableCell className='text-center'>{ResourceType.SERVICE}</TableCell>
                            <TableCell className="text-right">${Number(serv.price).toFixed(2)}</TableCell>
                        </TableRow>
                        ))}
                    <TableRow>
                        <TableCell className='font-bold'>Total</TableCell>
                        <TableCell className='font-bold'></TableCell>
                        <TableCell className='font-bold text-right'>
                            ${total}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </ScrollArea>
    </div>
  )
}

export default ContractedResources;
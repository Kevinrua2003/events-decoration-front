'use client'
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from 'next/navigation';
import { Product, Service } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import ClientData, { ContractedProduct, ContractedService } from '@/components/client-data';
import { getProducts } from '@/api/products/main';
import { getServices } from '@/api/services/main';
import { ScrollArea } from '@/components/ui/scroll-area';
import Swal from 'sweetalert2';
import ServiceItem from '@/components/service-item';
import ContractedResources, { ContractedResourceItem } from '@/components/contracted-resources';



function ProductsContainer({products, value, onValueChange}: {products: Product[], value: ContractedProduct[], onValueChange: (item: ContractedProduct[]) => void}){
  return (
    <ScrollArea className='h-[calc(110vh-200px)] w-full rounded-md border p-1'>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {products.map(item => (
          <ProductCard value={value} onValueChange={onValueChange} key={item.id} product={item}/>
        ))}
      </div>
    </ScrollArea>
  )
}

function ServicesContainer({services, value, onValueChange}: {services: Service[], value: ContractedService[], onValueChange: (value: ContractedService[]) => void}){
  return (
    <ScrollArea className='h-[calc(110vh-200px)] w-full rounded-md border p-1'>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 w-full">
        {services.map(item => (
          <ServiceItem value={value} onValueChange={onValueChange} key={item.id} service={item}/>
        ))}
      </div>
    </ScrollArea>
  )
}

function ResourcesPage() {
  const eventId = useParams()
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ContractedProduct[]>([]);
  const [selectedServices, setselectedServices] = useState<ContractedService[]>([]);


  useEffect(() => {
    const fetchResources = async () => {
      const productResponse = await getProducts();
      const serviceResponse = await getServices();
      setProducts(productResponse);
      setServices(serviceResponse);
    }
    fetchResources();
  }, []);

  useEffect(() => {
    Swal.fire({
      title: 'Select resources',
      text: 'Select the products or services you want to add to the event',
      icon: 'info',
      iconColor: 'black',
      confirmButtonColor: 'black'
    });
  }, [])

  const contractedProducts: ContractedResourceItem[] = selectedProducts
    .map((selected) => {
      const prod = products.find((p) => p.id === selected.prodId);
      return prod
        ? { id: prod.id, name: prod.name, price: prod.price, quantity: selected.quantity }
        : null;
    })
    .filter((item): item is ContractedResourceItem => item !== null);

  const contractedServices: ContractedResourceItem[] = selectedServices
    .map((selected) => {
      const serv = services.find((s) => s.id === selected.servId);
      return serv
        ? {id: serv.id, name: serv.name, price: Number(serv.price), quantity: selected.quantity }
        : null;
    })
    .filter((item): item is ContractedResourceItem => item !== null);

  return (
    <div className='flex flex-col lg:flex-row gap-4 p-1'>
      <div className='lg:flex-1'>
        <Tabs defaultValue="products">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="mt-1">
            <ProductsContainer value={selectedProducts} onValueChange={setSelectedProducts} products={products}/>
          </TabsContent>
          <TabsContent value="services" className="mt-4">
            <ServicesContainer value={selectedServices} onValueChange={setselectedServices} services={services}/>
          </TabsContent>
        </Tabs>
      </div>      
      <div className='lg:w-96 xl:w-[420px] sticky top-6 h-fit'>
        <ClientData eventId={Number(eventId.eventId)} productIds={selectedProducts} serviceIds={selectedServices}/>
        <ContractedResources products={contractedProducts} 
                             services={contractedServices}
        />
      </div>
    </div>
  )
}

export default ResourcesPage;
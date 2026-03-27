"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product, Provider, ResourceType, Service } from "@/lib/types";
import {
  createProvider,
  deleteProvider,
  getProviders,
} from "@/api/providers/main";
import { createService, deleteService, getServices } from "@/api/services/main";
import { createProduct, deleteProduct, getProducts } from "@/api/products/main";
import { Button } from "@/components/ui/button";
import {
  DeleteIcon,
  PencilIcon,
  PlusCircleIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function Page() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProviders() {
      setLoading(true);
      const data = await getProviders();
      setProviders(data);
      setLoading(false);
    }
    fetchProviders();
  }, []);

  useEffect(() => {
    async function fetchResources() {
      if (selectedProvider === null) {
        setProducts([]);
        setServices([]);
        return;
      }
      const [servicesData, productsData] = await Promise.all([
        getServices(),
        getProducts(),
      ]);
      setServices(
        servicesData.filter((serv) => serv.providerId === selectedProvider)
      );
      setProducts(
        productsData.filter((prod) => prod.providerId === selectedProvider)
      );
    }
    fetchResources();
  }, [selectedProvider]);

  const handleCreateProvider = async () => {
    const result = await Swal.fire({
      title: "Crear Proveedor",
      html: `
        <div class="flex flex-col gap-3">
          <input type="text" id="swal-input-name" class="swal2-input" placeholder="Nombre"/>
          <input type="text" id="swal-input-phone" class="swal2-input" placeholder="Teléfono"/>
          <input type="text" id="swal-input-email" class="swal2-input" placeholder="Email"/>
        </div>        
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Crear",
      preConfirm: () => {
        const name = (
          document.getElementById("swal-input-name") as HTMLInputElement
        )?.value;
        const phone = (
          document.getElementById("swal-input-phone") as HTMLInputElement
        )?.value;
        const email = (
          document.getElementById("swal-input-email") as HTMLInputElement
        )?.value;
        if (!name || !phone || !email) {
          Swal.showValidationMessage("Por favor completa todos los campos.");
          return;
        }
        return { name, phone, email };
      },
    });

    if (result.isConfirmed && result.value) {
      const { name, phone, email } = result.value;
      const newProvider: Provider = {
        id: 0,
        name,
        phone,
        email,
      };
      await createProvider(newProvider);
      Swal.fire("Creado", "Nuevo proveedor creado", "success");
      setProviders([...providers, newProvider]);
    }
  };

  const handleDeleteProvider = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      await deleteProvider(id);
      Swal.fire("Eliminado", "Proveedor eliminado", "success");
      setProviders(providers.filter((prov) => prov.id !== id));
      if (selectedProvider === id) {
        setSelectedProvider(null);
      }
    }
  };

  const handleCreateResource = async (providerId: number) => {
    const result = await Swal.fire({
      title: "Crear Recurso",
      html: `
      <div class="flex flex-col gap-3">
        <div class="flex justify-center gap-4 mb-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="resourceType" value="product" checked> Producto
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="resourceType" value="service"> Servicio
          </label>
        </div>
        <input type="text" id="swal-input-name" class="swal2-input" placeholder="Nombre">
        <input type="number" id="swal-input-price" class="swal2-input" placeholder="Precio">
        <input type="text" id="swal-input-image" class="swal2-input" placeholder="URL de imagen (solo productos)">
        <textarea id="swal-input-description" class="swal2-textarea" placeholder="Descripción (solo servicios)"></textarea>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Crear",
      preConfirm: () => {
        const resourceType = (
          document.querySelector(
            'input[name="resourceType"]:checked'
          ) as HTMLInputElement
        )?.value;
        const name = (
          document.getElementById("swal-input-name") as HTMLInputElement
        )?.value.trim();
        const price = (
          document.getElementById("swal-input-price") as HTMLInputElement
        )?.value.trim();
        
        if (!name || !price) {
          Swal.showValidationMessage("El nombre y precio son requeridos.");
          return;
        }

        if (resourceType === "product") {
          const image = (
            document.getElementById("swal-input-image") as HTMLInputElement
          )?.value.trim();
          return { resourceType, name, price, image };
        } else {
          const description = (
            document.getElementById(
              "swal-input-description"
            ) as HTMLTextAreaElement
          )?.value.trim();
          return { resourceType, name, price, description };
        }
      },
    });

    if (result.isConfirmed && result.value) {
      try {
        if (result.value.resourceType === "product") {
          const prod: Product = {
            id: 0,
            name: result.value.name,
            price: Number(result.value.price),
            image: result.value.image || '',
            providerId: providerId,
          };
          await createProduct(prod);
          setProducts([...products, prod]);
        } else {
          const serv: Service = {
            id: 0,
            name: result.value.name,
            price: Number(result.value.price),
            description: result.value.description || '',
            providerId: providerId,
          };
          await createService(serv);
          setServices([...services, serv]);
        }
        Swal.fire("Creado", "Recurso creado exitosamente", "success");
      } catch (error) {
        Swal.fire("Error", `Error al crear recurso: ${error}`, "error");
      }
    }
  };

  const onDeleteResource = useCallback(
    (id: number, isProduct: boolean) => async () => {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });
      if (result.isConfirmed) {
        isProduct ? await deleteProduct(id) : await deleteService(id);
        if (isProduct) {
          setProducts(products.filter(p => p.id !== id));
        } else {
          setServices(services.filter(s => s.id !== id));
        }
        Swal.fire("Eliminado", "Recurso eliminado", "success");
      }
    },
    [products, services]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="minimal-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Proveedores</h3>
            <Button size="sm" onClick={handleCreateProvider}>
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Nuevo
            </Button>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Cargando...
            </div>
          ) : providers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No hay proveedores
            </div>
          ) : (
            <div className="space-y-2">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedProvider === provider.id
                      ? 'border-primary bg-muted'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{provider.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProvider(provider.id);
                      }}
                      className="p-1 rounded hover:bg-muted"
                    >
                      <DeleteIcon className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="secondary" className="text-xs">{provider.phone}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="minimal-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">
              {selectedProvider 
                ? `Recursos - ${providers.find(p => p.id === selectedProvider)?.name}`
                : 'Selecciona un proveedor'}
            </h3>
            {selectedProvider && (
              <Button size="sm" variant="outline" onClick={() => handleCreateResource(selectedProvider)}>
                <PlusCircleIcon className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            )}
          </div>
          
          {!selectedProvider ? (
            <div className="p-8 text-center text-muted-foreground">
              Selecciona un proveedor para ver sus recursos
            </div>
          ) : products.length + services.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No hay recursos para mostrar
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="text-center">Precio</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Tipo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((prod) => (
                  <TableRow key={`product-${prod.id}`}>
                    <TableCell className="font-medium">{prod.name}</TableCell>
                    <TableCell className="text-center">${prod.price}</TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      <Badge>Producto</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={onDeleteResource(prod.id, true)}
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <DeleteIcon className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {services.map((serv) => (
                  <TableRow key={`service-${serv.id}`}>
                    <TableCell className="font-medium">{serv.name}</TableCell>
                    <TableCell className="text-center">${serv.price}</TableCell>
                    <TableCell className="text-center hidden md:table-cell">
                      <Badge variant="outline">Servicio</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={onDeleteResource(serv.id, false)}
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <DeleteIcon className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;

"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
  Delete,
  DeleteIcon,
  LucideDelete,
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
import { useRouter } from "next/navigation";

function Page() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<number>(-1);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const router = useRouter();

  useEffect(() => {
    async function fetchProviders() {
      const data = await getProviders();
      setProviders(data);
    }
    fetchProviders();
  }, []);

  useEffect(() => {
    async function fetchResources() {
      if (selectedProvider === -1) {
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
      title: "Create Provider",
      html: `
        <input type="text" id="swal-input-name" name="name" class="swal2-input" placeholder="Name"/>
        <input type="text" id="swal-input-phone" name="phone" class="swal2-input" placeholder="Phone"/>
        <input type="text" id="swal-input-email" name="email" class="swal2-input" placeholder="Email"/>
      `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      cancelButtonColor: "black",
      confirmButtonText: "Create",
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
          Swal.showValidationMessage("Please complete all fields.");
          return;
        }
        if (name.length < 3) {
          Swal.showValidationMessage("Name must be at least 3 characters.");
          return;
        }
        const phoneRegex = /^[0-9]{8,}$/;
        if (!phoneRegex.test(phone)) {
          Swal.showValidationMessage("Phone not valid. Length must be 8");
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          Swal.showValidationMessage("Email not valid.");
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
      Swal.fire("Created", "Now we have a new provider", "success");
      setProviders([...providers, newProvider]);
    }
  };

  const handleDeleteProvider = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this. Resources from this provider will be removed from system once all events that use them are finished",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });
    if (result.isConfirmed) {
      await deleteProvider(id);
      Swal.fire("Deleted!", `Provider has been deleted.`, "success");
    }
    setProviders(providers.filter((prov) => prov.id !== id));
  };

  const handleCreateResource = async (providerId: number) => {
    const result = await Swal.fire({
      title: "Create resource",
      html: `
      <div class="border border-black rounded-sm p-2">
        <div class="flex justify-center mb-2">
          <label class="mr-4">
            <input type="radio" name="resourceType" value="product" checked> Product
          </label>
          <label>
            <input type="radio" name="resourceType" value="service"> Service
          </label>
        </div>
        <input type="text" id="swal-input-name" class="swal2-input" placeholder="Name">
        <input type="number" id="swal-input-price" class="swal2-input" placeholder="Price">
      
        <div id="resource-product">
          <input type="text" id="swal-input-image" class="swal2-input" placeholder="Image URL">
        </div>
      
        <div id="resource-service" style="display: none;">
          <textarea id="swal-input-description" class="swal2-textarea" placeholder="Service description"></textarea>
        </div>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Create",
      confirmButtonColor: "black",
      cancelButtonColor: "red",
      preConfirm: () => {
        const errors: string[] = [];

        const resourceType = (
          document.querySelector(
            'input[name="resourceType"]:checked'
          ) as HTMLInputElement
        )?.value;
        if (!resourceType) {
          errors.push("Select a resource type.");
        }
        const name = (
          document.getElementById("swal-input-name") as HTMLInputElement
        )?.value.trim();
        if (!name) {
          errors.push("Resource needs a name.");
        }
        const price = (
          document.getElementById("swal-input-price") as HTMLInputElement
        )?.value.trim();
        if (!price || isNaN(Number(price))) {
          errors.push("There must be a price, and it must be numeric.");
        }
        if (resourceType === "product") {
          const image = (
            document.getElementById("swal-input-image") as HTMLInputElement
          )?.value.trim();
          if (!image) {
            errors.push("Product image needs an URL.");
          }
        } else if (resourceType === "service") {
          const description = (
            document.getElementById(
              "swal-input-description"
            ) as HTMLTextAreaElement
          )?.value.trim();
          if (!description) {
            errors.push("There must be a description for the service.");
          }
        }

        if (errors.length > 0) {
          Swal.showValidationMessage(
            `<ul class="text-left">${errors
              .map((error) => `<li>${error}</li>`)
              .join("")}</ul>`
          );
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
      didOpen: () => {
        const radioButtons = document.querySelectorAll(
          'input[name="resourceType"]'
        );
        radioButtons.forEach((radio) => {
          radio.addEventListener("change", (e) => {
            const selected = (e.target as HTMLInputElement).value;
            if (selected === "product") {
              (
                document.getElementById("resource-product") as HTMLElement
              ).style.display = "block";
              (
                document.getElementById("resource-service") as HTMLElement
              ).style.display = "none";
            } else {
              (
                document.getElementById("resource-product") as HTMLElement
              ).style.display = "none";
              (
                document.getElementById("resource-service") as HTMLElement
              ).style.display = "block";
            }
          });
        });
      },
    });

    if (result.isConfirmed && result.value) {
      try {
        if (result.value.resourceType === "product") {
          const prod: Product = {
            id: 0,
            name: result.value.name,
            price: Number(result.value.price),
            image: result.value.image,
            providerId: providerId,
          };
          await createProduct(prod);
          setProducts([...products, prod]);
        } else {
          const serv: Service = {
            id: 0,
            name: result.value.name,
            price: Number(result.value.price),
            description: result.value.description,
            providerId: providerId,
          };
          await createService(serv);
          setServices([...services, serv]);
        }
        Swal.fire("Created", `Resource has been created`, "success");
      } catch (error) {
        Swal.fire("Error", `There was an error creating resource: ${error}`, "error");
      }
    }
  };

  const onDeleteResource = useCallback(
    (id: number, isProduct: boolean) => async () => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      });
      if (result.isConfirmed) {
        isProduct ? await deleteProduct(id) : await deleteService(id);
        Swal.fire(
          "Deleted!",
          `${isProduct ? "Product" : "Service"} has been deleted.`,
          "success"
        );
      }
    },
    []
  );

  return (
    <div className="flex flex-col lg:flex-row gap-3 md:gap-2 m-1 p-5">
      <Carousel
        opts={{
          align: "start", dragFree: true,
        }}
        orientation="vertical"
        className="w-full max-w-xs self-center"
      >
        <CarouselContent className="-mt-1 h-[calc(85vh-50px)]">
          {providers.length === 0 ? (
            <div className="flex items-center justify-center p-4">
              <span className="text-lg font-semibold">
                No providers to show
              </span>
            </div>
          ) : (
            providers.map((provider) => (
              <CarouselItem
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id)}
                className="basis-1/3 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
              >
                <Card className="rounded-lg shadow transition-shadow duration-300 ease-in-out hover:shadow-lg">
                  <CardContent className="flex flex-col items-center justify-center p-1 space-y-4">
                    <span className="text-xl font-semibold">
                      {provider.name}
                    </span>
                    <div className="flex flex-wrap justify-center gap-1">
                      <Badge>{provider.phone}</Badge>
                      <Badge>{provider.email}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleCreateResource(provider.id)}
                        size="sm"
                        className="border border-black hover:bg-green-200"
                      >
                        <PlusCircleIcon className="mr-1" /> Resource
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteProvider(provider.id)}
                        size="sm"
                        className="border border-black hover:bg-red-300"
                      >
                        <DeleteIcon className="mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="flex flex-col w-full shadow lg:p-4 pt-15">
        <Button className="mb-3" onClick={handleCreateProvider}>
          <PlusCircleIcon /> New Provider
        </Button>
        {products.length + services.length === 0 ? (
          <div className="h-[calc(70vh-50px)] border border-black rounded-sm content-center text-center">
            No resources to show
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Resource name</TableHead>
                <TableHead className="text-center hidden md:table-cell">
                  Price
                </TableHead>
                <TableHead className="text-center hidden lg:table-cell">
                  Type
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((prod) => (
                <TableRow key={`product-${prod.id}`}>
                  <TableCell className="text-left truncate max-w-[180px]">
                    {prod.name}
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    {prod.price}
                  </TableCell>
                  <TableCell className="text-center hidden lg:table-cell">
                    {ResourceType.PRODUCT}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        title="Delete"
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                        onClick={onDeleteResource(prod.id, true)}
                      >
                        <DeleteIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Edit"
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                        onClick={() => router.push(``)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {services.map((serv) => (
                <TableRow key={`service-${serv.id}`}>
                  <TableCell className="text-left truncate max-w-[180px]">
                    {serv.name}
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    {serv.price}
                  </TableCell>
                  <TableCell className="text-center hidden lg:table-cell">
                    {ResourceType.SERVICE}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        title="Delete"
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                        onClick={onDeleteResource(serv.id, false)}
                      >
                        <DeleteIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Edit"
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                        onClick={() => router.push(``)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default Page;

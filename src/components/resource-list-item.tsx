'use client'
import { getProduct } from '@/api/products/main';
import { getService } from '@/api/services/main';
import { ContractItem, Product, ResourceType, Service } from '@/lib/types';
import React, { useEffect, useState } from 'react';

function ResourceListItem({ item }: { item: ContractItem }) {
  const [resource, setResource] = useState<Product | Service>();

  useEffect(() => {
    async function fetchResource() {
      const result =
        item.type === ResourceType.PRODUCT
          ? await getProduct(item.resourceId)
          : await getService(item.resourceId);
      setResource(result);
    }
    fetchResource();
  }, []);

  return (
    <div
      className="
        m-1 bg-white shadow border border-gray-200 rounded-lg 
        flex flex-col hover:shadow-lg transition-shadow duration-300
      "
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
        {resource?.name || 'Cargando...'}
      </h3>
      <div className="flex m-1 justify-between text-sm text-gray-600">
        <span>
          Price: <span className="font-medium text-gray-900">{resource?.price}</span>
        </span>
        <span>
          Quantity: <span className="font-medium text-gray-900">{item.quantity}</span>
        </span>
        <span>
          Total: <span className="font-medium text-gray-900">{item.price}</span>
        </span>
      </div>
    </div>
  );
}

export default ResourceListItem;

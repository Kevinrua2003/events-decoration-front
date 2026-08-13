'use client'
import { ContractItem, Product, Service } from '@/lib/types';
import React from 'react';

interface ResourceListItemProps {
  item: ContractItem;
  resource?: Product | Service;
}

function ResourceListItem({ item, resource }: ResourceListItemProps) {
  return (
    <div
      className="
        m-1 bg-white shadow border border-gray-200 rounded-lg 
        flex flex-col hover:shadow-lg transition-shadow duration-300
      "
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
        {resource?.name || `Recurso #${item.resourceId}`}
      </h3>
      <div className="flex m-1 justify-between text-sm text-gray-600">
        <span>
          Price: <span className="font-medium text-gray-900">{resource?.price ?? '—'}</span>
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

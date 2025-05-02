import { Service } from '@/lib/types';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@radix-ui/react-hover-card';
import React from 'react'

interface ServiceItemProps {
    service: Service
}

function ServiceItem({ service }: ServiceItemProps) {
  return (
    <HoverCard openDelay={300} closeDelay={200}>
      <HoverCardTrigger asChild>
        <div 
          role="button" 
          tabIndex={0}
          className="group grid grid-cols-2 md:grid-cols-4 gap-2 p-4 border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:bg-gray-50/50 cursor-pointer"
        >
          {/* Contenido existente sin cambios */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase">Service</p>
            <p className="font-medium text-gray-900 truncate">
              {service.name}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase">Price</p>
            <p className="font-semibold text-blue-600">
              ${Number(service.price).toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase">Provider ID</p>
            <p className="text-sm font-mono text-gray-600 truncate">
              #{service.providerId}
            </p>
          </div>

          <div className="space-y-1 col-span-2 md:col-span-1">
            <p className="text-xs font-semibold text-gray-500 uppercase">Description</p>
            <p className="text-sm text-gray-600 line-clamp-2">
              {service.description}
            </p>
          </div>
        </div>
      </HoverCardTrigger>

      <HoverCardContent 
        side="top" 
        align="center"
        sideOffset={8}
        className="max-w-[320px] rounded-md border bg-white p-4 shadow-lg animate-in fade-in zoom-in-95"
      >
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">{service.name}</h4>
          <p className="text-sm text-gray-600">{service.description}</p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-medium text-blue-600">
              ${Number(service.price).toLocaleString()}
            </span>
            <span className="text-xs font-mono text-gray-500">
              Provider: #{service.providerId}
            </span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default ServiceItem;
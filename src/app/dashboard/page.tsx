import BestContracts from '@/components/best-contracts'
import EventsChart from '@/components/events-chart'
import LatestEvents from '@/components/latest-events'
import Span from '@/components/Span'
import React from 'react'

function Page() {
  return (
    <div className="space-y-6">
      <div className="minimal-card p-6">
        <Span text={'Eventos Recientes'} font={'lg'}/>
        <LatestEvents />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="minimal-card p-6">
          <Span text={'Contratos Destacados'} font={'md'}/>
          <BestContracts />
        </div>
        <div className="minimal-card p-6">
          <Span text={'Eventos por Mes'} font={'md'}/>
          <EventsChart />
        </div>
      </div>
    </div>
  )
}

export default Page

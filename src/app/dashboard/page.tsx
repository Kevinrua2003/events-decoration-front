import BestContracts from '@/components/best-contracts'
import EventsChart from '@/components/events-chart'
import LatestEvents from '@/components/latest-events'
import Span from '@/components/Span'
import React from 'react'

function Page() {
  return (
    <div className="container mx-auto p-1">
      <div className="mb-2 shadow rounded-md p-4">
        <Span text={'Latest Events'} font={'xl'}/>
        <LatestEvents />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-slate-200 shadow rounded-md p-4">
          <Span text={'Best contracts made'} font={'md'}/>
          <BestContracts />
        </div>
        <div className="border border-slate-200 shadow rounded-md p-4">
          <Span text={'Events type per month'} font={'md'}/>
          <EventsChart />
        </div>
      </div>
    </div>
  )
}

export default Page

'use client'
import React, { Suspense, useEffect, useState } from 'react';
import ContractCard from '@/components/contract-card'
import { Contract } from '@/lib/types';
import { getContracts } from '@/api/contracts/main';
import { Skeleton } from '@/components/ui/skeleton';


const ContractsDashboard = () => {

  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    async function fetchContracts(){
      const result = await getContracts();
      setContracts(result)
    }
    fetchContracts();
  }, [contracts]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contracts.map((contract) => {
        return (
          <Suspense key={contract.id} fallback={<Skeleton/>}>
            <ContractCard            
            contract={contract}
          />
          </Suspense>
        );
      })}
    </div>
  );
};

export default ContractsDashboard;

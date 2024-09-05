'use client';

import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string';

interface CategoriesProps {
  data: Category[];
}

import React from 'react';

const Categories = ({ data }: { data: Category[] }) => {
  const router = useRouter();
  const params = useSearchParams();
  const categoryId = params.get('categoryId');
  const onClick = (id: string) => {
    const query = {
      categoryId:id
    }
    const url  = qs.stringifyUrl({
      url:window.location.href,
      query
    })

    router.push(url);
  }
  return (
    <div className='w-full overflow-x-auto space-x-2 flex p-1'>
      <button
        onClick={() => onClick('')}
        className={cn(
          `flex items-center text-center text-xs md:text:sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition`,!categoryId && 'bg-primary/25'
        )}
      >
        All
      </button>

      {data.map((category) => (
        <button
          onClick={() => onClick(category.id)}
          key={category.id}
          className={cn(
            `flex items-center text-center text-xs md:text:sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition`,
            categoryId === category.id ? 'bg-primary/25':'bg-primary/10'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default Categories;

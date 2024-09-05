'use client';

import { SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce'
import qs from 'query-string'

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const name = searchParams.get('name');


  const [value,setValue] = useState(name||'');
  const debouncedValue = useDebounce<string>(value, 1000);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    const query = {
      name:debouncedValue,
      categoryId:categoryId
    }
    const url = qs.stringifyUrl({
      url:window.location.href,
      query
    },{skipEmptyString:true,skipNull:true});
    router.push(url);
  }, [debouncedValue,router,categoryId]);

  return (
    <div className='relative'>
      <SearchIcon className='absolute h-4 w-4 top-3 left-4 text-muted-foreground' />
      <Input onChange={onChange} value={value} placeholder='Search...' className='pl-10 bg-primary/10' />
    </div>
  );
};

export default SearchInput;

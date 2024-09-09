'use client';

import { useEffect, useState } from 'react';
import { CldUploadButton } from 'next-cloudinary';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ImageUpload = ({ value, onChange, disabled }: ImageUploadProps) => {
  const [mounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  return (
    <div className='space-y-4 w-full flex flex-col justify-center items-center '>
      <CldUploadButton
      onSuccess={(res:any) => {onChange(res?.info?.secure_url)}}
        options={{
          maxFiles: 1,
        }}
        uploadPreset='f46nrip7'
      >
        <div className='p-4 border-4 border-dashed border-primary/10 roulded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center '>
          <div className='relative h-40 w-40'>
            <Image sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' fill alt='image' src={value||'/placeholder.svg'} className='rounded-lg object-cover'/>
          </div>
        </div>
      </CldUploadButton>
    </div>
  );
};

export default ImageUpload;

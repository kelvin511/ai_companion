'use client';

import { ChatRequestOptions } from 'ai';
import { Input } from './ui/input';
import { Button } from './ui/button'
import { SendHorizonal } from 'lucide-react'

interface ChatFormProps {
  input: string;
  isLoading: boolean;
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => void;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}
const ChatForm = ({
  input,
  isLoading,
  onSubmit,
  handleInputChange,
}: ChatFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className='border-t border-primary/10 py-4 flex items-center gap-x-2'
    >
      <Input disabled={isLoading} value={input} onChange={handleInputChange} placeholder='Send a message' className='rounded-sm  bg-primary/10' />
      <Button disabled={isLoading} variant={'ghost'} type='submit' ><SendHorizonal className='h-6 w-6'/></Button>
    </form>
  );
};

export default ChatForm;

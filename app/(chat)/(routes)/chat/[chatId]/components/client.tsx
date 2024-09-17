'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Companion, Message } from '@prisma/client';
import ChatHeader from './chat-header';
import { useCompletion } from 'ai/react';
import ChatForm from '@/components/chat-form'
import ChatMessages from '@/components/chat-messages'
import { ChatMessageProps } from '@/components/chat-message'

interface ChatClientProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    }
  };
};


const ChatClient = ({ companion }: ChatClientProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(companion.messages);
  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/companion/${companion.id}`,
      onFinish(prompt, completion) {
        const systemMessage :ChatMessageProps ={
          role: 'system',
          content: completion
        };
        setMessages((current)=>[...current, systemMessage]);
        setInput('');

        router.refresh();
      },
    });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const userMessage :ChatMessageProps ={
      role:'user',
      content:input
    }

    setMessages((current)=>[...current, userMessage]);
    handleSubmit(e);
  }
  return (
    <div className='flex flex-col h-full p-4 space-y-2'>
      <ChatHeader companion={companion} />
      <ChatMessages messages={messages} companion={companion} isLoading={isLoading}/>
      <ChatForm input={input} isLoading={isLoading} onSubmit={onSubmit} handleInputChange={handleInputChange}  />
    </div>
  );
};

export default ChatClient;

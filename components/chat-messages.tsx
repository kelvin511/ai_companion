'use client';

import { Companion, Message } from '@prisma/client'
import ChatMessage, { ChatMessageProps } from './chat-message'
import { useEffect, useRef, useState } from 'react'

interface ChatMessagesProps {
  companion: Companion ,
  messages: ChatMessageProps[],
  isLoading: boolean
}
const ChatMessages = ({companion, messages, isLoading}: ChatMessagesProps) => {
  const [fakeLoading, setFakeLoading] = useState(messages.length === 0? true : false);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false)
    },1000)

    return () => {
      clearTimeout(timeout)
    }
  },[])

  useEffect(() => {
      scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });

  }, [messages.length]);
  return (
    <div className='flex-1 h-full overflow-y-auto pr-4'>
      <ChatMessage isLoading={fakeLoading} src={companion.src} role={'system'} content={`Hello, I am ${companion.name}, ${companion.description}`} />
      {/* <ChatMessage   role={'user'} content={`Hello, I am ${companion.name}, ${companion.description}`} /> */}
      {messages.map((message, index) => (
        <ChatMessage key={index} role={message.role} content={message.content} src={message.src}  />
      ))}
      {isLoading && <ChatMessage isLoading src={companion.src} role={'system'}  />}
      <div ref={scrollRef}  />
    </div>
  )
}

export default ChatMessages
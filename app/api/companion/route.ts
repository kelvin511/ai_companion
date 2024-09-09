import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const user = await currentUser();
    const {src,name,description,instructions,seed,categoryId} = body;
    if(!user||!user.id||!user.firstName){
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if(!src||!name||!description||!instructions||!seed||!categoryId){
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Check for subcription
    const companion = await prisma.companion.create({
      data: {
        userName: user.firstName,
        src,
        name,
        description,
        instructions,
        seed,
        categoryId,
        userId: user.id
      }
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log(error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }

}
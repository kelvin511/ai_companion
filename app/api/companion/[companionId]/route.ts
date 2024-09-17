import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prismadb'

export const PATCH = async (request: Request, { params }: { params: { companionId: string } }) => {
  try {
    const body = await request.json();
    const user = await currentUser();
    const {src,name,description,instructions,seed,categoryId} = body;
    if(!params.companionId){
      return new NextResponse('Missing companionId', { status: 400 })
    }
    if(!user||!user.id||!user.firstName){
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if(!src||!name||!description||!instructions||!seed||!categoryId){
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Check for subcription
    const companion = await prisma.companion.update({
      where:{
        userId: user.id,
        id: params.companionId
      },
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


export const DELETE = async (request: Request, { params }: { params: { companionId: string } }) => {
  try {
    const user = await currentUser();
    if(!user||!user.id||!user.firstName){
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const companion = await prisma.companion.delete({
      where: {
        userId: user.id,
        id: params.companionId
      }
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log(error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
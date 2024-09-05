const PrismaClient = require("@prisma/client");

const db = new PrismaClient.PrismaClient();



async function main() {
  try {

    await db.category.createMany({
      data:[
        {
          name:'Famous People',
        },
        {
          name:'Bollywod',
        },
        {
          name:'Hollywood',
        },
        {
          name:'Cricketers',
        },
        {
          name:'Poiliticians',
        },
        {
          name:'Youtubers',
        },
        {
          name:'Singers',
        }
      ]
    })
  } catch (error) {
    console.log(error)
  }finally{
    await db.$disconnect()
  }
}

main()
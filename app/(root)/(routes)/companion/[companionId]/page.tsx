import prismadb from '@/lib/prismadb'
import CompanionForm from './companion/companion-form'
import { auth } from '@clerk/nextjs/server'

interface CompanionIdPage {
  params: {
    companionId: string
  }
}

const CompanionIdPage = async({params}: CompanionIdPage ) => {
  const {userId} = auth();
  if(!userId) return auth().redirectToSignIn();
  const compnanion = await prismadb.companion.findUnique({
    where: {
      userId ,
      id: params.companionId
    }
  })

  const categories = await prismadb.category.findMany();
  return (
    <CompanionForm
      initialData= {compnanion}
      categories={categories}
    />
  )
}

export default CompanionIdPage
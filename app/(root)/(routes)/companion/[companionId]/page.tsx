import prismadb from '@/lib/prismadb'
import CompanionForm from './companion/companion-form'

interface CompanionIdPage {
  params: {
    companionId: string
  }
}

const CompanionIdPage = async({params}: CompanionIdPage ) => {
  const compnanion = await prismadb.companion.findUnique({
    where: {
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
import { Autocomplete, TextField } from '@mui/material'
import MainLayout from '../layouts/MainLayout'
import CompetitorsInput from '@/components/CompetitorsInput'
import KeywordsInput from '@/components/KeywordsInput'
import GenerateButton from '@/components/GenerateButton'
import CompanyInput from '@/components/CompanyInput'

export default function Home() {
  return (
    <MainLayout>
      <div className="flex justify-center items-center w-full min-h-[90svh]">
        <div className="prose prose-base w-full">
          <h1>SEO App</h1>
          <CompanyInput />
          <CompetitorsInput />
          <KeywordsInput />
          <GenerateButton />
        </div>
      </div>
    </MainLayout>
  )
}

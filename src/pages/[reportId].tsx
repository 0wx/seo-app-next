import StackBars from '@/components/reports/Charts'
import CompanyKeywordReport from '@/components/reports/CompanyKeywordReport'
import CompetitorKeywordReport from '@/components/reports/CompetitorKeywordReport'
import KeywordsCluster from '@/components/reports/KeywordsCluster'
import KeywordsIdea from '@/components/reports/KeywordsIdea'
import MissingKeywords from '@/components/reports/MissingKeywords'
import { useReport } from '@/hooks/useReport'
import MainLayout from '@/layouts/MainLayout'
import { ReportInputData } from '@/libs/zod'
import { Divider } from '@mui/material'
import axios from 'axios'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { report } from 'process'
import React, { useEffect } from 'react'

export const getServerSideProps = (async (context) => {
  const { data } = await axios.get<ReportInputData>(
    'http://localhost:3000/api/reports/' + context.params?.reportId
  )
  return { props: data }
}) satisfies GetServerSideProps<ReportInputData>

const Report = (
  data: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { setReport } = useReport()

  useEffect(() => {
    setReport(data)
  }, [data])

  return (
    <MainLayout>
      <h1 className='text-4xl font-bold px-8 pt-8 pb-4'>SEO Report for {data.companyName}</h1>
      <Divider />
      <h2 className='text-2xl font-bold px-8 pt-8 pb-4'>Overview</h2>
      <StackBars />
      <h2 className='text-2xl font-bold px-8 pt-8 pb-4'>{data.companyName} - {data.companyWebsite}</h2>
      <CompanyKeywordReport />
      {data.competitors.map((v) => (
        <div>
          <h2 className='text-2xl font-bold px-8 pt-8 pb-4'>{v.competitorName} - {v.competitorWebsite}</h2>
        <CompetitorKeywordReport
          key={v.id}
          competitorName={v.competitorName}
          competitorWebsite={v.competitorWebsite}
          />
          </div>
      ))}
      <Divider />
      <MissingKeywords />
      <Divider />
      <KeywordsIdea />
      <Divider />
      <KeywordsCluster />
    </MainLayout>
  )
}

export default Report

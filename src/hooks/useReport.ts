import { atom, useAtom } from 'jotai'

import { type ReportInputData } from '@/libs/zod'
import { GridRowSelectionModel } from '@mui/x-data-grid'

const reportInputAtom = atom<ReportInputData | null>(null)

export const useReport = () => {
  const [report, setReport] = useAtom(reportInputAtom)

  const onNewKeyword = (e: GridRowSelectionModel) => {
    if(!report) return
    const newKeywords = e as string[]
    const newReport = { ...report }
    newKeywords.forEach((v) => {
      const keyword = newReport.keywords.find(
        (k) => k.keyword === v
      )
      if (!keyword)
        newReport.keywords.push({
          id: Math.random(),
          keyword: v,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          reportId: newReport.id,
        })
    })

    setReport(newReport)
  }

  return {
    report,
    setReport,
    onNewKeyword,
  }
}

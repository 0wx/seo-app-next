import { atom, useAtom } from 'jotai'
import { type CreateReport } from '../libs/zod'

const reportInputAtom = atom<CreateReport & { suggestedKeywords: string[] }>({
  companyName: '',
  companyWebsite: '',
  competitors: [],
  keywords: [],
  suggestedKeywords: [],
})

interface Competitor {
  competitorName: string
  competitorWebsite: string
}
export const useReportInput = () => {
  const [reportInput, setReportInput] = useAtom(reportInputAtom)

  const setCompanyName = (companyName: string) => {
    setReportInput((prev) => ({
      ...prev,
      companyName,
    }))
  }

  const setCompanyWebsite = (companyWebsite: string) => {
    setReportInput((prev) => ({
      ...prev,
      companyWebsite,
    }))
  }

  const addCompetitor = (competitor: Competitor) => {
    setReportInput((prev) => ({
      ...prev,
      competitors: [...prev.competitors, competitor],
    }))
  }

  const removeCompetitor = (competitor: Competitor) => {
    setReportInput((prev) => ({
      ...prev,
      competitors: prev.competitors.filter(
        (c) => c.competitorWebsite !== competitor.competitorWebsite
      ),
    }))
  }

  const clearKeywords = () => {
    setReportInput((prev) => ({
      ...prev,
      keywords: [],
    }))
  }

  const setCompetitor = (competitor: Competitor, index: number) => {
    setReportInput((prev) => {
      const competitors = [...prev.competitors]
      competitors[index] = competitor
      return {
        ...prev,
        competitors,
      }
    })
  }

  const addKeyword = (keyword: string) => {
    setReportInput((prev) => ({
      ...prev,
      keywords: [...prev.keywords, keyword],
    }))
  }

  const removeKeyword = (keyword: string) => {
    setReportInput((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }))
  }

  const setSuggestedKeywords = (suggestedKeywords: string[]) => {
    setReportInput((prev) => ({
      ...prev,
      suggestedKeywords,
    }))
  }

  const removeSuggestedKeyword = (keyword: string) => {
    setReportInput((prev) => ({
      ...prev,
      suggestedKeywords: prev.suggestedKeywords.filter((k) => k !== keyword),
    }))
  }



  return {
    reportInput,
    setCompanyName,
    setCompanyWebsite,
    addCompetitor,
    removeCompetitor,
    setCompetitor,
    addKeyword,
    removeKeyword,
    setSuggestedKeywords,
    removeSuggestedKeyword,
    clearKeywords,
  }
}

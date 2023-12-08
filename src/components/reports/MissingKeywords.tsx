import { useReport } from '@/hooks/useReport'
import { api } from '@/libs/axios'
import { ngrams } from '@/libs/ngram'
import { DomainKeyword } from '@/libs/zod'
import { Box } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { FC, useEffect, useMemo, useState } from 'react'

type MissingKeyword = Array<DomainKeyword['items'][number]>
const columns: GridColDef[] = [
  {
    field: 'keyword',
    headerName: 'Keyword',
    width: 250,
    renderHeader: () => <strong>Keyword</strong>,
  },
  {
    field: 'sources',
    headerName: 'Sources',
    width: 150,
    renderHeader: () => <strong>Sources</strong>,
    valueGetter(params) {
      return params.row.sources.join(', ')
    },
  },
  {
    field: 'occurences',
    headerName: 'Occurences',
    width: 150,
    align: 'center',
    headerAlign: 'center',
    renderHeader: () => <strong>Occurences</strong>,
  },
  {
    field: 'averageVolume',
    headerName: 'Volume',
    width: 150,
    align: 'center',
    headerAlign: 'center',
    renderHeader: () => <strong>Volume</strong>,
  },
  {
    field: 'averageDifficulty',
    headerName: 'KD',
    width: 150,
    align: 'center',
    headerAlign: 'center',
    renderHeader: () => <strong>KD</strong>,
  },
  {
    field: 'averagePosition',
    headerName: 'Position',
    width: 150,
    align: 'center',
    headerAlign: 'center',
    renderHeader: () => <strong>Position</strong>,
  },
]
const MissingKeywords: FC = () => {
  const { report, setReport, onNewKeyword } = useReport()
  const [ngramCount, setNgramCount] = useState<number>(2)
  const [companyKeywords, setCompanyKeywords] = useState<MissingKeyword>([])
  const [competitorKeywords, setCompetitorKeywords] = useState<MissingKeyword>(
    []
  )

  const getData = async () => {
    if (!report) return
    const { data: _companyKeywords } = await api.post<DomainKeyword>(
      '/keywords/domain',
      {
        domain: new URL(report.companyWebsite).host,
        limit: 200,
        sort: 'volume',
        sortOrder: 'DESC',
      }
    )
    const nonBrandedCompanyKeywords = _companyKeywords.items.filter(
      (v) => !v.keyword.includes(report.companyName)
    )

    setCompanyKeywords(nonBrandedCompanyKeywords)

    const _competitorKeywords = await Promise.all(
      report.competitors.map(async (v) => {
        const response = await api.post<DomainKeyword>('/keywords/domain', {
          domain: new URL(v.competitorWebsite).host,
          limit: 500,
          sort: 'position',
          sortOrder: 'ASC',
        })
        return {
          ...response.data,
          competitorName: v.competitorName,
          competitorWebsite: v.competitorWebsite,
        }
      })
    )

    const nonBrandedCompetitorKeywords = _competitorKeywords.flatMap((v) => {
      return v.items.filter((x) => !x.keyword.includes(v.competitorName))
    })
    setCompetitorKeywords(nonBrandedCompetitorKeywords)
  }

  const missingKeywords = useMemo(() => {
    const companyKeywordsNgrams = ngrams(companyKeywords, ngramCount)
    const competitorKeywordsNgrams = ngrams(competitorKeywords, ngramCount)

    const missingKeywords = competitorKeywordsNgrams
      .filter((v) => !companyKeywordsNgrams.includes(v))
      .map((v) => ({ ...v, id: v.keyword }))

    return missingKeywords
  }, [companyKeywords, competitorKeywords, ngramCount])

  useEffect(() => {
    getData()
  }, [report])

  return (
    <div className="p-4">
      <h2 className='text-2xl font-bold pt-8 pb-4'>Missing Keywords</h2>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={missingKeywords}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 100,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20, 50, 100, 200]}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={onNewKeyword}
        />
      </Box>
    </div>
  )
}

export default MissingKeywords

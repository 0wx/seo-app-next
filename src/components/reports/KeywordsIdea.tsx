import { useReport } from '@/hooks/useReport'
import { api } from '@/libs/axios'
import { DomainKeyword } from '@/libs/zod'
import { Box } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { FC, useEffect, useState } from 'react'

type Keyword = DomainKeyword['items'][number]
interface KeywordsIdea {
  data: {
    items: Array<Keyword>
  }
  total: number
  rows_limit: number
  partial: boolean
}

const columns: GridColDef[] = [
  {
    field: 'keyword',
    headerName: 'Keyword',
    width: 250,
    renderHeader: () => <strong>Keyword</strong>,
  },
  {
    field: 'volume',
    headerName: 'Volume',
    width: 150,
    align: 'center',
    headerAlign: 'center',
    renderHeader: () => <strong>Volume</strong>,
  },
  {
    field: 'difficulty',
    headerName: 'KD',
    width: 150,
    align: 'center',
    headerAlign: 'center',
    renderHeader: () => <strong>KD</strong>,
  },
  {
    field: 'competition',
    headerName: 'Competition',
    width: 150,
    align: 'center',
    headerAlign: 'center',
    renderHeader: () => <strong>Competition</strong>,
  },
  {
    field: 'trend',
    headerName: 'Trend',
    width: 150,
    align: 'center',
    headerAlign: 'center',
    renderHeader: () => <strong>Trend</strong>,
    renderCell: (params) => {
      const trend = params.row.volume_history
      return <div dangerouslySetInnerHTML={{ __html: trend }}></div>
    },
  },
]

const KeywordsIdea: FC = () => {
  const [rows, setRows] = useState<Keyword[]>([])
  const { report, onNewKeyword } = useReport()
  const getData = async () => {
    if (!report) return
    const data = await Promise.all(
      report.keywords.map((v) =>
        api.post<KeywordsIdea>('/keywords/ideas', {
          keyword: v.keyword,
          limit: 100,
          source: 'sg',
        })
      )
    )
    const keywords = data
      .flatMap((v) => v.data.data.items)
      .map((v) => ({ ...v, id: v.keyword }))
    setRows(keywords)
  }

  useEffect(() => {
    getData()
  }, [report])

  return (
    <div className="p-4">
      <h2 className='text-2xl font-bold pt-8 pb-4'>Keywords Idea</h2>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
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

export default KeywordsIdea

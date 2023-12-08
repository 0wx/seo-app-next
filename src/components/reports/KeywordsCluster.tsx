import { useReport } from '@/hooks/useReport'
import { api } from '@/libs/axios'
import { DomainKeyword } from '@/libs/zod'
import { Box } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { FC, useEffect, useState } from 'react'
import PotentialRevenue from './PotentialRevenue'

export type Keyword = DomainKeyword['items'][number] & {
  selected: boolean
  id: string
}
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

const KeywordsCluster: FC = () => {
  const [rows, setRows] = useState<Keyword[][]>([])
  const { report, setReport, onNewKeyword } = useReport()
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
    const keywords = data.map((k) =>
      k.data.data.items.map((v) => ({ ...v, id: v.keyword, selected: false }))
    )
    setRows(keywords)
  }

  useEffect(() => {
    getData()
  }, [report, report?.keywords])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold pt-8 pb-4 my-4">Keywords Cluster</h2>
      {report &&
        rows.map((k, i) => {
          const keyword = report.keywords[i]
          return (
            <div key={i} className="flex flex-col gap-4 mb-5">
              <h2 className="text-xl capitalize">{keyword?.keyword}</h2>
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={rows[i]}
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
                  onRowSelectionModelChange={(e) => {
                    const selected = e as string[]
                    const newRows = rows.map((r, j) => {
                      if (i === j) {
                        return r.map((v) => {
                          return {
                            ...v,
                            selected: selected.includes(v.id),
                          }
                        })
                      }
                      return r
                    })

                    setRows(newRows)
                  }}
                />
              </Box>

              {rows[i].some((v) => v.selected) && (
                <PotentialRevenue
                  keywords={rows[i].filter((v) => v.selected)}
                />
              )}
            </div>
          )
        })}
    </div>
  )
}

export default KeywordsCluster

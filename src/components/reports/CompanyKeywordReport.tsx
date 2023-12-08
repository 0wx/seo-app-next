import React, { FC, useEffect, useState } from 'react'
import MainLayout from '../../layouts/MainLayout'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { useReportInput } from '@/hooks/useReportInput'
import { useReport } from '@/hooks/useReport'
import { api } from '@/libs/axios'
import { DomainKeyword, DomainReport } from '@/libs/zod'


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
    field: 'cpc',
    headerName: 'CPC',
    width: 150,
    align: 'center',
    headerAlign: 'center',
    renderHeader: () => <strong>CPC</strong>,
  },
  {
    field: 'position',
    headerName: 'Position',
    width: 150,
    align: 'center',
    headerAlign: 'center',
    renderHeader: () => <strong>Position</strong>,
  },
]

const CompanyKeywordReport: FC = () => {
  const [value, setValue] = useState<string>('1')
  const [rows, setRows] = useState<
    Array<DomainKeyword['items'][number] & { branded: boolean; id: string }>
  >([])
  const { report, onNewKeyword } = useReport()

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  useEffect(() => {
    if (report)
      api
        .post<DomainKeyword>('/keywords/domain', {
          domain: new URL(report.companyWebsite).host,
          limit: 500,
          sort: 'position',
          sortOrder: 'ASC',
        })
        .then(({ data }) => {
          setRows(
            data.items.map((v) => {
              const branded = v.keyword.includes(
                report?.companyName.toLowerCase() || ''
              )
              return {
                ...v,
                branded,
                id: v.keyword,
              }
            })
          )
        })
  }, [report?.data])
  return (
    <>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ paddingX: 5 }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Non-branded Keywords" value="1" />
              <Tab label="Branded Keywords" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows.filter((v) => !v.branded)}
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
          </TabPanel>
          <TabPanel value="2">
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows.filter((v) => v.branded)}
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
          </TabPanel>
        </TabContext>
      </Box>
    </>
  )
}

export default CompanyKeywordReport

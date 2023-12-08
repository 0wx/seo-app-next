import * as React from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import { useReport } from '@/hooks/useReport'
import { api } from '@/libs/axios'
import { DomainKeyword, DomainReport } from '@/libs/zod'

interface TimeSeries {
  data: number[]
  stack: string
  label: string
}

const StackBars = () => {
  const { report } = useReport()
  const [data, setData] = React.useState<TimeSeries[]>([])

  const getData = async () => {
    if (!report) return

    const list = [
      { website: report.companyWebsite, name: report.companyName },
      ...report.competitors.map((v) => ({
        website: v.competitorWebsite,
        name: v.competitorName,
      })),
    ]

    const timeSeries = Array.from(Array(6))
      .map((_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        return `${date.getFullYear()}-${date.getMonth() + 1}`
      })
      .reverse()

    const response = await Promise.all(
      list.map(async (v) => {
        let result: Array<
          DomainKeyword['items'][number] & { branded: boolean; time: string; name: string }
        > = []
        for (let time of timeSeries) {
          const { data } = await api.post<DomainKeyword>('/keywords/domain', {
            domain: new URL(v.website).host,
            limit: 500,
            sort: 'position',
            sortOrder: 'ASC',
            month: time,
          })

          result = [
            ...result,
            ...data.items.map((x) => {
              const branded = x.keyword.includes(v.name.toLowerCase())
              return {
                ...x,
                branded,
                time,
                name: v.name,
              }
            }),
          ]
        }

        return {
          ...v,
          data: result,
        }
      })
    )

    const timeSeriesData = list.flatMap((v, i) => {
      const brandedLabel = `${v.name} Branded Keywords`
      const nonBrandedLabel = `${v.name} Non-Branded Keywords`

      const brandedData = response
        .find((x) => x.name === v.name)
        ?.data.filter((v) => v.branded)
      const nonBrandedData = response
        .find((x) => x.name === v.name)
        ?.data.filter((v) => !v.branded)

      const branded = timeSeries.map((v) => {
        const data = brandedData?.filter((x) => x.time === v)
        return data?.length || 0
      })

      const nonBranded = timeSeries.map((v) => {
        const data = nonBrandedData?.filter((x) => x.time === v)
        return data?.length || 0
      })

      return [
        {
          data: branded,
          stack: v.name,
          label: brandedLabel,
        },
        {
          data: nonBranded,
          stack: v.name,
          label: nonBrandedLabel,
        },
      ]
    })

    setData(timeSeriesData)
  }

  React.useEffect(() => {
    getData()
  }, [report])

  return <BarChart series={data} height={350} />
}

export default StackBars

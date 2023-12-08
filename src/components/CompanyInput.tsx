import { useReportInput } from '../hooks/useReportInput'
import { api } from '../libs/axios'
import { TextField } from '@mui/material'
import React, { FC, useEffect, useState } from 'react'
import { DomainReport } from '../libs/zod'

const CompanyInput: FC = () => {
  const {
    setCompanyName,
    setCompanyWebsite,
    reportInput,
    setSuggestedKeywords,
  } = useReportInput()
  const [error, setError] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        if (!reportInput.companyWebsite) return
        const url = new URL(reportInput.companyWebsite)
        api
          .get<DomainReport>(`/domains/${url.hostname}`)
          .then((res) => {
            const keywords = res.data.keywords
              .slice(0, 5)
              .map((keyword) => keyword.keyword)
            setSuggestedKeywords(keywords)
          })
          .catch((err) => {
            setError(true)
          })
      } catch (error) {
        setError(true)
      }
    }, 5000)

    return () => clearTimeout(timeout)
  }, [reportInput.companyWebsite])
  return (
    <div className="flex flex-col gap-2 my-8">
      <b>Your Company</b>
      <TextField
        placeholder="Acme Inc"
        label="Company Name"
        variant="standard"
        className="w-full"
        onChange={(e) => setCompanyName(e.target.value)}
      />
      <TextField
        placeholder="https://acme.com"
        label="Company Website"
        variant="standard"
        className="w-full"
        onChange={(e) => setCompanyWebsite(e.target.value)}
        error={error}
      />
    </div>
  )
}

export default CompanyInput

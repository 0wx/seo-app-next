import { useReportInput } from '@/hooks/useReportInput'
import React, { FC, useState } from 'react'
import { useRouter } from 'next/router'

const GenerateButton: FC = () => {
  const { reportInput } = useReportInput()
  const [generated, setGenerated] = useState(false)
  const router = useRouter()

  const generate = async () => {
    if (!reportInput.companyName) return alert('Please enter your company name')
    if (!reportInput.companyWebsite)
      return alert('Please enter your company website')
    if (reportInput.keywords.length < 1)
      return alert('Please enter your keywords')
    if (reportInput.competitors.length < 1)
      return alert('Please enter your competitors')
    
    setGenerated(true)
    const res = await fetch('/api/reports', {
      method: 'POST',
      body: JSON.stringify(reportInput),
    })
    const data = await res.json()
    router.push('/' + data.id)
  }

  return (
    <button
      className="bg-gradient-to-r from-blue-500 via-blue-400 to-red-500 text-white font-bold flex items-center gap-2 px-4 py-2 rounded-md mt-4 transition-all background-animate active:scale-95"
      onClick={() => {
        generate()
      }}
    >
      Generate
      {generated ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 animate-spin"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
          />
        </svg>
      )}
    </button>
  )
}

export default GenerateButton

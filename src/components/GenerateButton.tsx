import { useReportInput } from '@/hooks/useReportInput'
import React, { FC } from 'react'
import { useRouter } from 'next/router'

const GenerateButton: FC = () => {
  const { reportInput } = useReportInput()
  const router = useRouter()

  const generate = async () => {
    if(!reportInput.companyName) return alert('Please enter your company name')
    if(!reportInput.companyWebsite) return alert('Please enter your company website')
    if(reportInput.keywords.length < 1) return alert('Please enter your keywords')
    if(reportInput.competitors.length < 1) return alert('Please enter your competitors')

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
    </button>
  )
}

export default GenerateButton

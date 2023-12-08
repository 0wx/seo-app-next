import React, { FC, useState } from 'react'
import { TextField } from '@mui/material'
import { useReportInput } from '@/hooks/useReportInput'

const CompetitorsInput: FC = () => {
  const { reportInput, addCompetitor, removeCompetitor, setCompetitor } =
    useReportInput()

  return (
    <div className="flex flex-col gap-2">
      <b>Your Competitors</b>
      {reportInput.competitors.map((competitor, index) => (
        <div key={index} className="flex gap-8 items-center">
          <TextField
            label={`Competitors Name #${index + 1}`}
            placeholder='Acme Inc'
            variant="standard"
            className="w-full"
            onChange={(e) => {
              const competitor = reportInput.competitors.find(
                (c, i) => i === index
              )
              if (competitor) {
                competitor.competitorName = e.target.value
                setCompetitor(competitor, index)
              }
            }}
          />
          <TextField
            label={`Competitors Website #${index + 1}`}
            placeholder='https://acme.com'
            variant="standard"
            className="w-full"
            onChange={(e) => {
              const competitor = reportInput.competitors.find(
                (c, i) => i === index
              )
              if (competitor) {
                competitor.competitorWebsite = e.target.value
                setCompetitor(competitor, index)
              }
            }}
          />
          <button
            className="px-2 py-1 text-sm rounded-md"
            onClick={() => {
              const competitor = reportInput.competitors.find(
                (c, i) => i !== index
              )
              if (competitor) {
                removeCompetitor(competitor)
              }
            }}
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
      <div>
        <button
          className="border border-blue-500 text-black flex items-center gap-2 px-4 py-2 rounded-md mt-4 transition-all hover:bg-blue-500 hover:text-white"
          onClick={() =>
            addCompetitor({
              competitorName: '',
              competitorWebsite: '',
            })
          }
        >
          Add Competitor
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
              d="M12 6v12m6-6H6"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default CompetitorsInput

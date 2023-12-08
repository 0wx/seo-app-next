import { useReportInput } from '@/hooks/useReportInput'
import { Autocomplete, TextField } from '@mui/material'
import React, { FC, useState } from 'react'

const KeywordsInput: FC = () => {
  const {
    addKeyword,
    removeKeyword,
    reportInput,
    clearKeywords,
    removeSuggestedKeyword,
  } = useReportInput()
  return (
    <div className="flex flex-col gap-2 my-8">
      <b>Your Main Keywords</b>
      <Autocomplete
        style={{ margin: '10px 0' }}
        multiple
        id="tags-outlined"
        options={[]}
        defaultValue={[...reportInput.keywords]}
        value={[...reportInput.keywords]}
        freeSolo
        autoSelect
        onChange={(_event, _value, reason, details) => {
          if (reason === 'removeOption') {
            if (details) removeKeyword(details.option)
          } else if (reason === 'clear') {
            clearKeywords()
          } else if (reason === 'selectOption') {
            if (details)
            addKeyword(details.option)
          } else if (reason === 'createOption') {
            if (details) addKeyword(details.option)
          }
        
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="keywords"
            value={reportInput.keywords}
          />
        )}
        getOptionLabel={(option) => option}
      />
      {reportInput.suggestedKeywords.length > 0 && (
        <span className="text-sm italic">Suggested Keywords</span>
      )}
      <div className="flex flex-wrap gap-2">
        {reportInput.suggestedKeywords.map((keyword) => (
          <div
            key={keyword}
            className="rounded-full border border-gray-300 px-2 flex gap-2 items-center cursor-pointer hover:bg-slate-200 transition-all"
            onClick={() => {
              addKeyword(keyword)
              removeSuggestedKeyword(keyword)
            }}
          >
            <span>{keyword}</span>
            <span className="text-blue-500">+</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default KeywordsInput

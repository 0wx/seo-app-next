import React, { FC, useState } from 'react'
import { Keyword } from './KeywordsCluster'
import { Divider, TextField } from '@mui/material'

const PotentialRevenue: FC<{ keywords: Keyword[] }> = ({ keywords }) => {
  const [config, setConfig] = useState({
    ctr: 4,
    conversionRate: 1,
    closingRate: 10,
    arpu: 100,
  })

  const msv = Math.floor(
    keywords.reduce((acc, keyword) => {
      return acc + keyword.volume
    }, 0)
  )

  const avgKD = Math.floor(
    keywords.reduce((acc, keyword) => {
      return acc + keyword.difficulty
    }, 0) / keywords.length
  )
  return (
    <>
      <div className="flex gap-16 items-center p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <div>MSV</div>
            <div className="text-xl font-bold">{msv}</div>
          </div>
          <div className="flex flex-col">
            <div>Avg KD</div>
            <div className="text-xl font-bold">{avgKD}</div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <div>CTR (%)</div>
            <div>
              <TextField
                label=""
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  className: 'font-bold text-xl open-sans',
                }}
                style={{ width: '100px' }}
                variant="standard"
                value={config.ctr}
                onChange={(e) =>
                  setConfig({ ...config, ctr: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div>
            <div>Conversion Rate (%)</div>
            <div>
              <TextField
                label=""
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  className: 'font-bold text-xl open-sans',
                }}
                style={{ width: '100px' }}
                variant="standard"
                value={config.conversionRate}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    conversionRate: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <div>Closing Rate (%)</div>
            <div>
              <TextField
                label=""
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  className: 'font-bold text-xl open-sans',
                }}
                style={{ width: '100px' }}
                variant="standard"
                value={config.closingRate}
                onChange={(e) =>
                  setConfig({ ...config, closingRate: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div>
            <div>ARPU ($)</div>
            <div>
              <TextField
                label=""
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ width: '100px' }}
                InputProps={{
                  className: 'font-bold text-xl open-sans',
                }}
                variant="standard"
                value={config.arpu}
                onChange={(e) =>
                  setConfig({ ...config, arpu: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <div>Potential New User</div>
            <div className="text-xl font-bold">
              {Math.floor(
                (msv *
                  config.ctr *
                  config.conversionRate *
                  config.closingRate) /
                  10000
              ).toLocaleString()}
            </div>
          </div>
          <div>
            <div>Potential Revenue</div>
            <div className="text-xl font-bold">
              $
              {Math.floor(
                (msv *
                  config.ctr *
                  config.conversionRate *
                  config.closingRate *
                  config.arpu) /
                  10000
              ).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      <Divider />
    </>
  )
}

export default PotentialRevenue

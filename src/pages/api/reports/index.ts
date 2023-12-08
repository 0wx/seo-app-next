// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createReportSchema } from '@/libs/zod'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ZodError } from 'zod'
import { PrismaClient } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      if (req.body) {
        const _data = JSON.parse(req.body)
        const data = createReportSchema.parse(_data)
        const prisma = new PrismaClient()
        const response = await prisma.report.create({
          data: {
            companyName: data.companyName,
            companyWebsite: data.companyWebsite,
            competitors: {
              create: data.competitors,
            },
            keywords: {
              create: data.keywords.map((keyword) => {
                return {
                  keyword,
                }
              }),
            },
          },
        })

        res.status(201).json(response)
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).send(error as ZodError)
  }
}

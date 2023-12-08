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
    const id = req.query.id as string
    const prisma = new PrismaClient()
    if(req.method === 'PUT') {
      const { body } = req
      const report = await prisma.report.findFirst({
        where: {
          id,
        },
      })

      if (!report) {
        res.status(404).json({ message: 'Report not found' })
        return
      }
      
      const _data = JSON.parse(body)
      const currentData = JSON.parse(report.data || '{}')

      const data = {
        ...currentData,
        ..._data,
      }

      const response = await prisma.report.update({
        where: {
          id,
        },
        data: {
          data: JSON.stringify(data),
        },
      })
      
      res.status(200).json(response)
      return
    }

    if(req.method === 'DELETE') {
      const report = await prisma.report.delete({
        where: {
          id,
        },
      })
      res.status(200).json(report)
      return
    }

    

    const report = await prisma.report.findUnique({
      where: {
        id,
      },
      include: {
        keywords: true,
        competitors: true,
      },
    })

    if (!report) {
      res.status(404).json({ message: 'Report not found' })
      return
    }

    res.status(200).json(report)
  } catch (error) {
    console.log(error)
    res.status(500).send(error as ZodError)
  }
}

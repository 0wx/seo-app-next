import { z } from 'zod'

export const keywordSchema = z.object({
  price: z.number(),
  traffic: z.number(),
  position: z.number(),
  position_diff: z.null(),
  url: z.string(),
  competition: z.number(),
  cpc: z.number(),
  difficulty: z.number(),
  kei: z.number(),
  keyword: z.string(),
  prev_pos: z.null(),
  total_sites: z.number(),
  traffic_percent: z.number(),
  volume: z.number(),
  serp_features: z.array(z.string()),
  intents: z.array(z.string()),
  search_url: z.string(),
})

export const domainReportSchema = z.object({
  overview: z.object({
    organic: z.object({
      keywords_count: z.number(),
      traffic_sum: z.number(),
      price_sum: z.number(),
      keywords_new_count: z.number(),
      keywords_up_count: z.number(),
      keywords_down_count: z.number(),
      keywords_lost_count: z.number(),
      keywords_prev_count: z.number(),
      traffic_sum_prev: z.number(),
      price_sum_prev: z.number(),
    }),
    adv: z.object({
      keywords_count: z.number(),
      traffic_sum: z.number(),
      price_sum: z.number(),
      keywords_new_count: z.number(),
      keywords_up_count: z.number(),
      keywords_down_count: z.number(),
      keywords_lost_count: z.number(),
      keywords_prev_count: z.number(),
      traffic_sum_prev: z.number(),
      price_sum_prev: z.number(),
    }),
    has_known_data: z.boolean(),
    message: z.string(),
    limits: z.object({
      competitors_research_limits_used: z.number(),
      competitors_research_limits_total: z.number(),
    }),
    source_date: z.string(),
    requested_url: z.string(),
  }),
  competitors: z.array(
    z.object({
      domain: z.string(),
      common_keywords: z.number(),
      total_keywords: z.number(),
      missing_keywords: z.number(),
      traffic_sum: z.number(),
      price_sum: z.number(),
      domain_trust: z.number(),
    })
  ),
  keywords: z.array(keywordSchema),
  traffics: z.object({
    organic: z.array(
      z.object({
        date: z.string(),
        keywords_count: z.number(),
        traffic_sum: z.number(),
        price_sum: z.number(),
        keywords_new_count: z.number(),
        keywords_up_count: z.number(),
        keywords_lost_count: z.number(),
        keywords_down_count: z.number(),
        keywords_equal_count: z.number(),
      })
    ),
    adv: z.array(
      z.object({
        date: z.string(),
        keywords_count: z.number(),
        traffic_sum: z.number(),
        price_sum: z.number(),
        keywords_new_count: z.number(),
        keywords_up_count: z.number(),
        keywords_lost_count: z.number(),
        keywords_down_count: z.number(),
        keywords_equal_count: z.number(),
      })
    ),
  }),
})

export type DomainReport = z.infer<typeof domainReportSchema>

export const createReportSchema = z.object({
  companyName: z.string(),
  companyWebsite: z.string(),
  competitors: z.array(
    z.object({
      competitorName: z.string(),
      competitorWebsite: z.string(),
    })
  ),
  keywords: z.array(z.string()),
})

export type CreateReport = z.infer<typeof createReportSchema>

export const reportInputDataSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.string(),
  companyName: z.string(),
  companyWebsite: z.string(),
  data: z.union([z.string(), z.null()]),
  keywords: z.array(
    z.object({
      id: z.number(),
      createdAt: z.string(),
      updatedAt: z.string(),
      keyword: z.string(),
      reportId: z.string(),
    })
  ),
  competitors: z.array(
    z.object({
      id: z.number(),
      createdAt: z.string(),
      updatedAt: z.string(),
      competitorName: z.string(),
      competitorWebsite: z.string(),
      reportId: z.string(),
    })
  ),
})

export type ReportInputData = z.infer<typeof reportInputDataSchema>

export const domainKeywordSchema = z.object({
  items: z.array(keywordSchema),
  total: z.number(),
  rows_limit: z.number(),
})

export type DomainKeyword = z.infer<typeof domainKeywordSchema>

import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRepository from './repository'
import { createScreeningSchema } from './schema'

export default (db: Database) => {
  const repository = buildRepository(db)
  const router = Router()

  router.post(
    '/',
    jsonRoute(async (req) => {
      const data = createScreeningSchema.parse(req.body)
      const screening = await repository.create(data)
      return screening
    }, StatusCodes.CREATED)
  )

  return router
}

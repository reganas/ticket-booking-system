import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRepository from './repository'
import { createTicketSchema } from './schema'

export default (db: Database) => {
  const repository = buildRepository(db)
  const router = Router()

  router.post(
    '/',
    jsonRoute(async (req) => {
      const data = createTicketSchema.parse(req.body)
      const ticket = await repository.create(data)
      return ticket
    }, StatusCodes.CREATED)
  )

  return router
}

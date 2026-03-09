import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { Database } from '@/database'
import { jsonRoute } from '@/utils/middleware'
import buildRepository from './repository'
import { createTicketSchema } from './schema'
import BadRequest from '@/utils/errors/BadRequest'

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

  router.get(
    '/',
    jsonRoute(async (req) => {
      const { userId } = req.query

      if (!userId || typeof userId !== 'string') {
        throw new BadRequest('userId query parameter is required')
      }

      const tickets = await repository.findByUserId(Number(userId))
      return tickets
    })
  )

  return router
}

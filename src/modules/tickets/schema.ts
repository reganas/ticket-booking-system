import { z } from 'zod'

export const createTicketSchema = z.object({
  screeningId: z.number().positive(),
  userId: z.number().positive(),
})

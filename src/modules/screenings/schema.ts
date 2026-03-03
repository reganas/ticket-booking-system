import { z } from 'zod'

export const createScreeningSchema = z.object({
  movieId: z.number().positive(),
  screeningTime: z.string().datetime(),
  totalTickets: z.number().int().min(1).max(500),
})

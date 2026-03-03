import type { Database } from '@/database'

export default (db: Database) => ({
  create: async (data: {
    movieId: number
    screeningTime: string
    totalTickets: number
  }) => {
    const result = await db
      .insertInto('screenings')
      .values({
        movieId: data.movieId,
        screeningTime: data.screeningTime,
        totalTickets: data.totalTickets,
        ticketsLeft: data.totalTickets,
      })
      .returningAll()
      .executeTakeFirstOrThrow()

    return result
  },
})

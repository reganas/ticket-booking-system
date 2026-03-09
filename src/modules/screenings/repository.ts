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

  findAll: async () => {
    const screenings = await db
      .selectFrom('screenings')
      .innerJoin('movies', 'movies.id', 'screenings.movieId')
      .selectAll('screenings')
      .select([
        'movies.id as movieId',
        'movies.title as movieTitle',
        'movies.year as movieYear',
      ])
      .execute()

    return screenings.map((s) => ({
      id: s.id,
      screeningTime: s.screeningTime,
      totalTickets: s.totalTickets,
      ticketsLeft: s.ticketsLeft,
      movie: {
        id: s.movieId,
        title: s.movieTitle,
        year: s.movieYear,
      },
    }))
  },
})

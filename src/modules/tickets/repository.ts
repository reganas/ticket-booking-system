import type { Database } from '@/database'
import BadRequest from '@/utils/errors/BadRequest'

export default (db: Database) => ({
  create: async (data: { screeningId: number; userId: number }) =>
    await db.transaction().execute(async (trx) => {
      const screening = await trx
        .selectFrom('screenings')
        .selectAll()
        .where('id', '=', data.screeningId)
        .executeTakeFirst()

      if (!screening) {
        throw new BadRequest('Screening not found')
      }

      if (screening.ticketsLeft <= 0) {
        throw new BadRequest('No tickets available')
      }

      await trx
        .updateTable('screenings')
        .set({ ticketsLeft: screening.ticketsLeft - 1 })
        .where('id', '=', data.screeningId)
        .execute()

      const ticket = await trx
        .insertInto('tickets')
        .values({
          screeningId: data.screeningId,
          userId: data.userId,
          bookedAt: new Date().toISOString(),
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      return ticket
    }),

  findByUserId: async (userId: number) => {
    const tickets = await db
      .selectFrom('tickets')
      .innerJoin('screenings', 'screenings.id', 'tickets.screeningId')
      .innerJoin('movies', 'movies.id', 'screenings.movieId')
      .selectAll('tickets')
      .select([
        'screenings.id as screeningId',
        'screenings.screeningTime as screeningTime',
        'movies.id as movieId',
        'movies.title as movieTitle',
        'movies.year as movieYear',
      ])
      .where('tickets.userId', '=', userId)
      .execute()

    return tickets.map((t) => ({
      id: t.id,
      userId: t.userId,
      bookedAt: t.bookedAt,
      screening: {
        id: t.screeningId,
        screeningTime: t.screeningTime,
        movie: {
          id: t.movieId,
          title: t.movieTitle,
          year: t.movieYear,
        },
      },
    }))
  },
})

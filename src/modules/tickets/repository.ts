import type { Database } from '@/database'
import BadRequest from '@/utils/errors/BadRequest'

export default (db: Database) => ({
  create: async (data: { screeningId: number; userId: number }) =>
    await db.transaction().execute(async (trx) => {
      // Get screening and lock the row
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

      // Decrease ticketsLeft
      await trx
        .updateTable('screenings')
        .set({ ticketsLeft: screening.ticketsLeft - 1 })
        .where('id', '=', data.screeningId)
        .execute()

      // Create ticket
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
})

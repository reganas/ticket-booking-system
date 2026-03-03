import { Kysely, SqliteDatabase } from 'kysely'

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('tickets')
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement())
    .addColumn('screening_id', 'integer', (c) =>
      c.notNull().references('screenings.id')
    )
    .addColumn('user_id', 'integer', (c) => c.notNull())
    .addColumn('booked_at', 'text', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('tickets').execute()
}

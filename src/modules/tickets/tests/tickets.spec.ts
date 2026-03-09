import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor } from '@tests/utils/records'
import createApp from '@/app'

const db = await createTestDatabase()
const app = createApp(db)
const createMovies = createFor(db, 'movies')
const createScreenings = createFor(db, 'screenings')

describe('POST /tickets', () => {
  it('should return 201 with valid booking', async () => {
    await createMovies([{ id: 1, title: 'The Matrix', year: 1999 }])
    await createScreenings([
      {
        id: 1,
        movieId: 1,
        screeningTime: '2025-12-25T19:30:00Z',
        totalTickets: 100,
        ticketsLeft: 100,
      },
    ])

    const { body } = await supertest(app)
      .post('/tickets')
      .send({
        screeningId: 1,
        userId: 42,
      })
      .expect(201)

    expect(body).toMatchObject({
      id: expect.any(Number),
      screeningId: 1,
      userId: 42,
      bookedAt: expect.any(String),
    })
  })

  it('should return 400 if no tickets left', async () => {
    await createMovies([{ id: 2, title: 'Inception', year: 2010 }])
    await createScreenings([
      {
        id: 2,
        movieId: 2,
        screeningTime: '2025-12-31T20:00:00Z',
        totalTickets: 0,
        ticketsLeft: 0,
      },
    ])

    await supertest(app)
      .post('/tickets')
      .send({
        screeningId: 2,
        userId: 99,
      })
      .expect(400)
  })
})

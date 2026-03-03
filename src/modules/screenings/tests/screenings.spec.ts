import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor } from '@tests/utils/records'
import createApp from '@/app'

const db = await createTestDatabase()
const app = createApp(db)
const createMovies = createFor(db, 'movies')

describe('POST /screenings', () => {
  it('should return 201 with valid data', async () => {
    await createMovies([{ id: 1, title: 'The Matrix', year: 1999 }])

    const { body } = await supertest(app)
      .post('/screenings')
      .send({
        movieId: 1,
        screeningTime: '2025-12-25T19:30:00Z',
        totalTickets: 100,
      })
      .expect(201)

    expect(body).toMatchObject({
      id: expect.any(Number),
      movieId: 1,
      screeningTime: '2025-12-25T19:30:00Z',
      totalTickets: 100,
      ticketsLeft: 100,
    })
  })

  it('should return 400 with invalid data', async () => {
    await supertest(app)
      .post('/screenings')
      .send({
        movieId: -1,
        screeningTime: 'invalid',
        totalTickets: 1000,
      })
      .expect(400)
  })
})

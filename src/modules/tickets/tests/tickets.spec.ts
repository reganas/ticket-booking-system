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

describe('GET /tickets', () => {
  it('should return 200 with user bookings', async () => {
    await createMovies([{ id: 4, title: 'The Dark Knight', year: 2008 }])
    await createScreenings([
      {
        id: 4,
        movieId: 4,
        screeningTime: '2026-01-15T18:00:00Z',
        totalTickets: 200,
        ticketsLeft: 200,
      },
    ])

    await supertest(app).post('/tickets').send({
      screeningId: 4,
      userId: 123,
    })

    const { body } = await supertest(app).get('/tickets?userId=123').expect(200)

    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          userId: 123,
          bookedAt: expect.any(String),
          screening: expect.objectContaining({
            id: 4,
            screeningTime: '2026-01-15T18:00:00Z',
            movie: {
              id: 4,
              title: 'The Dark Knight',
              year: 2008,
            },
          }),
        }),
      ])
    )
  })

  it('should return 400 if userId missing', async () => {
    await supertest(app).get('/tickets').expect(400)
  })
})

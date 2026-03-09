import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor } from '@tests/utils/records'
import buildRepository from '../repository'
import buildScreeningsRepository from '@/modules/screenings/repository'
import BadRequest from '@/utils/errors/BadRequest'

const db = await createTestDatabase()
const repository = buildRepository(db)
const screeningsRepository = buildScreeningsRepository(db)
const createMovies = createFor(db, 'movies')

describe('create', () => {
  it('should create ticket and decrease ticketsLeft', async () => {
    await createMovies([{ id: 1, title: 'The Matrix', year: 1999 }])

    const screening = await screeningsRepository.create({
      movieId: 1,
      screeningTime: '2025-12-25T19:30:00Z',
      totalTickets: 10,
    })

    const ticket = await repository.create({
      screeningId: screening.id!,
      userId: 42,
    })

    expect(ticket).toMatchObject({
      id: expect.any(Number),
      screeningId: screening.id,
      userId: 42,
      bookedAt: expect.any(String),
    })

    // Verify ticketsLeft decreased
    const screenings = await screeningsRepository.findAll()
    expect(screenings[0].ticketsLeft).toBe(9)
  })

  it('should throw error if no tickets available', async () => {
    await createMovies([{ id: 2, title: 'Inception', year: 2010 }])

    const screening = await screeningsRepository.create({
      movieId: 2,
      screeningTime: '2025-12-31T20:00:00Z',
      totalTickets: 0,
    })

    await expect(
      repository.create({
        screeningId: screening.id!,
        userId: 99,
      })
    ).rejects.toThrow(BadRequest)
  })
})

describe('findByUserId', () => {
  it('should return user tickets with screening and movie details', async () => {
    await createMovies([{ id: 3, title: 'Interstellar', year: 2014 }])

    const screening = await screeningsRepository.create({
      movieId: 3,
      screeningTime: '2025-12-31T20:00:00Z',
      totalTickets: 50,
    })

    await repository.create({
      screeningId: screening.id!,
      userId: 100,
    })

    const tickets = await repository.findByUserId(100)

    expect(tickets).toHaveLength(1)
    expect(tickets[0]).toMatchObject({
      id: expect.any(Number),
      userId: 100,
      bookedAt: expect.any(String),
      screening: {
        id: screening.id,
        screeningTime: '2025-12-31T20:00:00Z',
        movie: {
          id: 3,
          title: 'Interstellar',
          year: 2014,
        },
      },
    })
  })
})

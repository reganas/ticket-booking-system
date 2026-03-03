import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor } from '@tests/utils/records'
import buildRepository from '../repository'

const db = await createTestDatabase()
const repository = buildRepository(db)
const createMovies = createFor(db, 'movies')

describe('create', () => {
  it('should create a screening with valid data', async () => {
    // Create a movie first
    await createMovies([
      {
        id: 1,
        title: 'The Matrix',
        year: 1999,
      },
    ])

    // Create screening
    const screening = await repository.create({
      movieId: 1,
      screeningTime: '2025-12-25T19:30:00Z',
      totalTickets: 100,
    })

    expect(screening).toMatchObject({
      id: expect.any(Number),
      movieId: 1,
      screeningTime: '2025-12-25T19:30:00Z',
      totalTickets: 100,
      ticketsLeft: 100,
    })
  })
})

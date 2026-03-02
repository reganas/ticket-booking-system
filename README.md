# Movie Ticket Booking System

## Requirements

### API Endpoints

#### 1. Movies

**GET /movies?id=1,2,3** - Get movies by IDs (✅ implemented)

- Query: `id` (optional) - comma-separated movie IDs
- Returns: Array of movies with id, title, year

#### 2. Screenings

**POST /screenings** - Create screening

- Body: `{ movieId: number, screeningTime: string, totalTickets: number }`
- Validation: movieId exists, screeningTime is future, totalTickets 1-500
- Returns: 201 with screening object

**GET /screenings** - Get all screenings

- Returns: 200 with array of screenings including movie details

#### 3. Tickets

**POST /tickets** - Book ticket

- Body: `{ screeningId: number, userId: number }`
- Validation: screening exists, tickets available
- Returns: 201 with ticket object
- Side effect: Decreases ticketsLeft by 1

**GET /tickets?userId=42** - Get user bookings

- Query: `userId` (required)
- Returns: 200 with array of tickets including screening and movie details

### Database Schema

**screenings**

- id (PK, auto-increment)
- movie_id (FK → movies.id)
- screening_time (ISO 8601 datetime)
- total_tickets (integer)
- tickets_left (integer)

**tickets**

- id (PK, auto-increment)
- screening_id (FK → screenings.id)
- user_id (integer)
- booked_at (ISO 8601 datetime)

### Validation Rules

- movieId: positive integer, must exist
- screeningTime: ISO 8601 format, must be future
- totalTickets: integer, 1-500
- screeningId: positive integer, must exist
- userId: positive integer
- Booking: only if ticketsLeft > 0

### Assumptions

- No authentication (assume authorized users)
- No seat selection (generic tickets)
- One ticket per booking request
- No cancellations
- userId is just a number (no users table)

---

## Setup

**Note:** For this exercise, we have provided an `.env` file with the database connection string. Normally, you would not commit this file to version control. We are doing it here for simplicity and given that we are using a local SQLite database.

## Migrations

Before running the migrations, we need to create a database. We can do this by running the following command:

```bash
npm run migrate:latest
```

## Running the server

In development mode:

```bash
npm run dev
```

In production mode:

```bash
npm run start
```

## Updating types

If you make changes to the database schema, you will need to update the types. You can do this by running the following command:

```bash
npm run generate-types
```

## Testing

Run tests:

```bash
npm test
```

Run with coverage:

```bash
npm run coverage
```

Target: 80%+ coverage

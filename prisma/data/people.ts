import { Prisma } from '@prisma/client'

export const people: Prisma.PersonCreateManyInput[] = [
  {
    dni: '0707047643',
    email: 'dzhu2409@gmail.com',
    name: 'Daniel',
    surname: 'Zhu',
    birthDate: new Date('2003-09-24'),
  },
  {
    dni: '0700941503',
    email: 'pepito12@gmail.com',
    name: 'Pepito',
    surname: 'Pérez',
    birthDate: new Date('1990-01-01'),
  },
  {
    dni: '0703224345',
    email: 'juanito34@gmail.com',
    name: 'Juanito',
    surname: 'Gómez',
    birthDate: new Date('1990-01-01'),
  },
  {
    dni: '0703224337',
    email: 'maria23@gmail.com',
    name: 'María',
    surname: 'López',
    birthDate: new Date('1990-01-01'),
  },
  {
    dni: '0703224317',
    email: 'admin@gmail.com',
    name: 'Admin',
    surname: 'Admin',
    birthDate: new Date('2000-01-01'),
  },
  {
    name: 'Juan',
    surname: 'Perez',
    birthDate: new Date('1990-01-01'),
    dni: '1234567890',
  },
  {
    name: 'Maria',
    surname: 'Gomez',
    birthDate: new Date('1990-01-01'),
    dni: '1234567891',
  },
  {
    name: 'Pedro',
    surname: 'Gomez',
    birthDate: new Date('1990-01-01'),
    dni: '1234567892',
  },
  {
    name: 'Ana',
    surname: 'Gomez',
    birthDate: new Date('1990-01-01'),
    dni: '1234567893',
  },
]

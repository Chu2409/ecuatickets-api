import { integer, pgTable, varchar, timestamp, date } from 'drizzle-orm/pg-core'
import { user } from './user'
import { relations } from 'drizzle-orm';

export const person = pgTable('persons', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  dni: varchar('dni', { length: 15 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  middleName: varchar('middle_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  secondLastName: varchar('second_last_name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  birthDate: date('birth_date'),
  phone: varchar('phone', { length: 15 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const personRelations = relations(person, ({ one }) => ({
  user: one(user, {
    fields: [person.id],
    references: [user.personId],
  }),
}));
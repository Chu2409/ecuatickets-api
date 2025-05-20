import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'
import { userType } from './user-type'
import { userStatus } from './usert-status'
import { USER_STATUS } from 'src/core/users/types/user-status.enum'
import { person } from './person'
import { relations } from 'drizzle-orm'

export const user = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  personId: integer('person_id')
    .notNull()
    .references(() => person.id),
  userName: varchar('user_name', { length: 50 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  userType: userType('user_type').notNull(),
  status: userStatus('status').default(USER_STATUS.ACTIVE).notNull(),
})

export const userRelations = relations(user, ({ one }) => ({
  person: one(person, {
    fields: [user.personId],
    references: [person.id],
  }),
}));
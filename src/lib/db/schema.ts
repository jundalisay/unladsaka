import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const registrations = sqliteTable('registrations', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  fullName:  text('full_name').notNull(),
  email:     text('email').notNull(),
  phone:     text('phone'),
  region:    text('region'),
  farmSize:  text('farm_size'),
  crops:     text('crops'),
  message:   text('message'),
  locale:    text('locale').default('en'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`)
});

export type Registration = typeof registrations.$inferSelect;
export type NewRegistration = typeof registrations.$inferInsert;

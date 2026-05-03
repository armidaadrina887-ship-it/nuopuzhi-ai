import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/mysql-core";

// 客户意向表单表
export const leads = mysqlTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    company: varchar("company", { length: 255 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("new"),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    phoneIdx: index("phone_idx").on(table.phone),
    statusIdx: index("status_idx").on(table.status),
    createdAtIdx: index("created_at_idx").on(table.createdAt),
  })
);

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

import { pgTable, text, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	isBlacklisted: boolean().default(false),
});

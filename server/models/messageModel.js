import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
const  MessagesModel = pgTable("messages", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  sender_id: varchar("sender_id").notNull(),
  receiver_id: varchar("receiver_id").notNull(),
  created_at: text("created_at").default("NOW()"),
  updated_at: text("updated_at").default("NOW()"),
});

export default MessagesModel;
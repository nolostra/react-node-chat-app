import { pgTable, serial, varchar, boolean } from "drizzle-orm/pg-core";

const UserModel = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 20 }).notNull().unique(),
  email: varchar("email", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  isAvatarImageSet: boolean("is_avatar_image_set").default(false),
  avatarImage: varchar("avatar_image").default(""),
  isOnline: boolean("is_online").default(false),
});

export default UserModel;

import bcrypt from "bcrypt";
import { db, UserModel, MessagesModel } from "../drizzleConfig.js";
import { eq, ne } from "drizzle-orm";

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await db
      .select()
      .from(UserModel)
      .where(eq(UserModel.username, username))
      .limit(1)
      .execute();
    if (!user.length) {
      return res.json({ msg: "Incorrect Username or Password", status: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect Username or Password", status: false });
    }
    const { password: _, ...userWithoutPassword } = user[0];
    return res.json({ status: true, user: userWithoutPassword });
  } catch (ex) {
    next(ex);
  }
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await db
      .select()
      .from(UserModel)
      .where(eq(UserModel.username, username))
      .limit(1)
      .execute();
    if (usernameCheck.length) {
      return res.json({ msg: "Username already used", status: false });
    }
    const emailCheck = await db
      .select()
      .from(UserModel)
      .where(eq(UserModel.email, email)) // Corrected line
      .limit(1)
      .execute();
    if (emailCheck.length) {
      return res.json({ msg: "Email already used", status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("details", { username, email, password: hashedPassword });
    await db
      .insert(UserModel)
      .values({ username, email, password: hashedPassword });
    const user = await db
      .select()
      .from(UserModel)
      .where(eq(UserModel.username, username))
      .limit(1)
      .execute();
    const { password: _, ...userWithoutPassword } = user[0];
    console.log("---", userWithoutPassword);
    return res.json({
      status: true,
      user: userWithoutPassword,
      response: "successfully created user",
    });
  } catch (ex) {
    next(ex);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await db
      .select()
      .from(UserModel)
      .where(ne(UserModel.id, req.params.id))
      .orderBy(UserModel.id, "asc")
      .execute();
    // console.log("users", users);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};


export const setOnline = async (id) => {
  try {
    const user = await db.select().from(UserModel).where(eq(UserModel.id, id));

    console.log("user", user);

    if (user) {
      // Set the isOnline status to the opposite value
      const newIsOnlineStatus = !user.isOnline;

      await db
        .update(UserModel)
        .set({ isOnline: newIsOnlineStatus })
        .where(eq(UserModel.id, id))
        .execute();

      console.log(
        `User ${id} is now ${newIsOnlineStatus ? "online" : "offline"}`
      );
    } else {
      console.error("User not found");
    }
  } catch (error) {
    console.log("setOnline error", error);
  }
};
export const setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    console.log("data", req.body, req.params.id);
    await db
      .update(UserModel)
      .set({ isAvatarImageSet: true, avatarImage: "" })
      .where(eq(UserModel.id, userId));
    return res.json({
      isSet: true,
      image: avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

export const logOut = async (req, res, next) => {
  try {
    console.log("req.params.id", req.params.id);
    if (!req.params.id) {
      return res.json({ msg: "User id is required" });
    }
    await db
      .update(UserModel)
      .set({ isOnline: false })
      .where(eq(UserModel.id, req.params.id))
      .execute();
    global.onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
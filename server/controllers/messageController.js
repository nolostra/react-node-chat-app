import { db, MessagesModel } from "../drizzleConfig.js";
import { eq, ne, and, or } from "drizzle-orm";
export const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    console.log("from", from, "to", to);
    const messages = await db
      .select()
      .from(MessagesModel)
      .where(
        or(
          and(
            eq(MessagesModel.sender_id, from),
            eq(MessagesModel.receiver_id, to)
          ),
          and(
            eq(MessagesModel.sender_id, to),
            eq(MessagesModel.receiver_id, from)
          )
        )
      )
      .orderBy(MessagesModel.updated_at, "desc")
      .execute();
    const projectedMessages = messages.map((msg) => ({
      fromSelf: msg.sender_id == from,
      message: msg.text,
    }));

    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

export const addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    console.log("from", from, "to", to, "message", message);
    const data = await db.insert(MessagesModel).values({
      text: message || "",
      receiver_id: to,
      sender_id: from,
    });

    if (data.length) {
      return res.json({ msg: "Message added successfully." });
    } else {
      return res.json({ msg: "Failed to add message to the database" });
    }
  } catch (ex) {
    next(ex);
  }
};
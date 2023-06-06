import type { Message, User } from "@prisma/client";
import { prisma } from "../db.server";
import { emitter } from "../services/emitter.server";
export type { Message } from "@prisma/client";

export async function createMessage(
  message: Message["message"],
  userId: User["id"]
): Promise<Message> {
  const newMessage = await prisma.message.create({
    data: {
      message,
      userId,
    },
  });
  if (newMessage) {
    emitter.emit("message", newMessage);
  }
  return newMessage;
}

export async function getLatestMessages() {
  return await prisma.message.findMany({
    take: 1000,
    select: {
      userId: true,
      id: true,
      createdAt: true,
      message: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

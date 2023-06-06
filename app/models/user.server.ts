import { faker } from "@faker-js/faker";
import type { User } from "@prisma/client";
import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(): Promise<User> {
  return prisma.user.create({
    data: {
      name: faker.person.firstName(),
    },
  });
}

export async function getUserCount(): Promise<number> {
  return prisma.user.count();
}

const viewCount = async (minutes: number) => {
  const fiveMinutesAgo = new Date();
  fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - minutes);

  const users = await prisma.user.count({
    where: {
      message: {
        some: {
          createdAt: {
            gte: fiveMinutesAgo,
          },
        },
      },
    },
  });
  return users;
};

export async function currentOnline() {
  return viewCount(60);
}

export async function getChatViewCount() {
  return viewCount(30);
}

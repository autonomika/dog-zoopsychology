import { prisma } from "./db";
import { getSession } from "./session";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.id },
    include: {
      progress: { orderBy: { completedAt: "desc" } },
      payments: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
}

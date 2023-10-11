import KanbanBoard from "@/components/kanban/KanbanBoard";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface pageProps {}

const page = async ({}: pageProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // check if user is in db
  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  // sync user to db if needed
  if (!dbUser) {
    redirect("/auth-callback");
  }

  return (
    <main className="p-16">
      <div className="">kanban header</div>
      <div className="">
        <KanbanBoard />
      </div>
    </main>
  );
};

export default page;

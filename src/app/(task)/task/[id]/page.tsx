"use client";

import { trpc } from "@/app/_trpc/client";
import KanbanModal from "@/components/kanban/KanbanModal";
import { Loader2 } from "lucide-react";

interface pageProps {
  params: { id: string };
}

const page = ({ params }: pageProps) => {
  const { data: task, isLoading } = trpc.getTaskById.useQuery({
    id: params.id,
  });

  const { data: subTasks } = trpc.getSubTasks.useQuery({ taskId: params.id });

  return (
    <main className="flex justify-center items-center">
      {isLoading ? (
        <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      ) : null}
      {task ? (
        <div className="w-full m-6 border p-10 rounded-md">
          <KanbanModal task={task} subTasks={subTasks} />
        </div>
      ) : null}
    </main>
  );
};
export default page;

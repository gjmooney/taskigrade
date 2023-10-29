"use client";

import { trpc } from "@/app/_trpc/client";
import Modal from "@/components/Modal";
import KanbanModal from "@/components/kanban/KanbanModal";
import { Task } from "@/db/schema";
import { Loader2 } from "lucide-react";

interface pageProps {
  params: {
    id: string;
  };
}

const page = ({ params }: pageProps) => {
  const { data: task, isLoading } = trpc.getTaskById.useQuery({
    id: params.id,
  });

  const { data: subTasks } = trpc.getSubTasks.useQuery({ taskId: params.id });

  return (
    <Modal>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      ) : null}
      {task ? <KanbanModal task={task} subTasks={subTasks} /> : null}
    </Modal>
  );
};
export default page;

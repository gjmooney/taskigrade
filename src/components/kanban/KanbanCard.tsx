"use client";

import { trpc } from "@/app/_trpc/client";
import SubTaskInput from "@/components/kanban/SubTaskInput";
import { Task } from "@/db/schema";
import { Id } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Dot, GitBranchPlus, Trash } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import KanbanModal from "./KanbanModal";

interface KanbanCardProps {
  task: Task;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (taskId: string) => void;
  saveTask: (task: Task) => void;
}

const KanbanCard = ({
  task,
  updateTask,
  deleteTask,
  saveTask,
}: KanbanCardProps) => {
  const [isAddingSubTask, setIsAddingSubTask] = useState(false);
  const { user } = useUser();

  const { data: subTasks } = trpc.getSubTasks.useQuery({ taskId: task.id });
  const utils = trpc.useContext();

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setIsAddingSubTask((prev) => !prev);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=" p-3 h-48 rounded-xl cursor-grab border-2 opacity-50 bg-accent bg-emerald-600"
      />
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className="cursor-grab bg-secondary hover:bg-accent/80"
        >
          <CardHeader>
            <CardTitle className="flex"></CardTitle>
          </CardHeader>
          <CardContent>
            {task.initial ? (
              <>
                <Input
                  value={task.title}
                  autoFocus
                  placeholder="Enter task here..."
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveTask(task);
                    }
                  }}
                  onChange={(e) => updateTask(task.id, e.target.value)}
                />
                <span className="text-xs text-foreground/80">
                  Press Enter to save...
                </span>
              </>
            ) : (
              <div className="">
                <div className="flex justify-between">
                  {task.title}
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>
                      {user?.firstName?.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <ul className="mt-2">
                  {subTasks?.map((task) => (
                    <li
                      key={task.id}
                      className="text-sm text-foreground/70 flex"
                    >
                      <Dot className="-mr-1 -ml-2" />
                      {task.title}
                    </li>
                  ))}
                </ul>
                {isAddingSubTask ? (
                  <SubTaskInput
                    createdById={user?.id}
                    parentId={task.id}
                    toggleEditMode={toggleEditMode}
                  />
                ) : null}
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-end">
            {task.initial ? (
              <Button
                key={`save ${task.id}`}
                aria-label="save new task"
                size={"sm"}
                variant={"outline"}
                className="bg-transparent hover:bg-secondary"
                onMouseDown={(e) =>
                  // need this so onClick fires before inputs onBlur
                  e.preventDefault()
                }
                onClick={(e) => {
                  e.stopPropagation();
                  saveTask(task);
                }}
              >
                Save
              </Button>
            ) : (
              <div className="flex justify-between w-full">
                <Button
                  size={"sm"}
                  className="border hover:bg-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleEditMode();
                  }}
                >
                  <GitBranchPlus className="h-4 w-4" />
                </Button>
                <Button
                  key={`delete ${task.id}`}
                  aria-label="delete task"
                  size={"sm"}
                  variant={"outline"}
                  className="bg-transparent hover:bg-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id as string);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </DialogTrigger>

      <DialogContent
        className="w-full max-w-5xl h-fit"
        onBlur={() => utils.getUsersTasks.invalidate()}
      >
        <KanbanModal task={task} subTasks={subTasks} />
      </DialogContent>
    </Dialog>
  );
};

export default KanbanCard;

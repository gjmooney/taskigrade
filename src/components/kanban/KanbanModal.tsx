"use client";

import { trpc } from "@/app/_trpc/client";
import TaskText from "@/components/kanban/TaskText";
import DueDatePicker from "@/components/taskModal/DueDatePicker";
import Timer from "@/components/taskModal/Timer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Task } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, Dot, Flag, Tag } from "lucide-react";
import { useState } from "react";

const statuses = [
  { status: "todo", display: "To Do" },
  { status: "inprogress", display: "In Progress" },
  { status: "test", display: "Test" },
  { status: "complete", display: "Complete" },
];

const priorities = ["urgent", "high", "normal", "low"];

interface KanbanModalProps {
  task: Task;
  subTasks?: Task[];
}

const KanbanModal = ({ task: tempRename, subTasks }: KanbanModalProps) => {
  const task = {
    ...tempRename,
    tags: ["tag1", "tag2", "tag3"],
  };

  const statusDisplayMap: Record<string, string> = {
    todo: "To Do",
    inprogress: "In Progress",
    test: "Test",
    complete: "Complete",
  };

  const priorityColorMap: Record<string, string> = {
    urgent: "fill-red-600",
    high: "fill-yellow-600",
    normal: "fill-blue-600",
    low: "fill-gray-600",
  };

  const [displayStatus, setDisplayStatus] = useState(task.status);
  const [displayPriority, setDisplayPriority] = useState(task.priority);

  const utils = trpc.useContext();

  const { mutate: updateStatus } = trpc.updateStatus.useMutation({
    onSuccess: () => {
      console.log("success");
    },
    onError: () => {
      console.log("error");
    },
    onMutate: ({ status }) => {
      setDisplayStatus(status);
    },
  });

  const { mutate: updatePriority } = trpc.updatePriority.useMutation({
    onSuccess: () => {
      console.log("success");
    },
    onError: () => {
      console.log("error");
    },
    onMutate: ({ priority }) => {
      console.log("priority", priority);
      setDisplayPriority(priority);
    },
  });

  const { mutate: updateTitle } = trpc.updateTitle.useMutation({
    onSuccess: (data) => {
      console.log("success");
    },
    onError: () => {
      console.log("error");
    },
  });

  const titleHelper = (taskId: string, text: string) => {
    updateTitle({ taskId, title: text });
  };

  const { mutate: updateDescription } = trpc.updateDescription.useMutation({
    onSuccess: (data) => {
      console.log("success");
    },
    onError: () => {
      console.log("error");
    },
    onMutate: () => {
      //setEditMode(false);
    },
  });

  const descriptionHelper = (taskId: string, text: string) => {
    updateDescription({ taskId, description: text });
  };

  return (
    <div className="flex flex-col">
      <DialogHeader className="space-y-2 mt-4 ">
        {/** header first row */}
        <div className="flex gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-r-none">
                {statusDisplayMap[displayStatus]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statuses.map((status) => (
                <DropdownMenuItem
                  key={status.status}
                  className="flex w-full items-center justify-between"
                  onClick={() =>
                    updateStatus({ taskId: task.id, status: status.status })
                  }
                >
                  <span className="capitalize">
                    {status.display ? status.display : status.status}
                  </span>
                  {displayStatus === status.status ? (
                    <Check className="w-4 h-4" />
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size={"icon"} className="rounded-l-none">
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant={"outline"} size={"icon"}>
            <Check className="w-4 h-4" />
          </Button>

          <Avatar className="ml-6 mr-auto">
            <AvatarImage src={task.createdById} />
            <AvatarFallback>F</AvatarFallback>
          </Avatar>

          <DropdownMenu>
            {task.priority ? (
              <span className="capitalize text-xs text-muted-foreground self-center mr-2">
                {displayPriority}
              </span>
            ) : null}
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <Flag
                  className={cn(
                    "w-4 h-4",
                    displayPriority ? priorityColorMap[displayPriority] : ""
                  )}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {priorities.map((priority) => (
                <DropdownMenuItem
                  key={priority}
                  className="flex w-full items-center justify-between"
                  onClick={() => {
                    updatePriority({ taskId: task.id, priority });
                  }}
                >
                  <span className="capitalize">{priority}</span>
                  {task.priority === priority ? (
                    <Check className="w-4 h-4" />
                  ) : null}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex w-full items-center justify-between">
                Clear
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/** header second row */}
        <div className="flex gap-6">
          <div className="flex flex-col mr-auto">
            <span className="text-sm text-muted-foreground">Time Tracked</span>
            <Timer taskId={task.id} totalTime={task.totalTime ?? 0} />
          </div>

          <DueDatePicker task={task} />
        </div>

        {/** header third row */}
        <div className="flex justify-between">
          <div>
            {task.tags.map((tag) => (
              <Badge key={tag} className=" mr-1 rounded-l-none">
                {tag}
              </Badge>
            ))}
          </div>

          <Button variant={"outline"} size={"icon"}>
            <Tag className="w-4 h-4" />
          </Button>
        </div>
        <Separator />
      </DialogHeader>

      {/* Main section */}
      <div className="flex flex-col gap-6 py-10 ">
        <TaskText
          taskId={task.id}
          taskText={task.title}
          onKeyDown={titleHelper}
          classNameInput="h-14 text-4xl"
          classNameText="text-4xl font-semibold leading-none tracking-tight cursor-pointer"
        />
        <TaskText
          taskId={task.id}
          taskText={task.description ? task.description : ""}
          onKeyDown={descriptionHelper}
          classNameInput=""
          classNameText="text-sm text-foreground/80"
        />
      </div>

      {/*Sub tasks */}
      <div>
        <Separator />
        <ul className="flex flex-col gap-4 pt-2">
          {subTasks?.map((task) => (
            <li key={task.id} className="flex items-center mr-4">
              <Dot className="w-4 h-4" />
              <TaskText
                taskId={task.id}
                taskText={task.title}
                onKeyDown={titleHelper}
                classNameInput=""
                classNameText="text-sm text-foreground/80 cursor-pointer"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default KanbanModal;

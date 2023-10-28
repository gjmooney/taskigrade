import Modal from "@/components/Modal";
import { Task } from "@/db/schema";

interface pageProps {}

const t: Task = {
  createdAt: "dsds",
  createdById: "sdsd",
  description: "sdsds",
  dueDate: new Date(),
  initial: false,
  status: "todo",
  title: "modal",
  id: "ik7optuhctua1dhhmkbazxg2",
  parentId: null,
  priority: null,
  totalTime: 0,
  updatedAt: null,
};

const page = ({}: pageProps) => {
  return (
    <Modal>
      {/* <KanbanModal task={t} /> */}
      <div>sdsdsdssd</div>
    </Modal>
  );
};
export default page;

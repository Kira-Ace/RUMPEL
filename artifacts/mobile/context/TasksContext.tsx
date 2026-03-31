import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Task {
  id: string;
  title: string;
  time: string;
  desc: string;
  tag: string;
}

/** Keys are "YYYY-MM-DD" strings */
export type TasksMap = Record<string, Task[]>;

const STORAGE_KEY = "@rumpel_tasks_v2";

const initialTasks: TasksMap = {
  "2026-03-03": [
    { id: "1", title: "Physics Review", time: "12:30", desc: "Waves & oscillations — chapter 7 problems", tag: "Science" },
    { id: "2", title: "Essay Draft", time: "15:00", desc: "Intro paragraph + thesis for English lit assignment", tag: "English" },
    { id: "3", title: "Math Problem Set", time: "18:00", desc: "Integration by parts, exercises 4–12", tag: "Math" },
  ],
  "2026-03-01": [
    { id: "4", title: "History Notes", time: "10:00", desc: "French Revolution timeline summary", tag: "History" },
  ],
  "2026-03-02": [
    { id: "5", title: "Chemistry Lab Report", time: "09:00", desc: "Titration results and analysis", tag: "Science" },
    { id: "6", title: "Vocabulary Quiz Prep", time: "16:00", desc: "Unit 5 vocab — 30 words", tag: "English" },
    { id: "7", title: "Group Meeting", time: "18:30", desc: "Project sync with team", tag: "Other" },
  ],
  "2026-03-15": [
    { id: "8", title: "Midterm Review", time: "10:00", desc: "All subjects — past papers", tag: "Other" },
    { id: "9", title: "Study Group", time: "14:00", desc: "Library — room 204", tag: "Other" },
  ],
  "2026-03-20": [
    { id: "10", title: "Project Deadline", time: "23:59", desc: "Submit final draft online", tag: "Other" },
  ],
  "2026-03-31": [
    { id: "11", title: "End of Term", time: "09:00", desc: "Last day — check schedule", tag: "Other" },
  ],
  "2026-04-05": [
    { id: "12", title: "Easter Break Starts", time: "00:00", desc: "No classes", tag: "Other" },
  ],
};

interface TasksContextType {
  tasks: TasksMap;
  addTask: (dateKey: string, task: Omit<Task, "id">) => void;
  removeTask: (dateKey: string, taskId: string) => void;
}

const TasksContext = createContext<TasksContextType>({
  tasks: initialTasks,
  addTask: () => {},
  removeTask: () => {},
});

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<TasksMap>(initialTasks);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as TasksMap;
          setTasks(parsed);
        } catch {}
      }
    });
  }, []);

  const persist = useCallback((next: TasksMap) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addTask = useCallback(
    (dateKey: string, task: Omit<Task, "id">) => {
      setTasks((prev) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const next = {
          ...prev,
          [dateKey]: [...(prev[dateKey] || []), { ...task, id }],
        };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeTask = useCallback(
    (dateKey: string, taskId: string) => {
      setTasks((prev) => {
        const next = {
          ...prev,
          [dateKey]: (prev[dateKey] || []).filter((t) => t.id !== taskId),
        };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  return (
    <TasksContext.Provider value={{ tasks, addTask, removeTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

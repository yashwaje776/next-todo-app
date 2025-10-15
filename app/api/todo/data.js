import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "todos.json");
export function readTodos() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]");
      return [];
    }

    const data = fs.readFileSync(filePath, "utf-8");
    if (!data.trim()) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read todos:", error);
    return [];
  }
}

export function writeTodos(todos) {
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
}

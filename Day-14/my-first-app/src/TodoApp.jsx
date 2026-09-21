import { useState, useEffect } from "react";

/* -------------------------------------------------------------------------
   TodoForm  (Create)
   Owns the draft text and validation message for the "add" input.
   ------------------------------------------------------------------------- */
function TodoForm({ onAdd }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Write a task before adding it.");
      return;
    }
    onAdd(trimmed);
    setText("");
    setError("");
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="What needs doing?"
          aria-label="New task"
          aria-invalid={error ? "true" : "false"}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
        />
        <button
          onClick={submit}
          className="rounded-lg bg-teal-700 px-5 py-2.5 font-medium text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
        >
          Add task
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------
   TodoEditor  (Update)
   Mounted only while a task is being edited, so its draft state always
   starts from the task's current text.
   ------------------------------------------------------------------------- */
function TodoEditor({ initialText, onSave, onCancel }) {
  const [draft, setDraft] = useState(initialText);

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed) onSave(trimmed);
  };

  return (
    <div className="flex flex-1 items-center gap-2">
      <input
        type="text"
        value={draft}
        autoFocus
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && save()}
        aria-label="Edit task"
        className="min-w-0 flex-1 rounded-md border border-teal-600 bg-white px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
      />
      <button
        onClick={save}
        disabled={!draft.trim()}
        className="rounded-md bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-teal-600"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
      >
        Cancel
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------
   TodoItem
   One row: checkbox + text (or the editor) + Edit / Delete actions.
   ------------------------------------------------------------------------- */
function TodoItem({
  todo,
  isEditing,
  onToggle,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDelete,
}) {
  return (
    <li className="flex items-center gap-3 border-b border-slate-200 px-1 py-3 last:border-b-0">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.text}" as ${todo.done ? "not done" : "done"}`}
        className="h-5 w-5 shrink-0 cursor-pointer accent-teal-700"
      />

      {isEditing ? (
        <TodoEditor
          initialText={todo.text}
          onSave={(text) => onSave(todo.id, text)}
          onCancel={onCancelEdit}
        />
      ) : (
        <>
          <span
            className={`flex-1 break-words ${
              todo.done ? "text-slate-400 line-through" : "text-slate-900"
            }`}
          >
            {todo.text}
          </span>
          <button
            onClick={() => onStartEdit(todo.id)}
            className="rounded-md px-2.5 py-1 text-sm text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="rounded-md px-2.5 py-1 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Delete
          </button>
        </>
      )}
    </li>
  );
}

/* -------------------------------------------------------------------------
   TodoList  (Read)
   Renders the visible tasks or a helpful empty state.
   ------------------------------------------------------------------------- */
function TodoList({ todos, filter, editingId, handlers }) {
  if (todos.length === 0) {
    const messages = {
      all: "No tasks yet. Add your first one above.",
      active: "Nothing left to do. Enjoy the quiet.",
      done: "No completed tasks yet.",
    };
    return <p className="py-10 text-center text-slate-500">{messages[filter]}</p>;
  }

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isEditing={editingId === todo.id}
          onToggle={handlers.toggle}
          onStartEdit={handlers.startEdit}
          onCancelEdit={handlers.cancelEdit}
          onSave={handlers.save}
          onDelete={handlers.remove}
        />
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------
   FilterBar
   ------------------------------------------------------------------------- */
function FilterBar({ filter, onChange, remaining, hasDone, onClearDone }) {
  const options = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "done", label: "Done" },
  ];

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
      <span className="text-slate-600">
        {remaining} {remaining === 1 ? "task" : "tasks"} left
      </span>

      <div className="flex gap-1" role="group" aria-label="Filter tasks">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            aria-pressed={filter === o.value}
            className={`rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-600 ${
              filter === o.value
                ? "bg-teal-700 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <button
        onClick={onClearDone}
        disabled={!hasDone}
        className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-slate-400"
      >
        Clear completed
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------
   App  (owns all shared state)
   Hooks used in the whole project: useState and useEffect only.
   ------------------------------------------------------------------------- */
export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Review pull requests", done: false },
    { id: 2, text: "Book dentist appointment", done: false },
    { id: 3, text: "Water the plants", done: true },
  ]);
  const [nextId, setNextId] = useState(4);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const remaining = todos.filter((t) => !t.done).length;

  // Effect 1: keep the browser tab title in sync with the number of open tasks.
  useEffect(() => {
    document.title = remaining > 0 ? `(${remaining}) To-do list` : "To-do list";
  }, [remaining]);

  // Effect 2: while a task is being edited, Escape cancels the edit.
  // The listener is added when editing starts and removed when it ends.
  useEffect(() => {
    if (editingId === null) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setEditingId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editingId]);

  // ---- CRUD operations ----------------------------------------------------
  const addTodo = (text) => {
    setTodos((prev) => [{ id: nextId, text, done: false }, ...prev]);
    setNextId((n) => n + 1);
  };

  const updateTodo = (id, text) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
    setEditingId(null);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const clearDone = () => {
    setTodos((prev) => prev.filter((t) => !t.done));
    setEditingId(null);
  };

  // ---- Derived view -------------------------------------------------------
  const visibleTodos = todos.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const handlers = {
    toggle: toggleTodo,
    startEdit: setEditingId,
    cancelEdit: () => setEditingId(null),
    save: updateTodo,
    remove: deleteTodo,
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">To-do list</h1>
        <p className="mb-6 text-sm text-slate-500">
          Add, edit, complete and delete tasks. Press Esc to cancel an edit.
        </p>

        <TodoForm onAdd={addTodo} />

        <TodoList
          todos={visibleTodos}
          filter={filter}
          editingId={editingId}
          handlers={handlers}
        />

        <FilterBar
          filter={filter}
          onChange={setFilter}
          remaining={remaining}
          hasDone={todos.some((t) => t.done)}
          onClearDone={clearDone}
        />
      </div>
    </div>
  );
}

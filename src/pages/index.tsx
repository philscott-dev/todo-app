import { useEffect, useState } from 'react'
import { Todo, TodoItem } from '../components/Todo'
import { TodoList } from '../components/TodoList'
import { sortTodos } from '../helpers/sort'
import { getTodos, updateTodo } from '../services/api'

export default function IndexPage() {
  const [todos, setTodos] = useState<TodoItem[]>([])

  // fetch data on mount
  useEffect(() => {
    async function getData() {
      const res = await getTodos()
      setTodos(sortTodos(res))
    }
    getData()
  }, [])

  const handleUpdateComplete = async ({ isComplete, id }) => {
    const index = todos.findIndex((todo) => todo.id === id)
    if (index < 0) return

    // slice and update
    const updated = [
      ...todos.slice(0, index),
      { ...todos[index], isComplete },
      ...todos.slice(index + 1),
    ]

    // opimistic state update
    setTodos(sortTodos(updated))

    // then validate with the server
    const res = await updateTodo({ id, isComplete })
    // if update wasn't successful, rollback
    if (res?.status !== 'success') {
      setTodos(todos)
      // and throw up an error modal if this were real
    }
  }

  return (
    <TodoList>
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          id={todo.id}
          isComplete={todo.isComplete}
          description={todo.description}
          dueDate={todo.dueDate}
          onToggleComplete={handleUpdateComplete}
        />
      ))}
    </TodoList>
  )
}

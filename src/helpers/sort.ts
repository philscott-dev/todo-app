import { parseISO, isValid } from 'date-fns'
import { TodoItem } from '../components/Todo'

export function sortTodos(todos: TodoItem[]) {
  return (
    todos
      .sort((a, b) => {
        const d1 = parseISO(b.dueDate)
        const d2 = parseISO(a.dueDate)

        // if both dates are valid, compare and order
        if (isValid(d1) && isValid(d2)) {
          return d1 === d2 ? 0 : d1 > d2 ? -1 : 1
        }

        // valid dates ontop of invalid dates
        if (isValid(d1)) return 1
        if (isValid(d2)) return -1
        return 0
      })
      // sort again by completed
      .sort((a, b) => {
        if (a.isComplete === b.isComplete) return 0
        if (!a.isComplete) return -1
        if (!b.isComplete) return 1
        return 0
      })
  )
}

import fetch from 'isomorphic-unfetch'
import { TodoItem } from '../components/Todo'

/**
 * Base Fetch
 */

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: any
}

export async function fetcher<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  try {
    const { method, headers, body } = options
    const res = await fetch(url, {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY,
      },
      method,
      body: JSON.stringify(body),
    })

    return (await res.json()) as T
  } catch (err) {
    console.log(err)
  }
}

/**
 * Services
 */

export async function getTodos() {
  return await fetcher<TodoItem[]>(
    'https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/get',
  )
}

type Status = 'success' | 'failure'
export async function updateTodo({
  isComplete,
  id,
}: Pick<TodoItem, 'id' | 'isComplete'>) {
  return await fetcher<{ status: Status }>(
    `https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/patch/${id}`,

    { method: 'PATCH', body: { isComplete } },
  )
}

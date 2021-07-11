import { ChangeEvent, FC, useMemo } from 'react'
import { isBefore, parseISO, format, isValid } from 'date-fns'
import styled from '@emotion/styled'

export interface TodoItem {
  id: string
  description: string
  isComplete: boolean
  dueDate: string | null
}

export interface TodoProps extends TodoItem {
  className?: string
  onToggleComplete: ({ isComplete: boolean, id: string }) => void
}

export const Todo: FC<TodoProps> = ({
  className,
  id,
  isComplete,
  dueDate,
  description,
  onToggleComplete,
}) => {
  const { isOverdue, formatted } = useMemo(() => {
    const date = parseISO(dueDate)
    return {
      isOverdue: isBefore(date, new Date()),
      formatted: isValid(date) ? format(date, 'MM/dd/yyyy') : null,
    }
  }, [dueDate])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onToggleComplete({
      id,
      isComplete: e.currentTarget.checked,
    })
  }
  return (
    <Wrapper
      className={className}
      isOverdue={isOverdue}
      isComplete={isComplete}
    >
      <div>
        <input
          id={`checkbox_${id}`}
          type="checkbox"
          checked={isComplete}
          onChange={handleChange}
        />
        <label htmlFor={`checkbox_${id}`}>{description}</label>
      </div>

      {dueDate ? <label>{formatted}</label> : null}
    </Wrapper>
  )
}

/**
 * Styled Component
 */

export interface WrapperProps {
  isOverdue?: boolean
  isComplete?: boolean
}

export const Wrapper = styled.li<WrapperProps>`
  display: flex;
  border-radius: 4px;
  margin-bottom: 8px;
  padding: 16px 8px;
  align-items: center;
  min-height: 60px;
  justify-content: space-between;
  box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.15);
  background: ${({ isOverdue, isComplete }) =>
    isComplete ? '#c3ffc1' : isOverdue ? '#fec0c1' : '#f0f0f0'};
  &:hover {
    background: ${({ isOverdue, isComplete }) =>
      isComplete ? '#c3ffc1' : isOverdue ? '#fec0c1' : '#f0f0f0'}B3;
  }

  /* Wrapper Left */
  > div {
    display: flex;
    align-items: center;
  }

  /* Checkbox */
  > div input {
    margin: 0;
    margin-right: 8px;
    background: black;
    cursor: pointer;
  }

  /* Description */
  > div label {
    margin-right: 8px;
    word-wrap: break-word;
    text-decoration: ${({ isComplete }) =>
      isComplete ? 'line-through' : null};
    cursor: pointer;
  }

  /* Date Label */
  > label {
    border: 1px solid #202020;
    padding: 4px;
    background: #fcfcfc;
    min-width: 98px;
    text-align: center;
    border-radius: 2px;
  }
`

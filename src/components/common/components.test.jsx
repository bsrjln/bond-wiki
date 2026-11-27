import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SearchBar from './SearchBar'
import ErrorMessage from './ErrorMessage'
import LoadMoreButton from './LoadMoreButton'

describe('SearchBar', () => {
  it('reports typed text to the parent', () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} label="Search movies" />)
    fireEvent.change(screen.getByLabelText('Search movies'), { target: { value: 'gold' } })
    expect(onChange).toHaveBeenCalledWith('gold')
  })
})

describe('ErrorMessage', () => {
  it('shows a Retry button for network errors', () => {
    const onRetry = vi.fn()
    render(
      <MemoryRouter>
        <ErrorMessage error={{ message: 'offline' }} onRetry={onRetry} />
      </MemoryRouter>,
    )
    expect(screen.getByText('Failed to load data')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalled()
  })

  it('shows "not found" without Retry for 404', () => {
    render(
      <MemoryRouter>
        <ErrorMessage error={{ status: 404, message: 'missing' }} onRetry={() => {}} />
      </MemoryRouter>,
    )
    expect(screen.getByText('This dossier does not exist')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument()
  })
})

describe('LoadMoreButton', () => {
  it('hides the button when everything is shown', () => {
    const { rerender } = render(<LoadMoreButton shown={12} total={27} onClick={() => {}} />)
    expect(screen.getByRole('button', { name: 'Load more' })).toBeInTheDocument()
    rerender(<LoadMoreButton shown={27} total={27} onClick={() => {}} />)
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument()
  })
})

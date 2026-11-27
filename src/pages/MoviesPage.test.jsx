// Integration test: the Movies list page with the API mocked.
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { movies } from '../test/fixtures'
import MoviesPage from './MoviesPage'

vi.mock('../services/api', () => ({ getMovies: vi.fn(() => Promise.resolve(movies)) }))

const renderPage = (url = '/movies') =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <MoviesPage />
    </MemoryRouter>,
  )

describe('MoviesPage', () => {
  it('renders movies from the API', async () => {
    renderPage()
    expect(await screen.findByRole('heading', { name: 'Goldfinger' })).toBeInTheDocument()
    expect(screen.getByText('4 results')).toBeInTheDocument()
  })

  it('filters reactively by search text (debounced)', async () => {
    renderPage()
    await screen.findByRole('heading', { name: 'Goldfinger' })
    fireEvent.change(screen.getByLabelText('Search Movies'), { target: { value: 'gold' } })
    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Dr. No' })).not.toBeInTheDocument())
    expect(screen.getByRole('heading', { name: 'Goldfinger' })).toBeInTheDocument()
  })

  it('reads filters from the URL and shows the empty state', async () => {
    renderPage('/movies?q=zzz')
    expect(await screen.findByText('No matching files')).toBeInTheDocument()
  })

  it('applies a select filter', async () => {
    renderPage()
    await screen.findByRole('heading', { name: 'Goldfinger' })
    fireEvent.change(screen.getByLabelText('Production'), { target: { value: 'non-eon' } })
    await waitFor(() => expect(screen.getByText('1 result (of 4)')).toBeInTheDocument())
  })
})

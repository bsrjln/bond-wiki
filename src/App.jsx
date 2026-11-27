/** Route table for the whole app. Every page renders inside the shared <Layout>. */
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import MoviesPage from './pages/MoviesPage'
import MovieDetailPage from './pages/MovieDetailPage'
import CharactersPage from './pages/CharactersPage'
import CharacterDetailPage from './pages/CharacterDetailPage'
import ActorsPage from './pages/ActorsPage'
import ActorDetailPage from './pages/ActorDetailPage'
import GadgetsPage from './pages/GadgetsPage'
import GadgetDetailPage from './pages/GadgetDetailPage'
import VehiclesPage from './pages/VehiclesPage'
import VehicleDetailPage from './pages/VehicleDetailPage'
import LocationsPage from './pages/LocationsPage'
import LocationDetailPage from './pages/LocationDetailPage'
import OrganizationsPage from './pages/OrganizationsPage'
import OrganizationDetailPage from './pages/OrganizationDetailPage'
import TimelinePage from './pages/TimelinePage'
import StatsPage from './pages/StatsPage'
import SearchPage from './pages/SearchPage'
import DossierPage from './pages/DossierPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="movies" element={<MoviesPage />} />
        <Route path="movies/:slug" element={<MovieDetailPage />} />
        <Route path="characters" element={<CharactersPage />} />
        <Route path="characters/:id" element={<CharacterDetailPage />} />
        <Route path="actors" element={<ActorsPage />} />
        <Route path="actors/:id" element={<ActorDetailPage />} />
        <Route path="gadgets" element={<GadgetsPage />} />
        <Route path="gadgets/:id" element={<GadgetDetailPage />} />
        <Route path="vehicles" element={<VehiclesPage />} />
        <Route path="vehicles/:id" element={<VehicleDetailPage />} />
        <Route path="locations" element={<LocationsPage />} />
        <Route path="locations/:id" element={<LocationDetailPage />} />
        <Route path="organizations" element={<OrganizationsPage />} />
        <Route path="organizations/:id" element={<OrganizationDetailPage />} />
        <Route path="timeline" element={<TimelinePage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="dossier" element={<DossierPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

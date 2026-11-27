/**
 * Movie detail: fact sheet, synopsis, cast, locations, organisations, vehicles,
 * gadgets, action scenes and previous/next film navigation.
 */
import { Link, useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { getMovie, getMovies } from '../services/api'
import { formatMoney } from '../utils/format'
import { findNeighbors } from '../utils/movies'
import AsyncContent from '../components/common/AsyncContent'
import Badge from '../components/common/Badge'
import Poster from '../components/common/Poster'
import FavoriteButton from '../components/common/FavoriteButton'
import DetailHeader from '../components/detail/DetailHeader'
import FactSheet from '../components/detail/FactSheet'
import InfoRow from '../components/detail/InfoRow'
import RelatedList from '../components/detail/RelatedList'
import ExternalLinks from '../components/detail/ExternalLinks'

export default function MovieDetailPage() {
  const { slug } = useParams()

  // The film itself is required; the list (for prev/next) is optional, so its failure is ignored.
  const { data, loading, error, retry } = useFetch(
    (signal) =>
      Promise.all([getMovie(slug, { signal }), getMovies({ signal }).catch(() => null)]).then(([movie, movies]) => ({
        movie,
        ...findNeighbors(movies, slug),
      })),
    [slug],
  )
  useDocumentTitle(data?.movie?.title ?? 'Movie')

  return (
    <article className="page-container">
      <AsyncContent loading={loading} error={error} onRetry={retry} backTo="/movies" backLabel="Back to movies">
        {() => <MovieDetail movie={data.movie} prev={data.prev} next={data.next} />}
      </AsyncContent>
    </article>
  )
}

function MovieDetail({ movie, prev, next }) {
  const cast = movie.cast ?? []
  const path = `/movies/${movie.slug}`

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="mx-auto aspect-[2/3] w-56 overflow-hidden rounded-xl border border-ink-700 shadow-2xl shadow-black/60 lg:w-full">
          <Poster imdb={movie.imdb} title={movie.title} year={movie.release_year} />
        </div>

        <div>
          <DetailHeader
            backTo="/movies"
            backLabel="All movies"
            eyebrow={`Mission file · ${movie.release_year}`}
            title={movie.title}
            subtitle={movie.tagline && `“${movie.tagline}”`}
            badges={
              <>
                {movie.eon_production ? (
                  <Badge variant="gold">EON Production</Badge>
                ) : (
                  <Badge variant="red">Non-EON</Badge>
                )}
                {movie.canonical ? <Badge variant="green">Canonical</Badge> : <Badge>Non-canonical</Badge>}
              </>
            }
            actions={
              <>
                <FavoriteButton
                  item={{ path, type: 'Movie', title: movie.title, subtitle: String(movie.release_year) }}
                />
                <ExternalLinks wikipedia={movie.wikipedia} imdb={movie.imdb} />
              </>
            }
          />

          <p className="mb-6 max-w-3xl leading-relaxed text-slate-300">{movie.synopsis}</p>

          <FactSheet>
            <InfoRow label="Released">{movie.release_year}</InfoRow>
            <InfoRow label="Bond">
              {movie.bond_actor ? (
                <Link to={`/actors/${movie.bond_actor.id}`} className="link-gold">
                  {movie.bond_actor.name}
                </Link>
              ) : (
                'No official Bond actor'
              )}
            </InfoRow>
            <InfoRow label="Director">{movie.director}</InfoRow>
            <InfoRow label="Producer">{movie.producer}</InfoRow>
            <InfoRow label="Theme song">
              {movie.theme_song && (
                <>
                  “{movie.theme_song}” <span className="text-slate-500">— {movie.theme_song_artist}</span>
                </>
              )}
            </InfoRow>
            <InfoRow label="Box office">{formatMoney(movie.box_office_usd)}</InfoRow>
          </FactSheet>
        </div>
      </div>

      <RelatedList
        title="Cast"
        items={cast.map((c) => ({
          key: c.casting_id,
          to: `/actors/${c.actor.id}`,
          title: c.actor.name,
          subtitle: `as ${c.character.name}`,
          meta: c.character.character_type,
        }))}
      />

      <RelatedList
        title="Characters"
        items={cast.map((c) => ({
          key: `char-${c.casting_id}`,
          to: `/characters/${c.character.id}`,
          title: c.character.name,
          subtitle: c.character.description,
          meta: `played by ${c.actor.name}`,
        }))}
      />

      <RelatedList
        title="Locations"
        items={(movie.locations ?? []).map((l) => ({
          key: l.id,
          to: `/locations/${l.id}`,
          title: l.name,
          subtitle: l.country,
          meta: l.location_type,
        }))}
      />

      <RelatedList
        title="Organizations"
        items={(movie.organizations ?? []).map((o) => ({
          key: o.id,
          to: `/organizations/${o.id}`,
          title: o.name,
          subtitle: o.description,
          meta: o.org_type,
        }))}
      />

      <RelatedList
        title="Vehicles"
        items={(movie.vehicles ?? []).map((v) => ({
          key: v.movie_vehicle_id,
          to: `/vehicles/${v.vehicle.id}`,
          title: `${v.vehicle.make} ${v.vehicle.model}`,
          subtitle: v.driver ? `Driven by ${v.driver.name}` : null,
          meta: v.vehicle.has_gadgets ? 'Q-modified' : 'Standard',
        }))}
      />

      <RelatedList
        title="Gadgets"
        items={(movie.gadgets ?? []).map((g) => ({
          key: g.movie_gadget_id,
          to: `/gadgets/${g.gadget.id}`,
          title: g.gadget.name,
          subtitle: g.used_by ? `Used by ${g.used_by.name}` : null,
          meta: g.gadget.provided_by,
        }))}
      />

      <RelatedList
        title="Action scenes"
        items={[...(movie.action_scenes ?? [])]
          .sort((a, b) => a.scene_order - b.scene_order)
          .map((s) => ({
            key: s.id,
            to: s.location ? `/locations/${s.location.id}` : null,
            title: `${s.scene_order}. ${s.name}`,
            subtitle: s.description,
            meta: s.location ? `📍 ${s.location.name}${s.location.country ? `, ${s.location.country}` : ''}` : null,
          }))}
      />

      {/* Previous / next film in release order */}
      {(prev || next) && (
        <nav aria-label="Film navigation" className="mt-14 grid gap-4 border-t border-ink-700 pt-8 sm:grid-cols-2">
          {prev ? (
            <Link
              to={`/movies/${prev.slug}`}
              className="group rounded-xl border border-ink-700 p-4 transition hover:border-gold-500/60"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-slate-500">← Previous film</span>
              <span className="mt-1 block font-display text-lg text-white group-hover:text-gold-300">
                {prev.title} <span className="text-sm text-slate-500">({prev.release_year})</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={`/movies/${next.slug}`}
              className="group rounded-xl border border-ink-700 p-4 text-right transition hover:border-gold-500/60"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-slate-500">Next film →</span>
              <span className="mt-1 block font-display text-lg text-white group-hover:text-gold-300">
                {next.title} <span className="text-sm text-slate-500">({next.release_year})</span>
              </span>
            </Link>
          )}
        </nav>
      )}
    </>
  )
}

import { useParams } from 'react-router-dom'
import { getVehicle } from '../services/api'
import DetailPage from '../components/detail/DetailPage'
import { filmItems } from '../utils/movies'
import DetailHeader from '../components/detail/DetailHeader'
import FactSheet from '../components/detail/FactSheet'
import InfoRow from '../components/detail/InfoRow'
import RelatedList from '../components/detail/RelatedList'
import FavoriteButton from '../components/common/FavoriteButton'
import Badge from '../components/common/Badge'

export default function VehicleDetailPage() {
  const { id } = useParams()
  return (
    <DetailPage
      fetcher={getVehicle}
      id={id}
      getTitle={(v) => `${v.make} ${v.model}`}
      backTo="/vehicles"
      backLabel="Vehicles"
    >
      {(vehicle) => {
        const name = `${vehicle.make} ${vehicle.model}`
        const appearances = vehicle.appearances ?? []
        const drivers = [...new Map(appearances.filter((a) => a.driver).map((a) => [a.driver.id, a.driver])).values()]
        return (
          <>
            <DetailHeader
              backTo="/vehicles"
              backLabel="All vehicles"
              eyebrow={`Motor pool · ${vehicle.year}`}
              title={name}
              badges={vehicle.has_gadgets ? <Badge variant="gold">Q-modified</Badge> : <Badge>Standard</Badge>}
              actions={
                <FavoriteButton
                  item={{
                    path: `/vehicles/${vehicle.id}`,
                    type: 'Vehicle',
                    title: name,
                    subtitle: String(vehicle.year),
                  }}
                />
              }
            />
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              <div className="space-y-4 leading-relaxed text-slate-300">
                <p>{vehicle.description || 'No description on file.'}</p>
                {vehicle.gadget_description && (
                  <div className="rounded-lg border border-gold-500/30 bg-gold-500/5 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-500">
                      Q Branch modifications
                    </p>
                    <p className="mt-2 text-sm">{vehicle.gadget_description}</p>
                  </div>
                )}
              </div>
              <FactSheet>
                <InfoRow label="Make">{vehicle.make}</InfoRow>
                <InfoRow label="Model">{vehicle.model}</InfoRow>
                <InfoRow label="Year">{vehicle.year}</InfoRow>
                <InfoRow label="Colour">{vehicle.color}</InfoRow>
              </FactSheet>
            </div>
            <RelatedList
              title="Appears in"
              items={filmItems(appearances, (f) => (f.driver ? `Driven by ${f.driver.name}` : null))}
            />
            <RelatedList
              title="Drivers"
              items={drivers.map((d) => ({ key: d.id, to: `/characters/${d.id}`, title: d.name }))}
            />
          </>
        )
      }}
    </DetailPage>
  )
}

import { useParams } from 'react-router-dom'
import { getGadget } from '../services/api'
import DetailPage from '../components/detail/DetailPage'
import { filmItems } from '../utils/movies'
import DetailHeader from '../components/detail/DetailHeader'
import FactSheet from '../components/detail/FactSheet'
import InfoRow from '../components/detail/InfoRow'
import RelatedList from '../components/detail/RelatedList'
import FavoriteButton from '../components/common/FavoriteButton'

export default function GadgetDetailPage() {
  const { id } = useParams()
  return (
    <DetailPage fetcher={getGadget} id={id} getTitle={(g) => g.name} backTo="/gadgets" backLabel="Gadgets">
      {(gadget) => {
        const appearances = gadget.appearances ?? []
        // Unique list of characters who used the gadget, linked to their pages.
        const users = [...new Map(appearances.filter((a) => a.used_by).map((a) => [a.used_by.id, a.used_by])).values()]
        return (
          <>
            <DetailHeader
              backTo="/gadgets"
              backLabel="All gadgets"
              eyebrow="Q Branch issue"
              title={gadget.name}
              actions={
                <FavoriteButton
                  item={{
                    path: `/gadgets/${gadget.id}`,
                    type: 'Gadget',
                    title: gadget.name,
                    subtitle: gadget.provided_by,
                  }}
                />
              }
            />
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              <p className="leading-relaxed text-slate-300">{gadget.description || 'No description on file.'}</p>
              <FactSheet>
                <InfoRow label="Provided by">{gadget.provided_by}</InfoRow>
                <InfoRow label="Appearances">{appearances.length}</InfoRow>
              </FactSheet>
            </div>
            <RelatedList
              title="Appears in"
              items={filmItems(appearances, (f) => (f.used_by ? `Used by ${f.used_by.name}` : null))}
            />
            <RelatedList
              title="Used by"
              items={users.map((u) => ({ key: u.id, to: `/characters/${u.id}`, title: u.name }))}
            />
          </>
        )
      }}
    </DetailPage>
  )
}

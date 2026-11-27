import CardFrame, { CardTitle } from './CardFrame'
import Badge from '../common/Badge'
import { pluralize } from '../../utils/format'

const ORG_VARIANT = { criminal: 'red', intelligence: 'green', government: 'blue' }

/** Card for one organisation (MI6, SPECTRE, …). */
export default function OrganizationCard({ organization }) {
  return (
    <CardFrame to={`/organizations/${organization.id}`}>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <CardTitle>{organization.name}</CardTitle>
        <div className="mt-auto flex items-center justify-between pt-2">
          <Badge variant={ORG_VARIANT[organization.org_type]}>{organization.org_type}</Badge>
          <span className="font-mono text-xs text-slate-500">{pluralize(organization.appearance_count, 'film')}</span>
        </div>
      </div>
    </CardFrame>
  )
}

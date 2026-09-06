import achievement from './achievement'
import certificate from './certificate'
import clientProject from './client-project'
import education from './education'
import moment from './moment'
import organisation from './organisation'
import pageMeta from './page-meta'
import post from './post'
import profile from './profile'
import project from './project'
import quote from './quote'
import role from './role'
import service from './service'
import skillGroup from './skill-group'

// One studio and one dataset serve both sites. `clientProject` is the consulting site's
// content; everything else is this one's.
export const schemaTypes = [
  profile,
  organisation,
  pageMeta,
  post,
  project,
  certificate,
  role,
  education,
  achievement,
  service,
  skillGroup,
  moment,
  quote,
  clientProject,
]

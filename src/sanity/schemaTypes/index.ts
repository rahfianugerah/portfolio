import achievement from './achievement'
import certificate from './certificate'
import clientProject from './client-project'
import education from './education'
import moment from './moment'
import post from './post'
import profile from './profile'
import project from './project'
import quote from './quote'
import role from './role'
import skillGroup from './skill-group'

// One studio and one dataset serve both sites. `clientProject` is the consulting site's
// content; everything else is this one's.
export const schemaTypes = [
  profile,
  post,
  project,
  certificate,
  role,
  education,
  achievement,
  skillGroup,
  moment,
  quote,
  clientProject,
]

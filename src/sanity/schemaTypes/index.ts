import achievement from './achievement'
import certificate from './certificate'
import clientProject from './client-project'
import education from './education'
import moment from './moment'
import post from './post'
import project from './project'
import quote from './quote'
import role from './role'

// One studio and one dataset serve both sites. `clientProject` is the consulting site's
// content; everything else is this one's.
export const schemaTypes = [
  post,
  project,
  certificate,
  role,
  education,
  achievement,
  moment,
  quote,
  clientProject,
]

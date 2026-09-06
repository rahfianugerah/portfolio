import certificate from './certificate'
import clientProject from './client-project'
import moment from './moment'
import post from './post'
import project from './project'
import quote from './quote'

// One studio and one dataset serve both sites. `clientProject` is the consulting site's
// content; everything else is this one's.
export const schemaTypes = [post, project, certificate, moment, quote, clientProject]

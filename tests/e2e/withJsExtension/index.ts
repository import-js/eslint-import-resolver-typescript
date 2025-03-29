// import relative
import './tsImportee.js'
import './tsxImportee.js'
import './tsxImportee.jsx'
import './dtsImportee.js'
import './dtsImportee.jsx'
import './foo'
import './foo.js'
import './foo.jsx'
import './bar'

// import using tsconfig.json path mapping
import '#/tsImportee.js'
import '#/tsxImportee.jsx'
import '#/dtsImportee.js'
import '#/dtsImportee.jsx'
import '#/foo'
import '#/foo.js'
import '#/foo.jsx'
import '#/bar'

// import using tsconfig.json base url
import 'tsImportee.js'
import 'tsxImportee.jsx'
import 'dtsImportee.js'
import 'dtsImportee.jsx'
import 'foo'
import 'foo.js'
import 'foo.jsx'
import 'bar'

// import from node_module
import 'typescript/lib/typescript.js'
import 'dummy.js'

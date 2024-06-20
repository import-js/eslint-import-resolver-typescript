// import relative
import './tsImportee'
import './tsxImportee'
import './subfolder/tsImportee'
import './subfolder/tsxImportee'

// import using tsconfig.json path mapping
import 'folder/tsImportee'
import 'folder/tsImportee.js'
import 'folder/tsxImportee'
import 'folder/tsxImportee.js'
import 'folder/subfolder/tsImportee'
import 'folder/subfolder/tsImportee.js'
import 'folder/subfolder/tsxImportee'
import 'folder/subfolder/tsxImportee.js'

// import module with typings set in package.json
import 'folder/module'

// import from node_module
import 'typescript'
import 'dummy.js'

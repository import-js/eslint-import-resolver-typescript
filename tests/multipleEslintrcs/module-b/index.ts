// import relative
import './tsImportee'
import './tsxImportee'
import './subfolder/tsImportee'
import './subfolder/tsxImportee'

// import using tsconfig.json path mapping
import 'folder/tsImportee'
import 'folder/tsxImportee'
import 'folder/subfolder/tsImportee'
import 'folder/subfolder/tsxImportee'

// import from node_module
import 'typescript'
import 'dummy.js'

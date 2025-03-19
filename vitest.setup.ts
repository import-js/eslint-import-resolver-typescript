import { createSnapshotSerializer } from 'path-serializer'
import { expect } from 'vitest'

expect.addSnapshotSerializer(createSnapshotSerializer())

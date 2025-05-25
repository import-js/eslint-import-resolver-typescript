import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { ResolvedResult } from 'eslint-import-context'

vi.mock('eslint-import-context', () => {
  let mockContext: { cwd?: string } | null = null

  return {
    useRuleContext: vi.fn(() => mockContext),
    __setMockContext: (context: { cwd?: string } | null) => {
      mockContext = context
    },
    __getMockContext: () => mockContext,
  }
})

import {
  resolve,
  createTypeScriptImportResolver,
} from 'eslint-import-resolver-typescript'
import { useRuleContext } from 'eslint-import-context'

const mockModule = (await import('eslint-import-context')) as any

describe('Context-aware import resolution', () => {
  const originalCwd = process.cwd()
  const testCwd1 = '/test/project1'
  const testCwd2 = '/test/project2'

  beforeEach(() => {
    vi.clearAllMocks()
    mockModule.__setMockContext(null)
  })

  afterEach(() => {
    mockModule.__setMockContext(null)
  })

  describe('Dynamic cwd resolution', () => {
    it('should use context.cwd when available', () => {
      const mockResolve = vi
        .fn()
        .mockReturnValue({ found: false } as ResolvedResult)
      const mockResolverFactory = vi
        .fn()
        .mockImplementation(() => ({ sync: mockResolve }))
      vi.doMock('unrs-resolver', () => ({
        ResolverFactory: mockResolverFactory,
      }))

      mockModule.__setMockContext({ cwd: testCwd1 })

      resolve('some-module', '/test/file.ts', {})

      expect(useRuleContext).toHaveBeenCalled()
      expect(mockResolve).toHaveBeenCalled()
    })

    it('should fallback to process.cwd() when context is null', () => {
      const mockResolve = vi
        .fn()
        .mockReturnValue({ found: false } as ResolvedResult)
      const mockResolverFactory = vi
        .fn()
        .mockImplementation(() => ({ sync: mockResolve }))
      vi.doMock('unrs-resolver', () => ({
        ResolverFactory: mockResolverFactory,
      }))

      mockModule.__setMockContext(null)

      resolve('some-module', '/test/file.ts', {})

      expect(useRuleContext).toHaveBeenCalled()
      expect(mockResolve).toHaveBeenCalled()
    })

    it('should fallback to process.cwd() when context.cwd is undefined', () => {
      const mockResolve = vi
        .fn()
        .mockReturnValue({ found: false } as ResolvedResult)
      const mockResolverFactory = vi
        .fn()
        .mockImplementation(() => ({ sync: mockResolve }))
      vi.doMock('unrs-resolver', () => ({
        ResolverFactory: mockResolverFactory,
      }))

      mockModule.__setMockContext({})

      resolve('some-module', '/test/file.ts', {})

      expect(useRuleContext).toHaveBeenCalled()
      expect(mockResolve).toHaveBeenCalled()
    })
  })

  describe('Cache key generation', () => {
    it('should generate cache key with null character separator', () => {
      const mockResolverFactory = vi.fn()
      vi.doMock('unrs-resolver', () => ({
        ResolverFactory: mockResolverFactory.mockImplementation(() => ({
          sync: vi.fn().mockReturnValue({ found: false } as ResolvedResult),
        })),
      }))

      mockModule.__setMockContext({ cwd: testCwd1 })

      resolve('some-module', '/test/file.ts', {})

      expect(mockResolverFactory).toHaveBeenCalledTimes(1)
    })

    it('should create separate cache entries for different cwd values', () => {
      const mockResolverFactory = vi.fn()
      vi.doMock('unrs-resolver', () => ({
        ResolverFactory: mockResolverFactory.mockImplementation(() => ({
          sync: vi.fn().mockReturnValue({ found: false } as ResolvedResult),
        })),
      }))

      // First resolution with testCwd1
      mockModule.__setMockContext({ cwd: testCwd1 })
      resolve('some-module', '/test/file.ts', {})

      // Second resolution with testCwd2 should create new resolver
      mockModule.__setMockContext({ cwd: testCwd2 })
      resolve('some-module', '/test/file.ts', {})

      expect(mockResolverFactory).toHaveBeenCalledTimes(2)
    })

    it('should reuse cache for same cwd and options', () => {
      const mockResolverFactory = vi.fn()
      vi.doMock('unrs-resolver', () => ({
        ResolverFactory: mockResolverFactory.mockImplementation(() => ({
          sync: vi.fn().mockReturnValue({ found: false } as ResolvedResult),
        })),
      }))

      mockModule.__setMockContext({ cwd: testCwd1 })

      resolve('some-module', '/test/file1.ts', {})
      resolve('another-module', '/test/file2.ts', {})

      expect(mockResolverFactory).toHaveBeenCalledTimes(1)
    })
  })

  describe('createTypeScriptImportResolver context switching', () => {
    it('should update cwd and recreate resolver when context changes', () => {
      const mockResolverFactory = vi.fn()
      const mockCloneWithOptions = vi.fn()

      const mockResolver = {
        sync: vi.fn().mockReturnValue({ found: false } as ResolvedResult),
        cloneWithOptions: mockCloneWithOptions,
      }

      vi.doMock('unrs-resolver', () => ({
        ResolverFactory: mockResolverFactory.mockImplementation(
          () => mockResolver,
        ),
      }))

      mockModule.__setMockContext(null)
      const resolver = createTypeScriptImportResolver({
        project: ['./tsconfig.json'],
      })

      resolver.resolve('some-module', '/test/file.ts')

      mockModule.__setMockContext({ cwd: testCwd1 })
      resolver.resolve('another-module', '/test/file.ts')

      expect(useRuleContext).toHaveBeenCalledTimes(2)
      expect(mockCloneWithOptions).toHaveBeenCalled()
    })

    it('should create new resolver when no existing resolver and context changes', () => {
      const mockResolverFactory = vi.fn()

      const mockResolver = {
        sync: vi.fn().mockReturnValue({ found: false } as ResolvedResult),
      }

      vi.doMock('unrs-resolver', () => ({
        ResolverFactory: mockResolverFactory.mockImplementation(
          () => mockResolver,
        ),
      }))

      mockModule.__setMockContext(null)
      const resolver = createTypeScriptImportResolver({
        project: ['./tsconfig.json'],
      })

      mockModule.__setMockContext({ cwd: testCwd1 })
      resolver.resolve('some-module', '/test/file.ts')

      expect(mockResolverFactory).toHaveBeenCalled()
    })

    it('should not recreate resolver when cwd remains the same', () => {
      const mockResolverFactory = vi.fn()
      const mockCloneWithOptions = vi.fn()

      const mockResolver = {
        sync: vi.fn().mockReturnValue({ found: false } as ResolvedResult),
        cloneWithOptions: mockCloneWithOptions,
      }

      vi.doMock('unrs-resolver', () => ({
        ResolverFactory: mockResolverFactory.mockImplementation(
          () => mockResolver,
        ),
      }))

      mockModule.__setMockContext({ cwd: testCwd1 })
      const resolver = createTypeScriptImportResolver({
        project: ['./tsconfig.json'],
      })

      resolver.resolve('some-module', '/test/file1.ts')
      resolver.resolve('another-module', '/test/file2.ts')

      expect(useRuleContext).toHaveBeenCalledTimes(2)
      expect(mockCloneWithOptions).not.toHaveBeenCalled()
    })

    it('should handle interfaceVersion and name properties correctly', () => {
      mockModule.__setMockContext(null)
      const resolver = createTypeScriptImportResolver()

      expect(resolver.interfaceVersion).toBe(3)
      expect(resolver.name).toBe('eslint-import-resolver-typescript')
    })
  })

  describe('Function signature compatibility', () => {
    it('should handle optional parameters correctly in resolve function', () => {
      mockModule.__setMockContext({ cwd: testCwd1 })

      expect(() => resolve('module', '/file.ts', {}, null)).not.toThrow()
      expect(() => resolve('module', '/file.ts')).not.toThrow()
      expect(() => resolve('module', '/file.ts', undefined)).not.toThrow()
    })

    it('should handle optional parameters correctly in createTypeScriptImportResolver', () => {
      mockModule.__setMockContext(null)

      expect(() => createTypeScriptImportResolver({})).not.toThrow()
      expect(() => createTypeScriptImportResolver()).not.toThrow()
      expect(() => createTypeScriptImportResolver(null)).not.toThrow()
    })
  })
})

let mockMode: 'success' | 'empty' | 'error' = 'success'

// Allow tests to control what the mock should return
export const __setMockMode = (mode: 'success' | 'empty' | 'error') => {
  mockMode = mode
}

export const createServerComponentClient = jest.fn(() => {
  return {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(async () => {
          if (mockMode === 'success') {
            return { data: [{ id: 1, text: 'mocked row' }], error: null }
          }
          if (mockMode === 'empty') {
            return { data: [], error: null }
          }
          return { data: null, error: { message: 'DB error' } }
        }),
      })),
    })),
  }
})

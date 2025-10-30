let inMemoryAccessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token
}

export const getAccessToken = (): string | null => inMemoryAccessToken

export const clearAccessToken = () => {
  inMemoryAccessToken = null
}



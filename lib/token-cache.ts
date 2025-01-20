// The token cache is used to persist the active user's session token. 
// Clerk stores this token in memory by default. However, it is recommended
// to use a token cache for production apps.

export interface TokenCache {
    getToken: (key: string) => Promise<string | undefined | null>
    saveToken: (key: string, token: string) => Promise<void>
    clearToken?: (key: string) => void
}
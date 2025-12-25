// In cookie-based auth flows the auth token is stored in an HTTP-only cookie
// which isn't accessible from JS. This helper intentionally returns null so
// callers rely on cookie-based authentication (axios is configured with
// `withCredentials: true` in `lib/api`).
export const getAuthToken = (): string | null => {
    return null;
};

export default getAuthToken;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// All backend endpoint paths in one place.
// Functions return dynamic segments to avoid manual string concatenation at call sites.
const API_ROUTES = {
  USERS: "/api/users",
  USERS_LOGIN: "/api/users/login",
  JOURNAL: "/api/journal",
  JOURNAL_ANALYZE: "/api/journal/analyze",
  JOURNAL_BY_USER: (username) => `/api/journal/${username}`,
  JOURNAL_ANALYZE_BY_ID: (id) => `/api/journal/${id}/analyze`,
  INSIGHTS: (userId) => `/api/journal/insights/${userId}`,
};

export { API_BASE_URL, API_ROUTES };

import apiFetch from '@/services/api';
import { API_ROUTES } from '@/constants/api.constants';

// Creates a new user (registration) by username.
// Returns { id, username, createdAt } on success.
// Throws ConflictError (409) if the username is already taken.
// Throws ValidationError (400) if the username fails backend validation.
async function createUser(username) {
  return apiFetch(API_ROUTES.USERS, {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
}

// Logs in an existing user by username.
// Returns { id, username, createdAt } on success.
// Throws NotFoundError (404) if no account exists with that username.
async function loginUser(username) {
  return apiFetch(API_ROUTES.USERS_LOGIN, {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
}

export { createUser, loginUser };

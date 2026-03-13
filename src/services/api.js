import { API_BASE_URL } from "@/constants/api.constants";

// Typed error classes so callers can distinguish failure reasons
// without parsing error message strings.

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.status = 409;
  }
}

export class RateLimitError extends Error {
  constructor(message) {
    super(message);
    this.name = "RateLimitError";
    this.status = 429;
  }
}

export class ExternalServiceError extends Error {
  constructor(message) {
    super(message);
    this.name = "ExternalServiceError";
    this.status = 502;
  }
}

// Maps an HTTP status code to the appropriate typed error class.
// Falls back to a generic Error for unexpected status codes.
function mapStatusToError(status, message) {
  switch (status) {
    case 400:
      return new ValidationError(message);
    case 404:
      return new NotFoundError(message);
    case 409:
      return new ConflictError(message);
    case 429:
      return new RateLimitError(message);
    case 502:
      return new ExternalServiceError(message);
    default:
      return new Error(message || `Request failed with status ${status}`);
  }
}

// Base fetch wrapper for all API requests.
// Prepends API_BASE_URL, sets default headers, unwraps the backend envelope
// ({ statusCode, data, message, success }), and maps error responses to
// typed Error subclasses so callers never deal with raw status codes.
// Throws on network failure or non-2xx responses.
async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  let response;

  try {
    response = await fetch(url, config);
  } catch {
    // fetch() itself threw — network is unreachable
    throw new Error(
      "Could not connect to server. Check your internet connection.",
    );
  }

  // Parse JSON body regardless of status so we can extract the error message
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(
      `Unexpected response from server (status ${response.status})`,
    );
  }

  if (!response.ok) {
    const message =
      body?.message || `Request failed with status ${response.status}`;
    throw mapStatusToError(response.status, message);
  }

  // Unwrap the standard backend envelope and return only the data payload
  return body.data;
}

export default apiFetch;

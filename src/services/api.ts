export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

type ApiErrorResponse = {
  message?: string;
};

function buildHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function post<T, B = unknown>(
  url: string,
  data: B,
  token?: string,
): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(data),
  });

  const json = (await res.json()) as unknown;

  if (!res.ok) {
    const errorData = json as ApiErrorResponse;
    throw new Error(errorData.message || "Erro na requisição");
  }

  return json as T;
}

export async function put<T, B = unknown>(
  url: string,
  data: B,
  token?: string,
): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify(data),
  });

  const json = (await res.json()) as unknown;

  if (!res.ok) {
    const errorData = json as ApiErrorResponse;
    throw new Error(errorData.message || "Erro na requisição");
  }

  return json as T;
}

export async function get<T>(url: string, token?: string): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: "GET",
    headers: buildHeaders(token),
  });

  const json = (await res.json()) as unknown;

  if (!res.ok) {
    const errorData = json as ApiErrorResponse;
    throw new Error(errorData.message || "Erro na requisição");
  }

  return json as T;
}

export async function del<T>(url: string, token?: string): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

  const json = (await res.json()) as unknown;

  if (!res.ok) {
    const errorData = json as ApiErrorResponse;
    throw new Error(errorData.message || "Erro na requisição");
  }

  return json as T;
}

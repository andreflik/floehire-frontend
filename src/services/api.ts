export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

type ApiErrorResponse = {
  message?: string;
};

export async function post<T, B = unknown>(url: string, data: B): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = (await res.json()) as unknown;

  if (!res.ok) {
    const errorData = json as ApiErrorResponse;
    throw new Error(errorData.message || "Erro na requisição");
  }

  return json as T;
}

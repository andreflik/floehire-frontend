import { API_URL } from "./api";

type CreateJobPayload = {
  title: string;
  description?: string | null;
  seniority?: string | null;
  work_model?: string | null;
  contract_type?: string | null;
  hire_type?: string | null;
  city?: string | null;
  state?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  deadline?: string | null;
};

function getAccessToken() {
  const raw = localStorage.getItem("floehire:auth");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.access_token ?? null;
  } catch {
    return null;
  }
}

export async function createRecruiterJob(payload: CreateJobPayload) {
  const token = getAccessToken();
  if (!token) throw new Error("Você precisa estar logado como recruiter.");

  const res = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || data?.error || "Erro ao criar vaga");
  }

  return data;
}

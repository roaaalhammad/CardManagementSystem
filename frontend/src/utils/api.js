import { API_BASE_URL } from "../config";

function authHeaders(extra = {}) {
  const token = localStorage.getItem("token");
  return { ...extra, Authorization: `Bearer ${token}` };
}

async function parseError(res) {
  const data = await res.json().catch(() => ({}));
  return data.message || "حدث خطأ أثناء الاتصال بالخادم";
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function apiGetBlob(path) {
  const res = await fetch(`${API_BASE_URL}${path}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  return res.blob();
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "حدث خطأ أثناء الاتصال بالخادم");
  return data;
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "حدث خطأ أثناء الاتصال بالخادم");
  return data;
}

export async function apiPostForm(path, formData) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "حدث خطأ أثناء الاتصال بالخادم");
  return data;
}

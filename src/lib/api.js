const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  register: (username, password) =>
    request("/auth/register", { method: "POST", body: { username, password } }),

  login: (username, password) =>
    request("/auth/login", { method: "POST", body: { username, password } }),

  listRooms: (token) => request("/rooms", { token }),

  createRoom: (token, name, isGroup, memberUsernames = []) =>
    request("/rooms", {
      method: "POST",
      token,
      body: { name, isGroup, memberUsernames },
    }),

  getMessages: (token, roomId, limit = 50) =>
    request(`/rooms/${roomId}/messages?limit=${limit}`, { token }),

  getRoomMembers: (token, roomId) =>
    request(`/rooms/${roomId}/members`, { token }),

  uploadFile: async (token, roomId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/upload/${roomId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Upload failed (${res.status})`);
    }
    return data;
  },
};

export { API_BASE };

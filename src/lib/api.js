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

  createDirectRoom: (token, username) =>
    request("/rooms", {
      method: "POST",
      token,
      body: { name: `direct_${username}`, isGroup: false, memberUsernames: [username] },
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

  // User search
  searchUsers: (token, query) =>
    request(`/users/search?q=${encodeURIComponent(query)}`, { token }),

  // Chat requests
  getRequests: (token) => request("/requests", { token }),
  sendRequest: (token, username, message = "") =>
    request("/requests", { method: "POST", token, body: { username, message } }),
  actionRequest: (token, requestId, action) =>
    request(`/requests/${requestId}/action`, { method: "POST", token, body: { action } }),
  cancelRequest: (token, requestId) =>
    request(`/requests/${requestId}`, { method: "DELETE", token }),

  // Block users
  getBlockedUsers: (token) => request("/users/blocked", { token }),
  blockUser: (token, username) =>
    request("/users/block", { method: "POST", token, body: { username } }),
  unblockUser: (token, username) =>
    request(`/users/block/${encodeURIComponent(username)}`, { method: "DELETE", token }),
};

export { API_BASE };
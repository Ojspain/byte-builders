const baseURL = import.meta.env.VITE_API_BASE_URL || "";

export const fetchApi = async (endpoint, options = {}) => {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${baseURL}${path}`, {
    ...options,
    headers,
  });

  return response;
};

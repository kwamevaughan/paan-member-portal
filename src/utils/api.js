const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

const apiFetch = async (url, options = {}) => {
  let accessToken = localStorage.getItem("access_token");
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  console.log("Fetching URL:", fullUrl, "with token:", !!accessToken);

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  };

  let response;
  try {
    response = await fetch(fullUrl, config);
    console.log("Response status:", response.status, "URL:", fullUrl);
  } catch (err) {
    console.error("Fetch error:", err.message, "URL:", fullUrl);
    throw new Error(`Network error: ${err.message}`);
  }

  

  const contentType = response.headers.get("content-type");
  const text = await response.text();

  if (contentType && contentType.includes("application/json")) {
    try {
      const data = JSON.parse(text);
      if (!response.ok) {
        console.error("API error response:", data, "Status:", response.status);
        throw new Error(
          data.msg || `HTTP ${response.status}: ${response.statusText}`
        );
      }
      return data;
    } catch (err) {
      console.error("JSON parse error:", err.message, "Response text:", text);
      throw new Error(`Failed to parse JSON response: ${err.message}`);
    }
  } else {
    console.error(
      `Expected JSON, got content-type: ${contentType}, body: ${text}`
    );
    throw new Error(`Expected JSON response, got: ${text}`);
  }
};

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      console.error("No refresh token available");
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const contentType = response.headers.get("content-type");
    const text = await response.text();

    if (!response.ok) {
      console.error(
        "Refresh token response:",
        text,
        "Status:",
        response.status
      );
      throw new Error(`Refresh token failed: HTTP ${response.status}`);
    }

    if (contentType && contentType.includes("application/json")) {
      const data = JSON.parse(text);
      localStorage.setItem("access_token", data.access_token);
      console.log("Token refreshed successfully");
      return data.access_token;
    } else {
      console.error("Refresh token non-JSON response:", text);
      throw new Error("Expected JSON response from refresh endpoint");
    }
  } catch (error) {
    console.error("Token refresh error:", error.message);
    localStorage.clear();
    return null;
  }
};

export { apiFetch, refreshToken };

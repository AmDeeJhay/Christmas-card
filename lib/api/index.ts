import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('Missing NEXT_PUBLIC_BACKEND_URL environment variable. Set it in .env.local');
}

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log("=== OUTGOING REQUEST ===");
    console.log("Method:", config.method?.toUpperCase());
    console.log("Full URL:", `${config.baseURL}${config.url}`);
    console.log("Headers:", config.headers);
    console.log("Data:", config.data);
    console.log("========================");
    return config;
  },
  (error) => {
    console.error("❌ REQUEST INTERCEPTOR ERROR:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("=== SUCCESSFUL RESPONSE ===");
    console.log("Status:", response.status);
    console.log("Data:", response.data);
    console.log("===========================");
    return response;
  },
  (error) => {
    console.error("=== ERROR RESPONSE ===");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Response Status:", error.response?.status);
    console.error("Response Data:", error.response?.data);
    console.error("Response Headers:", error.response?.headers);
    console.error("Config URL:", error.config?.url);
    console.error("Config BaseURL:", error.config?.baseURL);
    console.error("Config Data:", error.config?.data);
    console.error("Is Axios Error:", axios.isAxiosError(error));

    // Log the full error object for 500 errors
    if (error.response?.status === 500) {
      console.error("🔴 500 INTERNAL SERVER ERROR");
      console.error("Backend error details:", JSON.stringify(error.response?.data, null, 2));
      console.error("This is a BACKEND error. Check your backend logs!");
    }

    if (error.code === 'ECONNABORTED') {
      console.error("❌ Request timeout");
    } else if (error.code === 'ERR_NETWORK') {
      console.error("❌ Network error - possible causes:");
      console.error("   1. Backend server is not running");
      console.error("   2. Wrong BACKEND_URL");
      console.error("   3. CORS not configured on backend");
      console.error("   4. Backend URL has typo or wrong port");
    } else if (!error.response) {
      console.error("❌ No response received - backend might be down");
    }
    console.error("======================");

    return Promise.reject(error);
  }
);

// Types
export interface SendMagicLinkResponse {
  success: boolean;
  url: string;
  userId: string;
}

export interface CreateMessageResponse {
  success: boolean;
  slug: string;
}

export interface CheckMessageExistsResponse {
  success: boolean;
  exists: boolean;
}

export interface CreateTextMessageData {
  recipientFirstName: string;
  recipientLastName: string;
  text: string;
  theme: string;
  password: string;
  passwordHint: string;
  hint: string;
  senderId: string;
}

export interface CreateVideoMessageData {
  recipientFirstName: string;
  recipientLastName: string;
  theme: string;
  password: string;
  passwordHint: string;
  file: File;
  senderId: string;
}

export interface MessageData {
  id: string;
  type: "text" | "video";
  recipientFirstName: string;
  recipientLastName: string;
  text?: string;
  message?: string; // Some backends use 'message' instead of 'text'
  videoUrl?: string;
  theme: string;
  senderId: string;
  createdAt: string;
}

export interface ReplyData {
  text: string;
}

export interface ReplyResponse {
  success: boolean;
  replyId: string;
}

// Authentication endpoints
export const sendMagicLink = async (
  email: string,
  name: string
): Promise<SendMagicLinkResponse> => {
  try {
    const response = await api.post("/auth/add-user", { email, name });
    return response.data;
  } catch (error: any) {
    console.error('sendMagicLink error:', error);
    throw error;
  }
};

export const verifyMagicLink = async (token: string): Promise<void> => {
  try {
    await api.get(`/auth/magic/${token}`);
  } catch (error: any) {
    console.error('verifyMagicLink error:', error);
    throw error;
  }
};

// Messages endpoints
export const createTextMessage = async (
  data: CreateTextMessageData,
  token?: string
): Promise<CreateMessageResponse> => {
  const maxAttempts = 3;
  let attempt = 0;

  const payload = {
    type: "text",
    recipientFirstName: data.recipientFirstName,
    recipientLastName: data.recipientLastName,
    text: data.text,
    theme: data.theme,
    password: data.password || "",
    passwordHint: data.passwordHint || "",
    hint: data.hint || "",
    senderId: data.senderId,
  };

  console.log('📤 Creating text message with payload:', payload);
  console.log('📤 Payload as JSON:', JSON.stringify(payload, null, 2));

  while (attempt < maxAttempts) {
    try {
      const config: any = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log(`Attempt ${attempt + 1} of ${maxAttempts}`);
      const response = await api.post("/messages", payload, config);
      console.log('✅ Text message created successfully:', response.data);
      return response.data;
    } catch (err: any) {
      attempt++;
      console.error(`❌ Attempt ${attempt} failed:`, err.message);

      // Check if it's a network error
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        console.error("🔴 NETWORK ERROR DETECTED");
        console.error("This usually means:");
        console.error("1. Backend is not running at:", BACKEND_URL);
        console.error("2. CORS is blocking the request");
        console.error("3. Wrong URL/port in BACKEND_URL");

        // Don't retry network errors immediately - they won't help
        if (attempt >= maxAttempts) {
          throw new Error(`Cannot connect to server at ${BACKEND_URL}. Please check if the backend is running.`);
        }
      }

      const status = err?.response?.status;
      const isRetryable = !err?.response || (status >= 500 && status < 600);

      if (attempt >= maxAttempts || !isRetryable) {
        const errorMessage = err?.response?.data?.message
          || err?.response?.data?.error
          || err?.message
          || 'Failed to create message';
        throw new Error(errorMessage);
      }

      const delay = 200 * Math.pow(2, attempt - 1);
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw new Error('Failed to create message after multiple attempts');
};

export const createVideoMessage = async (
  data: CreateVideoMessageData,
  token?: string
): Promise<CreateMessageResponse> => {
  const formData = new FormData();
  formData.append("type", "video");
  formData.append("recipientFirstName", data.recipientFirstName);
  formData.append("recipientLastName", data.recipientLastName);
  formData.append("theme", data.theme);
  formData.append("password", data.password || "");
  formData.append("passwordHint", data.passwordHint || "");
  formData.append("file", data.file);
  formData.append("senderId", data.senderId);

  const maxAttempts = 3;
  let attempt = 0;

  console.log('📤 Creating video message');

  while (attempt < maxAttempts) {
    try {
      const config: any = {
        headers: {}
      };

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Don't set Content-Type for FormData - browser will set it with boundary

      console.log(`Attempt ${attempt + 1} of ${maxAttempts}`);
      const response = await api.post("/messages", formData, config);
      console.log('✅ Video message created successfully:', response.data);
      return response.data;
    } catch (err: any) {
      attempt++;
      console.error(`❌ Video upload attempt ${attempt} failed:`, err.message);

      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        if (attempt >= maxAttempts) {
          throw new Error(`Cannot connect to server at ${BACKEND_URL}. Please check if the backend is running.`);
        }
      }

      const status = err?.response?.status;
      const isRetryable = !err?.response || (status >= 500 && status < 600);

      if (attempt >= maxAttempts || !isRetryable) {
        const errorMessage = err?.response?.data?.message
          || err?.response?.data?.error
          || err?.message
          || 'Failed to create video message';
        throw new Error(errorMessage);
      }

      const delay = 200 * Math.pow(2, attempt - 1);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw new Error('Failed to create video message after multiple attempts');
};

export const checkMessageExists = async (
  slug: string
): Promise<CheckMessageExistsResponse> => {
  try {
    const response = await api.get(`/messages/${slug}/exists`);
    return response.data;
  } catch (error: any) {
    console.error('checkMessageExists error:', error);
    throw error;
  }
};

export const createMessageMagicLink = async (
  slug: string,
  token?: string
): Promise<{ success: boolean }> => {
  try {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    const response = await api.post(`/messages/${slug}/magic-link`, {}, config);
    return response.data;
  } catch (error: any) {
    console.error('createMessageMagicLink error:', error);
    throw error;
  }
};

export const openMessageViaMagicLink = async (
  slug: string,
  magicToken: string
): Promise<MessageData> => {
  try {
    const response = await api.get(`/messages/${slug}/magic/${magicToken}`);
    return response.data;
  } catch (error: any) {
    console.error('openMessageViaMagicLink error:', error);
    throw error;
  }
};

export const openMessage = async (slug: string): Promise<MessageData> => {
  try {
    if (!slug || slug === "undefined") {
      throw new Error("Message slug is missing");
    }

    const response = await api.get(`/messages/${slug}`);
    return response.data?.data || response.data?.message || response.data;
  } catch (error: any) {
    console.error('❌ openMessage error:', error);
    throw error;
  }
}

export const replyToMessage = async (
  slug: string,
  replyData: ReplyData,
  token?: string
): Promise<ReplyResponse> => {
  try {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    const response = await api.post(`/messages/${slug}/reply`, replyData, config);
    return response.data;
  } catch (error: any) {
    console.error('replyToMessage error:', error);
    throw error;
  }
};
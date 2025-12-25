import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error('Missing NEXT_PUBLIC_BACKEND_URL environment variable. Set it in .env.local');
}

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000, // 30 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
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
  senderId: string;
}

export interface CreateVideoMessageData {
  recipientFirstName: string;
  recipientLastName: string;
  theme: string;
  file: File;
  senderId: string;
}

export interface MessageData {
  id: string;
  type: "text" | "video";
  recipientFirstName: string;
  recipientLastName: string;
  text?: string;
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
    throw new Error(error.response?.data?.message || 'Failed to send magic link');
  }
};

export const verifyMagicLink = async (token: string): Promise<void> => {
  try {
    await api.get(`/auth/magic/${token}`);
  } catch (error: any) {
    console.error('verifyMagicLink error:', error);
    throw new Error(error.response?.data?.message || 'Failed to verify magic link');
  }
};

// Messages endpoints
export const createTextMessage = async (
  data: CreateTextMessageData,
  token?: string
): Promise<CreateMessageResponse> => {
  const maxAttempts = 3;
  let attempt = 0;

  // Prepare the payload - ensure all fields are present
  const payload = {
    type: "text",
    recipientFirstName: data.recipientFirstName,
    recipientLastName: data.recipientLastName,
    text: data.text,
    theme: data.theme,
    senderId: data.senderId,
  };

  console.log('Creating text message with payload:', payload);

  while (attempt < maxAttempts) {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const response = await api.post("/messages", payload, config);
      return response.data;
    } catch (err: any) {
      attempt++;
      console.error(`Attempt ${attempt} failed:`, err);

      const status = err?.response?.status;
      const isRetryable = !err?.response || (status >= 500 && status < 600);

      if (attempt >= maxAttempts || !isRetryable) {
        // Throw a more descriptive error
        const errorMessage = err?.response?.data?.message
          || err?.response?.data?.error
          || err?.message
          || 'Failed to create message';
        throw new Error(errorMessage);
      }

      // Exponential backoff
      const delay = 200 * Math.pow(2, attempt - 1);
      console.log(`Retrying in ${delay}ms...`);
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
  formData.append("file", data.file);
  formData.append("senderId", data.senderId);

  const maxAttempts = 3;
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      const config = token
        ? {
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type, let browser set it with boundary
          }
        }
        : {};

      const response = await api.post("/messages", formData, config);
      return response.data;
    } catch (err: any) {
      attempt++;
      console.error(`Video upload attempt ${attempt} failed:`, err);

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
    throw new Error(error.response?.data?.message || 'Failed to check message');
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
    throw new Error(error.response?.data?.message || 'Failed to create magic link');
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
    throw new Error(error.response?.data?.message || 'Failed to open message');
  }
};

export const openMessage = async (
  slug: string
): Promise<MessageData> => {
  try {
    const response = await api.get(`/messages/${slug}`);
    return response.data;
  } catch (error: any) {
    console.error('openMessage error:', error);
    throw new Error(error.response?.data?.message || 'Failed to open message');
  }
};

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
    throw new Error(error.response?.data?.message || 'Failed to send reply');
  }
};
import axios, { AxiosError } from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error(
    "Missing NEXT_PUBLIC_BACKEND_URL environment variable. Set it in .env.local"
  );
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
    console.log("API Request:", {
      method: config.method,
      url: config.url,
      data: config.data,
    });
    return config;
  },
  (error: AxiosError) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error("Response Error:", {
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

export interface ErrorResponse {
  message?: string;
  error?: string;
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
  slug: string;
  recipient_first_name: string;
  recipient_last_name: string;
  type: "text" | "video";
  theme: string;
  password: string; // hashed
  password_hint: string;
  video_url?: string;
  sender_id: string;
  created_at: string;
  text?: string;
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
  } catch (error: unknown) {
    console.error("sendMagicLink error:", error);
    throw new Error(
      (error as AxiosError<ErrorResponse>).response?.data?.message ||
      "Failed to send magic link"
    );
  }
};

export const verifyMagicLink = async (token: string): Promise<void> => {
  try {
    await api.get(`/auth/magic/${token}`);
  } catch (error: unknown) {
    console.error("verifyMagicLink error:", error);
    throw new Error(
      (error as AxiosError<ErrorResponse>).response?.data?.message ||
      "Failed to verify magic link"
    );
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

  console.log("Creating text message with payload:", payload);

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
    } catch (err: unknown) {
      attempt++;
      const anyErr = err as any;
      console.error(`❌ Attempt ${attempt} failed:`, anyErr?.message || anyErr);

      // Check if it's a network error
      if (anyErr?.code === "ERR_NETWORK" || anyErr?.message === "Network Error") {
        if (attempt >= maxAttempts) {
          throw new Error(
            `Cannot connect to server at ${BACKEND_URL}. Please check if the backend is running.`
          );
        }
      }

      const status = (err as AxiosError)?.response?.status;
      const isRetryable =
        !(err as AxiosError)?.response || (status && status >= 500 && status < 600);

      if (attempt >= maxAttempts || !isRetryable) {
        const errorMessage =
          (err as AxiosError<ErrorResponse>)?.response?.data?.message ||
          (err as AxiosError<ErrorResponse>)?.response?.data?.error ||
          anyErr?.message ||
          "Failed to create message";
        throw new Error(errorMessage);
      }

      const delay = 200 * Math.pow(2, attempt - 1);
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw new Error("Failed to create message after multiple attempts");
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
      const config = token
        ? {
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type, let browser set it with boundary
          },
        }
        : {};

      const response = await api.post("/messages", formData, config);
      console.log('✅ Video message created successfully:', response.data);
      return response.data;
    } catch (err: unknown) {
      attempt++;
      const anyErr = err as any;
      console.error(
        `❌ Video upload attempt ${attempt} failed:`,
        anyErr?.message || anyErr
      );

      if (anyErr?.code === "ERR_NETWORK" || anyErr?.message === "Network Error") {
        if (attempt >= maxAttempts) {
          throw new Error(
            `Cannot connect to server at ${BACKEND_URL}. Please check if the backend is running.`
          );
        }
      }

      const status = (err as AxiosError)?.response?.status;
      const isRetryable =
        !(err as AxiosError)?.response || (status && status >= 500 && status < 600);

      if (attempt >= maxAttempts || !isRetryable) {
        const errorMessage =
          (err as AxiosError<ErrorResponse>)?.response?.data?.message ||
          (err as AxiosError<ErrorResponse>)?.response?.data?.error ||
          anyErr?.message ||
          "Failed to create video message";
        throw new Error(errorMessage);
      }

      const delay = 200 * Math.pow(2, attempt - 1);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw new Error("Failed to create video message after multiple attempts");
};

export const checkMessageExists = async (
  slug: string,
  firstName?: string,
  lastName?: string
): Promise<CheckMessageExistsResponse> => {
  try {
    const params = new URLSearchParams();
    if (firstName) params.append("firstName", firstName);
    if (lastName) params.append("lastName", lastName);
    const query = params.toString();
    const url = query
      ? `/messages/${slug}/exists?${query}`
      : `/messages/${slug}/exists`;
    const response = await api.get(url);
    return response.data;
  } catch (error: unknown) {
    console.error("checkMessageExists error:", error);
    throw new Error(
      (error as AxiosError<ErrorResponse>).response?.data?.message ||
      "Failed to check message"
    );
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

export const getMessageHint = async (
  slug: string,
  firstName: string,
  lastName: string
): Promise<{ success: boolean; hint: string }> => {
  try {
    const response = await api.get(
      `/messages/${encodeURIComponent(slug)}/hint?firstName=${encodeURIComponent(
        firstName
      )}&lastName=${encodeURIComponent(lastName)}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error("getMessageHint error:", error);
    throw new Error(
      (error as AxiosError<ErrorResponse>)?.response?.data?.message ||
      "Failed to get hint"
    );
  }
};

export const openMessage = async (slug: string): Promise<MessageData> => {
  try {
    if (!slug || slug === "undefined") {
      throw new Error("Message slug is missing");
    }

    // Use the simple GET endpoint to fetch message data
    const response = await api.get(`/messages/${encodeURIComponent(slug)}`);
    return response.data?.data || response.data?.message || response.data;
  } catch (error: unknown) {
    console.error("openMessage error:", error);
    throw new Error(
      (error as AxiosError<ErrorResponse>).response?.data?.message ||
      "Failed to open message"
    );
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
    const response = await api.post(
      `/messages/${slug}/reply`,
      replyData,
      config
    );
    return response.data;
  } catch (error: any) {
    console.error('replyToMessage error:', error);
    throw error;
  }
};

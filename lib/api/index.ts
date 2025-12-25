import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error('Missing NEXT_PUBLIC_BACKEND_URL environment variable. Set it in .env.local');
}

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // allow browser to send/receive HTTP-only auth cookies
});

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
  videoUrl?: string;
  theme: string;
  passwordHint: string;
  hint: string;
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
  const response = await api.post("/auth/add-user", { email, name });
  return response.data;
};

export const verifyMagicLink = async (token: string): Promise<void> => {
  await api.get(`/auth/magic/${token}`);
};

// Messages endpoints
export const createTextMessage = async (
  data: CreateTextMessageData,
  token?: string
): Promise<CreateMessageResponse> => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
  const response = await api.post("/messages", { ...data, type: "text" }, config);
  return response.data;
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
  formData.append("password", data.password);
  formData.append("passwordHint", data.passwordHint);
  formData.append("file", data.file);
  formData.append("senderId", data.senderId);

  // Let the browser/axios set the multipart boundary Content-Type header.
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
  const response = await api.post("/messages", formData, config);
  return response.data;
};

export const checkMessageExists = async (
  slug: string
): Promise<CheckMessageExistsResponse> => {
  const response = await api.get(`/messages/${slug}/exists`);
  return response.data;
};


export const createMessageMagicLink = async (
  slug: string,
  token?: string
): Promise<{ success: boolean }> => {
  // POST /messages/:slug/magic-link to send link to recipient
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
  const response = await api.post(`/messages/${slug}/magic-link`, {}, config);
  return response.data;
};

export const openMessageViaMagicLink = async (
  slug: string,
  magicToken: string
): Promise<MessageData> => {
  // Placeholder: GET /messages/:slug/magic/:token
  const response = await api.get(`/messages/${slug}/magic/${magicToken}`);
  return response.data;
};

export const openMessage = async (
  slug: string,
  password: string
): Promise<MessageData> => {
  // Placeholder: GET /messages/:slug with password
  const response = await api.get(`/messages/${slug}`, {
    headers: { "X-Password": password },
  });
  return response.data;
};

export const replyToMessage = async (
  slug: string,
  replyData: ReplyData,
  token?: string
): Promise<ReplyResponse> => {
  // POST /messages/:slug/reply
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
  const response = await api.post(`/messages/${slug}/reply`, replyData, config);
  return response.data;
};

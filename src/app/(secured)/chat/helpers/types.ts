export interface ChatRoom {
  _id: string;
  name: string;
  logoURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChatMessage {
  _id: string;
  chatroomId: string;
  message: string;
  senderId?: string;
  senderName?: string;
  senderUser?: {
    _id: string;
    name?: string;
    wallet?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export enum MODAL_TYPE {
  CREATE = "create",
  EDIT = "edit",
  DELETE = "delete",
}

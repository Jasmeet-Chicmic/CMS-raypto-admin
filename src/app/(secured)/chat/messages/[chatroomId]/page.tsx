import { getChatMessages, getChatRoomsList, ChatRoom } from "@/api/chat";
import { SORT_DIRECTION } from "@/shared/types";
import ChatMessagesView from "./ChatMessagesView";

const ChatMessagesPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ chatroomId: string }>;
  searchParams: Promise<{
    skip?: number;
    limit?: number;
    sortKey?: string;
    sortDirection?: SORT_DIRECTION;
  }>;
}) => {
  const { chatroomId } = await params;
  const { skip, limit, sortKey, sortDirection } = await searchParams;

  // Fetch chat room details
  // Fetch all rooms to find the one matching chatroomId
  const chatRoomsData = await getChatRoomsList({ limit: 1000 });
  const chatRoom = chatRoomsData?.data?.data?.find(
    (room: ChatRoom) => room._id === chatroomId,
  );

  // Fetch messages for this chat room
  const messagesData = await getChatMessages({
    chatroomId,
    ...(skip && { skip }),
    ...(limit && { limit }),
    ...(sortKey && { sortKey, sortDirection }),
  });

  if (!messagesData.status) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">
          Error fetching chat messages
        </p>
      </div>
    );
  }

  return (
    <div>
      <ChatMessagesView
        messagesData={messagesData}
        chatroomId={chatroomId}
        chatRoomName={chatRoom?.name || "Chat Room"}
      />
    </div>
  );
};

export default ChatMessagesPage;

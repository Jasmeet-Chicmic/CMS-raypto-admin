import { getChatMessages, getChatRoomsList } from "@/api/chat";
import LiveChatView from "../components/LiveChatView";

const LiveChatPage = async () => {
  // Fetch initial chat rooms list
  const chatRoomsData = await getChatRoomsList({ limit: 100 });
  const chatRooms = chatRoomsData?.data?.data || [];
  const defaultRoom = chatRooms[0];

  // Fetch initial messages for the first room
  let initialMessages = [];
  let initialCount = 0;

  if (defaultRoom) {
    const messagesData = await getChatMessages({
      chatroomId: defaultRoom._id,
      limit: 50,
    });
    if (messagesData.status) {
      initialMessages = messagesData.data?.data || [];
      initialCount = messagesData.data?.count || 0;
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <LiveChatView
        chatRooms={chatRooms}
        initialMessages={initialMessages}
        initialRoom={defaultRoom}
        initialCount={initialCount}
      />
    </div>
  );
};

export default LiveChatPage;

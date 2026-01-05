import { getChatRoomsList } from "@/api/chat";
import { getConfigAction } from "@/api/config";
import { CONFIG_TYPE } from "@/shared/constants";
import { SORT_DIRECTION } from "@/shared/types";
import ChatRoomsList from "./ChatRoomsList";

const ChatRoomsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    searchString?: string;
    skip?: number;
    limit?: number;
    sortKey?: string;
    sortDirection?: SORT_DIRECTION;
  }>;
}) => {
  const { searchString, skip, limit, sortKey, sortDirection } =
    await searchParams;

  const [chatRoomsData, chatTranslationConfig] = await Promise.all([
    getChatRoomsList({
      ...(searchString && { searchString }),
      ...(skip && { skip }),
      ...(limit && { limit }),
      ...(sortKey && { sortKey, sortDirection }),
    }),
    getConfigAction({ type: CONFIG_TYPE.CHAT_TRANSLATION }),
  ]);

  if (!chatRoomsData.status) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">
          Error fetching chat rooms
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <ChatRoomsList
        chatRoomsData={chatRoomsData}
        searchString={searchString || ""}
        initialTranslationConfig={chatTranslationConfig?.data || null}
      />
    </div>
  );
};

export default ChatRoomsPage;

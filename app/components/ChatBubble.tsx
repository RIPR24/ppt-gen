import { chat } from "../page";

const ChatBubble = ({ cht }: { cht: chat }) => {
  return (
    <p className={cht.user ? "chat-bubble cht-out" : "chat-bubble cht-in"}>
      {cht.message}
    </p>
  );
};

export default ChatBubble;

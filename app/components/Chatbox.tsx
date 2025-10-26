"use client";

import { useState } from "react";
import { chat } from "../page";
import ChatBubble from "./ChatBubble";
import ra from "../../public/ra.svg";
import Image from "next/image";

type props = {
  addCht: (newCht: string) => void;
  chts: chat[];
};

const Chatbox = ({ addCht, chts }: props) => {
  const [input, setInput] = useState("");
  const [disabled, setDisabled] = useState(false);
  return (
    <div className="chatbox-con">
      <div className="chat-con">
        {chts.map((e) => (
          <ChatBubble cht={e} key={e.id} />
        ))}
      </div>
      <div className="input-con">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {!disabled && (
          <Image
            src={ra}
            className="imb"
            alt="send"
            width={30}
            height={30}
            onClick={async () => {
              if (disabled) return;
              setDisabled(true);
              await addCht(input);
              setInput("");
              setDisabled(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Chatbox;

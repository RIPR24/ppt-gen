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

  const enterP = async () => {
    if (disabled) return;
    setDisabled(true);
    await addCht(input);
    setInput("");
    setDisabled(false);
  };

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
          placeholder={
            chts.length === 0 ? "Enter the topic" : "Enter further instruction"
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") enterP();
          }}
        />
        {!disabled && (
          <Image
            src={ra}
            className="imb"
            alt="send"
            width={30}
            height={30}
            onClick={enterP}
          />
        )}
      </div>
    </div>
  );
};

export default Chatbox;

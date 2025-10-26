"use client";

import { useState } from "react";
import Chatbox from "./components/Chatbox";
import pptxgen from "pptxgenjs";
import Preview from "./components/Preview";

export type chat = {
  id?: number;
  message: string;
  user: boolean;
};

export type ppt = {
  title: string;
  imageLink: string;
  points: string[];
};

const page = () => {
  const [chts, setChts] = useState<chat[]>([]);
  const [pre, setPre] = useState<ppt[] | null>(null);
  const [ppt, setPpt] = useState<pptxgen | null>(null);

  const addCht = async (newCht: string) => {
    const str = newCht.trim();
    if (str.length === 0) return;
    const cht: chat = {
      id: chts.length + 1,
      message: str,
      user: true,
    };
    setChts([...chts, cht]);
    const re = await fetch("/genai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: pre
          ? JSON.stringify(pre) + "\n " + str
          : `Information about ${str} for presentation in 5 slides, with each slide containing a title, free image link of extension as jpg and points`,
      }),
    });
    const res = await re.json();
    const arr: ppt[] = JSON.parse(res.text);
    setPre(arr);
    console.log(res.text);
    setChts((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        message: "here are the results for " + str,
        //message: res.text,
        user: false,
      },
    ]);
    createPpt(arr);
  };

  const createPpt = (slides: ppt[]) => {
    const pptx = new pptxgen();
    slides.forEach((slide) => {
      const sld = pptx.addSlide();
      sld.addText(slide.title, {
        x: 1,
        y: 0.8,
        fontSize: slide.title.length > 35 ? 24 : 28,
        bold: true,
      });
      // sld.addImage({
      //   path: slide.imageLink,
      //   x: 1,
      //   y: 1,
      //   w: 8,
      //   h: 4.5,
      // });
      let st = "";
      slide.points.forEach((point) => {
        st += `• ${point}\n`;
      });
      const longText = st.length > 500;
      console.log(longText);

      sld.addText(st, {
        x: 1.2,
        y: longText ? 2 : 2.5,
        fontSize: longText ? 14 : 18,
      });
    });
    setPpt(pptx);
  };

  return (
    <div className="con">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Preview data={pre ? pre : []} />
        <button
          onClick={() => {
            if (ppt) ppt.writeFile({ fileName: "GeneratedPresentation.pptx" });
          }}
        >
          DOWNLOAD
        </button>
      </div>
      <Chatbox addCht={addCht} chts={chts} />
    </div>
  );
};

export default page;

"use client";

import { useState } from "react";
import Chatbox from "./components/Chatbox";
import pptxgen from "pptxgenjs";
import Preview from "./components/Preview";
import imgs from "./components/data";

export type chat = {
  id?: number;
  message: string;
  user: boolean;
};

export type ppt = {
  title: string;
  imageLink?: string;
  points: string[];
};

const page = () => {
  const [chts, setChts] = useState<chat[]>([]);
  const [pre, setPre] = useState<ppt[] | null>(null);
  const [ppt, setPpt] = useState<pptxgen | null>(null);
  const [title, setTitle] = useState<string>("");

  const addCht = async (newCht: string) => {
    let str = newCht.trim();
    str = str.charAt(0).toUpperCase() + str.slice(1);
    if (str.length === 0) return;
    const cht: chat = {
      id: chts.length + 1,
      message: str,
      user: true,
    };
    setChts([...chts, cht]);
    if (!title) setTitle(str);
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
    setChts((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        message: "Here are the results for " + str,
        user: false,
      },
    ]);
    //console.log(await getImages(newCht,2));
    createPpt(arr, title ? title : str);
  };

  const getImages = async (prompts: string, noi: number) => {
    const re = await fetch("/genaiimg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompts,
        noi: noi,
      }),
    });
    const res = await re.json();
    return res;
  };

  const createPpt = (slides: ppt[], title?: string) => {
    const pptx = new pptxgen();
    const frnt = pptx.addSlide();
    frnt.background = { path: imgs[0].url };
    frnt.addText(title ? title : "Generated Presentation", {
      y: 1.5,
      w: "100%",
      align: "center",
      fontSize: 36,
      bold: true,
      color: imgs[0].color,
    });
    slides.forEach((slide) => {
      const sld = pptx.addSlide();
      sld.background = { path: imgs[0].url };
      sld.addText(slide.title, {
        x: 1,
        y: 0.8,
        fontSize: slide.title.length > 35 ? 24 : 28,
        bold: true,
        color: imgs[0].color,
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
        color: imgs[0].color,
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
        <Preview data={pre ? pre : []} title={title} />
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

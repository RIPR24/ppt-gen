import { ppt } from "../page";
import bck from "../../public/bck.jpg";
import Image from "next/image";
import imgs from "./data";

const Preview = ({ data, title }: { data: ppt[]; title?: string }) => {
  return (
    <div style={{ color: "#" + imgs[0].color }} className="preview-con">
      <div className="preview-item">
        <img src={imgs[0].url} className="preview-bckimg" alt="" />
        <h1 style={{ color: "#" + imgs[0].color }}>
          {title || "Presentation Preview"}
        </h1>
      </div>
      {data.map((slide, index) => (
        <div key={index} className="preview-item">
          <img src={imgs[0].url} className="preview-bckimg" alt="" />
          <h2 style={{ color: "#" + imgs[0].color }}>{slide.title}</h2>
          {/* <img src={slide.imageLink} alt={`Slide ${index + 1}`} style={{maxWidth: '100%'}} /> */}
          <ul style={{ color: "#" + imgs[0].color }}>
            {slide.points.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Preview;

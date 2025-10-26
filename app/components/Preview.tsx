import { ppt } from "../page";

const Preview = ({ data }: { data: ppt[] }) => {
  return (
    <div className="preview-con">
      {data.map((slide, index) => (
        <div key={index} className="preview-item">
          <h2>{slide.title}</h2>
          {/* <img src={slide.imageLink} alt={`Slide ${index + 1}`} style={{maxWidth: '100%'}} /> */}
          <ul>
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

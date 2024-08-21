import ImageZoom from "react-image-zoom";
import "./index.scss";

const ZoomImage = ({ image }: { image: string }) => {
  const zoomProps = {
    width: 600,
    zoomWidth: 600,
    zoomPosition: "original",
    zoomStyle: "opacity: 1;background-color: gray",
    img: image,
    zoom: 800,
  };

  return <ImageZoom className="gallery-img" {...zoomProps} />;
};

export default ZoomImage;

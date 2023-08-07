import { BackgroundImage } from "@patternfly/react-core";
import { useEffect, useState } from "react";
import pfbg_576 from "./pfbg_576.jpg";
import pfbg_768 from "./pfbg_768.jpg";
import pfbg_1152 from "./pfbg_1152.jpg";
import pfbg_1200 from "./pfbg_1200.jpg";
import pfbg_1536 from "./pfbg_1536.jpg";

export default function DCIBackgroundImage() {
  const [width, setWidth] = useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const imageSrc =
    width <= 576
      ? pfbg_576
      : width <= 768
      ? pfbg_768
      : width <= 1152
      ? pfbg_1152
      : width <= 1200
      ? pfbg_1200
      : pfbg_1536;

  return <BackgroundImage src={imageSrc} />;
}

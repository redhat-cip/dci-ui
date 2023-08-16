import { BackgroundImage } from "@patternfly/react-core";
import { useEffect, useState } from "react";
import pfbg_640 from "./pfbg_640.jpg";
import pfbg_1920 from "./pfbg_1920.jpg";
import styled from "styled-components";

// fixing BackgroundImage issue https://github.com/patternfly/patternfly/issues/5806
const BackgroundImageWithCoverWorkaround = styled(BackgroundImage)`
  background-position: center;
  background-size: cover;
  transform: scaleX(-1);
`;

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

  const imageSrc = width <= 640 ? pfbg_640 : pfbg_1920;

  return <BackgroundImageWithCoverWorkaround src={imageSrc} />;
}

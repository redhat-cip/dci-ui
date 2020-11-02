import React from "react";
import { BackgroundImage } from "@patternfly/react-core";
import pfbg_576 from "./pfbg_576.jpg";
import pfbg_5762x from "./pfbg_576@2x.jpg";
import pfbg_768 from "./pfbg_768.jpg";
import pfbg_7682x from "./pfbg_768@2x.jpg";
import pfbg_1200 from "./pfbg_1200.jpg";

export default function DCIBackgroundImage() {
  return (
    <BackgroundImage
      src={{
        xs: pfbg_576,
        xs2x: pfbg_5762x,
        sm: pfbg_768,
        sm2x: pfbg_7682x,
        lg: pfbg_1200,
      }}
    />
  );
}

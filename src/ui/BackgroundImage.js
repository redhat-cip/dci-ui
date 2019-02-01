import React from "react";

class BackgroundImage extends React.Component {
  render() {
    return (
      <div className="pf-c-background-image">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="pf-c-background-image__filter"
          width="0"
          height="0"
        >
          <filter id="image_overlay" width="">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                1 0 0 0 0
                1 0 0 0 0
                0 0 0 1 0"
            />
            <feComponentTransfer
              colorInterpolationFilters="sRGB"
              result="duotone"
            >
              <feFuncR
                type="table"
                tableValues="0.086274509803922 0.43921568627451"
              />
              <feFuncG
                type="table"
                tableValues="0.086274509803922 0.43921568627451"
              />
              <feFuncB
                type="table"
                tableValues="0.086274509803922 0.43921568627451"
              />
              <feFuncA type="table" tableValues="0 1" />
            </feComponentTransfer>
          </filter>
        </svg>
      </div>
    );
  }
}

export default BackgroundImage;

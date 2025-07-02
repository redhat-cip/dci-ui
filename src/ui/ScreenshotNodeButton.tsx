import domtoimage from "dom-to-image";
import { Button } from "@patternfly/react-core";
import { CameraIcon } from "@patternfly/react-icons";
import FileSaver from "file-saver";

export default function ScreenshotNodeButton<T extends HTMLElement>({
  node,
  filename,
  ...props
}: {
  node: React.RefObject<T | null>;
  filename: string;
}) {
  if (node === null) return null;
  return (
    <Button
      {...props}
      onClick={() => {
        if (node && node.current) {
          domtoimage.toBlob(node.current).then((blob) => {
            FileSaver.saveAs(blob, filename);
          });
        }
      }}
    >
      <CameraIcon />
    </Button>
  );
}

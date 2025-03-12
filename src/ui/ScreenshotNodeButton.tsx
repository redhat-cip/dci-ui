import domtoimage from "dom-to-image";
import { Button } from "@patternfly/react-core";
import { CameraIcon } from "@patternfly/react-icons";
import FileSaver from "file-saver";

export default function ScreeshotNodeButton({
  node,
  filename,
  ...props
}: {
  node: React.RefObject<HTMLDivElement>;
  filename: string;
}) {
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

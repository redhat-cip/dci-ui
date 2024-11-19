import { useEffect, useState } from "react";
import { ClipboardCopyButton } from "@patternfly/react-core/dist/js/components/ClipboardCopy/ClipboardCopyButton";
import { TooltipPosition } from "@patternfly/react-core";
import copyToClipboard from "services/copyToClipboard";

interface CopyButtonProps {
  text: string;
  position?: TooltipPosition;
  [k: string]: any;
}

export default function CopyButton({
  text,
  position = TooltipPosition.right,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => {
      clearTimeout(t);
    };
  }, [copied, setCopied]);
  return (
    <ClipboardCopyButton
      exitDelay={1600}
      entryDelay={100}
      position={position}
      id={`copy-button-${text}`}
      textId={`text-input-${text}`}
      aria-label="Copy to clipboard"
      onClick={(event) => {
        copyToClipboard(event, text);
        setCopied(true);
      }}
      {...props}
    >
      {copied ? "Copied!" : "Copy to clipboard"}
    </ClipboardCopyButton>
  );
}

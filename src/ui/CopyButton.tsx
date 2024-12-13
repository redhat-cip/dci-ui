import { useEffect, useState } from "react";
import { Button, Tooltip, TooltipPosition } from "@patternfly/react-core";
import copyToClipboard from "services/copyToClipboard";
import { CopyIcon } from "@patternfly/react-icons";

interface CopyButtonProps {
  text: string;
  position?: TooltipPosition;
  [key: string]: any;
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
    <Tooltip
      aria="none"
      aria-live="polite"
      content={copied ? "Copied!" : "Copy to clipboard"}
    >
      <Button
        variant="control"
        id={`copy-button-${text}`}
        aria-label="Copy to clipboard"
        onClick={(event) => {
          copyToClipboard(event, text);
          setCopied(true);
        }}
        icon={<CopyIcon />}
        {...props}
      />
    </Tooltip>
  );
}

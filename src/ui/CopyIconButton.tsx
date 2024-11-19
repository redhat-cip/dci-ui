import { useEffect, useState } from "react";
import copyToClipboard from "services/copyToClipboard";
import { CopyIcon, ClipboardCheckIcon } from "@patternfly/react-icons";
import { t_global_color_nonstatus_green_200 } from "@patternfly/react-tokens";

interface CopyIconButtonProps {
  text: string;
  textOnSuccess?: string;
  [key: string]: any;
}

export default function CopyIconButton({
  text,
  textOnSuccess = "",
  ...props
}: CopyIconButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => {
      clearTimeout(t);
    };
  }, [copied, setCopied]);

  if (copied) {
    return (
      <span
        {...props}
        style={{
          color: t_global_color_nonstatus_green_200.value,
        }}
      >
        <ClipboardCheckIcon />
        {textOnSuccess && <span>{textOnSuccess}</span>}
      </span>
    );
  }

  return (
    <CopyIcon
      {...props}
      onClick={(event) => {
        copyToClipboard(event, text);
        setCopied(true);
      }}
    />
  );
}

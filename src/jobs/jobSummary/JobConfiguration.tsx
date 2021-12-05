import { CogIcon } from "@patternfly/react-icons";

interface JobConfigurationProps {
  configuration: string;
  onClick?: (configuration: string) => void;
}

export default function JobConfiguration({
  configuration,
  onClick,
}: JobConfigurationProps) {
  return (
    <div className="mt-xs">
      <span
        role="button"
        tabIndex={0}
        className={onClick && "pointer"}
        onClick={() => onClick && onClick(configuration)}
        onKeyDown={() => onClick && onClick(configuration)}
      >
        <CogIcon className="mr-xs" />
        {configuration}
      </span>
    </div>
  );
}

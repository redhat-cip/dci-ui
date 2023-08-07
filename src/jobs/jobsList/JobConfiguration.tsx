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
    <div className="pf-v5-u-mt-xs">
      <span
        role="button"
        tabIndex={0}
        className={onClick && "pointer"}
        onClick={() => onClick && onClick(configuration)}
        onKeyDown={() => onClick && onClick(configuration)}
      >
        <CogIcon className="pf-v5-u-mr-xs" />
        {configuration}
      </span>
    </div>
  );
}

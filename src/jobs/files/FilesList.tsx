import { isEmpty } from "lodash";
import { EmptyState } from "ui";
import File from "./File";
import { FileArchiveIcon } from "@patternfly/react-icons";
import { IFile } from "types";
import { sortByName } from "services/sort";

interface FilesListProps {
  files: IFile[];
}

export default function FilesList({ files }: FilesListProps) {
  const filesNotAssociatedWithJobState = sortByName(
    files.filter((f) => f.jobstate_id === null)
  );
  if (isEmpty(filesNotAssociatedWithJobState)) {
    return (
      <EmptyState
        icon={FileArchiveIcon}
        title="No files"
        info="There are no files attached to this job"
      />
    );
  }
  return (
    <div className="table-responsive">
      <table className="pf-c-table pf-m-compact pf-m-grid-md">
        <thead>
          <tr>
            <th>Filename</th>
            <th>Size</th>
            <th>Mime type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filesNotAssociatedWithJobState.map((file) => (
            <File key={file.id} file={file} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

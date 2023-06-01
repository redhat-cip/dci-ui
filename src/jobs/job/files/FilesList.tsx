import { isEmpty } from "lodash";
import { EmptyState, RotatingSpinnerIcon } from "ui";
import File from "./File";
import { FileArchiveIcon, FileDownloadIcon } from "@patternfly/react-icons";
import { IEnhancedJob } from "types";
import { sortByName } from "services/sort";
import {
  Button,
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import fuzzysort from "fuzzysort";
import { useState } from "react";
import { getFileContent } from "./filesActions";
import JSZip from "jszip";
import FileSaver from "file-saver";
import { humanFileSize } from "./filesGetters";

interface FilesListProps {
  job: IEnhancedJob;
}

export default function FilesList({ job }: FilesListProps) {
  const filesNotAssociatedWithJobState = sortByName(
    job.files.filter((f) => f.jobstate_id === null)
  );
  const [textSearch, setTextSearch] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  if (isEmpty(filesNotAssociatedWithJobState)) {
    return (
      <EmptyState
        icon={FileArchiveIcon}
        title="No files"
        info="There are no files attached to this job"
      />
    );
  }

  const filesFiltered =
    textSearch === ""
      ? filesNotAssociatedWithJobState
      : fuzzysort
          .go(textSearch, filesNotAssociatedWithJobState, { key: "name" })
          .map((result) => result.obj);

  const filesFilteredSize = filesFiltered.reduce((acc, file) => {
    acc += file.size;
    return acc;
  }, 0);
  return (
    <div>
      <Toolbar clearAllFilters={() => {}} collapseListedFiltersBreakpoint="xl">
        <ToolbarContent>
          <ToolbarGroup>
            <ToolbarItem>Search a file</ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem>
              <SearchInput
                placeholder="Find by name"
                value={textSearch}
                onChange={(e, value) => setTextSearch(value)}
                onClear={() => setTextSearch("")}
              />
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem>
              <Button
                variant="primary"
                icon={
                  isDownloading ? <RotatingSpinnerIcon /> : <FileDownloadIcon />
                }
                onClick={async () => {
                  setIsDownloading(true);
                  const zip = new JSZip();
                  for (let i = 0; i < filesFiltered.length; i++) {
                    const file = filesFiltered[i];
                    const content = await getFileContent(file, {
                      responseType: "blob",
                    });
                    const blob = new Blob([content], {
                      type: file.mime || undefined,
                    });
                    zip.file(file.name, blob);
                  }
                  zip
                    .generateAsync({ type: "blob" })
                    .then((content) =>
                      FileSaver.saveAs(content, `dci-job-${job.id}-files.zip`)
                    )
                    .catch(console.error)
                    .finally(() => setIsDownloading(false));
                }}
                className="mr-xs"
                isDisabled={isDownloading}
              >
                {textSearch === ""
                  ? `Download all files (${humanFileSize(filesFilteredSize)})`
                  : `Download these files (${humanFileSize(
                      filesFilteredSize
                    )})`}
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      <div className="table-responsive">
        {filesFiltered.length === 0 ? (
          <EmptyState
            icon={FileArchiveIcon}
            title="No files matching your search"
            info="There are no files attached to this search. Change your search."
          />
        ) : (
          <table className="pf-c-table pf-m-compact pf-m-grid-md">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Size</th>
                <th>Mime type</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filesFiltered.map((file) => (
                <File key={file.id} file={file} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

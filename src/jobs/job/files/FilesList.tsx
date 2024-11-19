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
import { useMemo, useState } from "react";
import { getFileContent } from "./filesActions";
import JSZip from "jszip";
import FileSaver from "file-saver";
import { humanFileSize } from "./filesGetters";
import { Table, Thead, Tr, Th, Tbody } from "@patternfly/react-table";

interface FilesListProps {
  job: IEnhancedJob;
}

export default function FilesList({ job }: FilesListProps) {
  const filesNotAssociatedWithJobState = sortByName(
    job.files.filter((f) => f.jobstate_id === null),
  );
  const [textSearch, setTextSearch] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const filesFiltered = useMemo(() => {
    if (!textSearch) return filesNotAssociatedWithJobState;
    return filesNotAssociatedWithJobState.filter((file) =>
      file.name.toLowerCase().includes(textSearch.toLowerCase()),
    );
  }, [textSearch, filesNotAssociatedWithJobState]);

  const filesFilteredSize = useMemo(() => {
    return filesFiltered.reduce((acc, file) => {
      acc += file.size;
      return acc;
    }, 0);
  }, [filesFiltered]);

  if (filesNotAssociatedWithJobState.length === 0) {
    return (
      <EmptyState
        icon={FileArchiveIcon}
        title="No files"
        info="There are no files attached to this job"
      />
    );
  }

  return (
    <div>
      <Toolbar clearAllFilters={() => {}} collapseListedFiltersBreakpoint="xl">
        <ToolbarContent>
          <ToolbarGroup variant="label-group">
            <ToolbarItem variant="label">Search a file</ToolbarItem>
            <ToolbarItem>
              <SearchInput
                placeholder="Find by name"
                value={textSearch}
                onChange={(e, value) => setTextSearch(value)}
                onClear={() => setTextSearch("")}
              />
            </ToolbarItem>
            <ToolbarItem>
              <Button
                size="sm"
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
                      FileSaver.saveAs(content, `dci-job-${job.id}-files.zip`),
                    )
                    .catch(console.error)
                    .finally(() => setIsDownloading(false));
                }}
                className="pf-v6-u-mr-xs"
                isDisabled={isDownloading}
              >
                {textSearch === ""
                  ? `Download all files (${humanFileSize(filesFilteredSize)})`
                  : `Download these files (${humanFileSize(filesFilteredSize)})`}
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      <div>
        {filesFiltered.length === 0 ? (
          <EmptyState
            icon={FileArchiveIcon}
            title="No files matching your search"
            info="There are no files attached to this search. Change your search."
          />
        ) : (
          <Table variant="compact" className="pf-v6-c-tablepf-m-grid-md">
            <Thead>
              <Tr>
                <Th>Filename</Th>
                <Th>Size</Th>
                <Th>Mime type</Th>
                <Th className="text-center">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filesFiltered.map((file) => (
                <File key={file.id} file={file} />
              ))}
            </Tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

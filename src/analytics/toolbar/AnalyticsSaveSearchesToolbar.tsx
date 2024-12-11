import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalVariant,
  TextInput,
  Form,
  FormHelperText,
  HelperText,
  HelperTextItem,
  FormGroup,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ActionGroup,
  Label,
  LabelGroup,
  Tooltip,
} from "@patternfly/react-core";
import { AnalyticsToolbarFilters } from "types";
import useModal from "hooks/useModal";
import { useState } from "react";
import useLocalStorage from "hooks/useLocalStorage";
import { SearchIcon } from "@patternfly/react-icons";
import { rangeLabels } from "ui/form/RangeSelect";

function LoadAnalyticSearchModal({
  searches,
  onLoad,
  onDelete,
  ...props
}: {
  searches: Record<string, AnalyticsToolbarFilters>;
  onLoad: (searchName: string) => void;
  onDelete: (searchName: string) => void;
  [k: string]: any;
}) {
  const searchKeys = Object.keys(searches);
  const categoryName =
    searchKeys.length > 1 ? "Saved searches" : "Saved search";
  return (
    <LabelGroup categoryName={categoryName} numLabels={10} {...props}>
      {searchKeys.map((searchName) => (
        <Tooltip content={searches[searchName].query}>
          <Label
            color="green"
            icon={<SearchIcon />}
            title={searches[searchName].query}
            onClick={() => onLoad(searchName)}
            onClose={() => onDelete(searchName)}
          >
            {searchName}
          </Label>
        </Tooltip>
      ))}
    </LabelGroup>
  );
}

function SaveAnalyticSearch({
  search,
  searchesNames,
  onSave,
  ...props
}: {
  search: AnalyticsToolbarFilters;
  searchesNames: string[];
  onSave: (name: string) => void;
  [k: string]: any;
}) {
  const { isOpen, show, hide } = useModal(false);
  const [name, setName] = useState("");

  return (
    <>
      <Button variant="link" onClick={show} {...props}>
        Save this search
      </Button>
      <Modal
        id="save-analytic-search-modal"
        aria-label="Analytics save search modal"
        isOpen={isOpen}
        onClose={hide}
        variant={ModalVariant.small}
      >
        <ModalHeader title="Save this search" />
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              onSave(name);
              hide();
            }}
          >
            <FormGroup label="Search name" isRequired fieldId="search-name">
              <TextInput
                value={name}
                isRequired
                type="text"
                id="search-name"
                aria-describedby="search-name-helper"
                name="search-name"
                onChange={(_event, name: string) => {
                  setName(name);
                }}
              />
              <FormHelperText>
                <HelperText>
                  <HelperTextItem>
                    Give a name to your search for later use
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            </FormGroup>
            <FormGroup label="Query">
              <TextInput
                value={search.query}
                readOnly
                readOnlyVariant="default"
              />
            </FormGroup>
            {search.range === "custom" ? (
              <>
                <FormGroup label="After">
                  <TextInput
                    value={search.after}
                    readOnly
                    readOnlyVariant="default"
                  />
                </FormGroup>
                <FormGroup label="Before">
                  <TextInput
                    value={search.before}
                    readOnly
                    readOnlyVariant="default"
                  />
                </FormGroup>
              </>
            ) : (
              <FormGroup label="Range">{rangeLabels[search.range]}</FormGroup>
            )}
            {searchesNames.length > 0 && (
              <FormGroup label="Replace with an existing search">
                <LabelGroup>
                  {searchesNames.map((searchName) => (
                    <Label
                      onClick={() => {
                        onSave(searchName);
                        hide();
                      }}
                      color="green"
                    >
                      {searchName}
                    </Label>
                  ))}
                </LabelGroup>
              </FormGroup>
            )}
            <ActionGroup>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </ActionGroup>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}

export default function AnalyticsSaveSearchesToolbar({
  search,
  onLoad,
  ...props
}: {
  search: AnalyticsToolbarFilters;
  onLoad: (search: AnalyticsToolbarFilters) => void;
  [k: string]: any;
}) {
  const [searches, setSearches] = useLocalStorage<
    Record<string, AnalyticsToolbarFilters>
  >("userAnalyticsFilters", {});

  return (
    <Toolbar id="toolbar-load-search-pipelines" {...props}>
      <ToolbarContent>
        <ToolbarItem>
          {search.query !== "" && (
            <SaveAnalyticSearch
              search={search}
              searchesNames={Object.keys(searches)}
              onSave={(name) => setSearches({ ...searches, [name]: search })}
            />
          )}
          {Object.keys(searches).length !== 0 && (
            <LoadAnalyticSearchModal
              searches={searches}
              onLoad={(searchName) => {
                onLoad(searches[searchName]);
              }}
              onDelete={(searchName) => {
                const newSearches = {
                  ...searches,
                };
                delete newSearches[searchName];
                setSearches(newSearches);
              }}
            />
          )}
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
}

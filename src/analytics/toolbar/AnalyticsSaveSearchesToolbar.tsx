import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalVariant,
  CodeBlock,
  CodeBlockCode,
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
  Truncate,
  Label,
  LabelGroup,
} from "@patternfly/react-core";

import { AnalyticsToolbarFilters } from "types";
import useModal from "hooks/useModal";
import { useState } from "react";
import useLocalStorage from "hooks/useLocalStorage";
import { Table, Tbody, Td, Th, Thead, Tr } from "@patternfly/react-table";
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
  const { isOpen, show, hide } = useModal(false);

  return (
    <>
      <Button variant="link" onClick={show} {...props}>
        Load a search
      </Button>
      <Modal
        id="load-analytic-searches-modal"
        aria-label="Analytics load filter modal"
        isOpen={isOpen}
        onClose={hide}
        variant={ModalVariant.large}
      >
        <ModalHeader title="Load a filter" />
        <ModalBody>
          <Table borders={false}>
            <Thead>
              <Tr>
                <Th>name</Th>
                <Th>query</Th>
                <Th>range</Th>
                <Th>after</Th>
                <Th>before</Th>
                <Th screenReaderText="Load button" />
                <Th screenReaderText="Delete button" />
              </Tr>
            </Thead>
            <Tbody>
              {Object.keys(searches).map((searchName) => {
                const search = searches[searchName];
                return (
                  <Tr key={searchName}>
                    <Td>
                      <Label
                        color="green"
                        onClick={() => {
                          onLoad(searchName);
                          hide();
                        }}
                      >
                        {searchName}
                      </Label>
                    </Td>
                    <Td style={{ maxWidth: 100 }}>
                      <Truncate
                        content={search.query}
                        tooltipPosition={"bottom"}
                      />
                    </Td>
                    <Td>{rangeLabels[search.range]}</Td>
                    <Td>{search.range === "custom" && search.after}</Td>
                    <Td>{search.range === "custom" && search.before}</Td>
                    <Td isActionCell>
                      <Button
                        variant="link"
                        onClick={() => {
                          onLoad(searchName);
                          hide();
                        }}
                      >
                        Load
                      </Button>
                    </Td>
                    <Td isActionCell>
                      <Button
                        variant="link"
                        onClick={() => {
                          onDelete(searchName);
                        }}
                        isDanger
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </ModalBody>
      </Modal>
    </>
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
            <FormGroup label="Search">
              <CodeBlock>
                <CodeBlockCode>{JSON.stringify(search, null, 2)}</CodeBlockCode>
              </CodeBlock>
            </FormGroup>
            {searchesNames.length > 0 && (
              <FormGroup label="Replace an existing search">
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

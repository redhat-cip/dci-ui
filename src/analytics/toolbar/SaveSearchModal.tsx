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
  ActionGroup,
  Label,
  LabelGroup,
} from "@patternfly/react-core";
import useModal from "hooks/useModal";
import { useState } from "react";
import useLocalStorage from "hooks/useLocalStorage";
import { rangeLabels } from "ui/form/RangeSelect";
import { AnalyticsToolbarSearch } from "types";
import { useNavigate } from "react-router-dom";

export default function SaveSearchModal({
  search,
  ...props
}: {
  search: AnalyticsToolbarSearch;
  [k: string]: any;
}) {
  const navigate = useNavigate();
  const { isOpen, show, hide } = useModal(false);
  const [name, setName] = useState("");
  const [searches, setSearches] = useLocalStorage<
    Record<string, AnalyticsToolbarSearch>
  >("userAnalyticsFilters", {});

  const searchesNames = Object.keys(searches);

  return (
    <>
      <Button variant="link" onClick={show} {...props}>
        Save
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
              setSearches({
                ...searches,
                [name]: search,
              });
              navigate(0);
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
                        setSearches({
                          ...searches,
                          [searchName]: search,
                        });
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

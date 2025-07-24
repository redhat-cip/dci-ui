import {
  Button,
  ButtonVariant,
  Label,
  Modal,
  ModalBody,
  ModalVariant,
  EmptyState,
  EmptyStateBody,
  TextInput,
  Form,
  FormHelperText,
  HelperText,
  HelperTextItem,
  FormGroup,
  Divider,
  Title,
} from "@patternfly/react-core";
import { SaveIcon } from "@patternfly/react-icons";
import useLocalStorage from "hooks/useLocalStorage";
import useModal from "hooks/useModal";
import { useLocation, useNavigate, createSearchParams } from "react-router";
import type {
  AnalyticsToolbarLocations,
  AnalyticsToolbarSearches,
} from "types";
import { useState, useEffect } from "react";

const ANALYTICS_FILTERS_DEPRECATED_KEY = "userAnalyticsFilters";

export default function QueryToolbarSavedSearchesIcon() {
  const [searches, setSearches] = useLocalStorage<AnalyticsToolbarSearches>(
    ANALYTICS_FILTERS_DEPRECATED_KEY,
    {},
  );

  const [locations, setLocations] = useLocalStorage<AnalyticsToolbarLocations>(
    "userAnalyticsLocations",
    {},
  );

  const { isOpen, show, hide } = useModal(false);
  const [name, setName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const locationKeys = Object.keys(locations);

  useEffect(() => {
    if (Object.keys(searches).length > 0) {
      const migratedLocations: AnalyticsToolbarLocations = {};

      Object.entries(searches).forEach(([searchName, searchData]) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { limit, offset, ...rest } = searchData;
        migratedLocations[searchName] = {
          pathname: "",
          search: `?${createSearchParams({
            ...rest,
          }).toString()}`,
        };
      });
      setLocations({ ...locations, ...migratedLocations });
      setSearches({});
      localStorage.removeItem(ANALYTICS_FILTERS_DEPRECATED_KEY);
    }
  }, [searches, locations, setSearches, setLocations]);

  const loadSavedLocation = (searchName: string) => {
    const location = locations[searchName];
    navigate({
      pathname: location.pathname,
      search: location.search,
    });
    navigate(0);
    hide();
  };

  const deleteSavedLocation = (searchName: string) => {
    if (
      confirm(
        `Are you sure you want to delete the saved search "${searchName}"?`,
      )
    ) {
      const newLocations = { ...locations };
      delete newLocations[searchName];
      setLocations(newLocations);
    }
  };

  const saveUrl = (name: string) => {
    const newLocations = { ...locations };
    newLocations[name] = {
      pathname: location.pathname,
      search: location.search,
    };
    setLocations(newLocations);
    setName("");
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (name.trim()) {
      saveUrl(name.trim());
    }
  };

  return (
    <>
      <Button
        icon={<SaveIcon />}
        variant={ButtonVariant.control}
        aria-label="saved searches"
        type="button"
        onClick={show}
      />
      <Modal
        id="saved-searches-modal"
        aria-label="Saved searches modal"
        isOpen={isOpen}
        onClose={hide}
        variant={ModalVariant.medium}
      >
        <ModalBody>
          <div className="pf-v6-u-mb-lg">
            <Title headingLevel="h3" className="pf-v6-u-mb-md">
              Load Saved Search
            </Title>
            {locationKeys.length === 0 ? (
              <EmptyState className="pf-v6-u-p-0">
                <EmptyStateBody>
                  You haven&apos;t saved any searches yet. Save a search to
                  access it quickly later.
                </EmptyStateBody>
              </EmptyState>
            ) : (
              <div className="pf-v6-u-display-flex pf-v6-u-flex-direction-column pf-v6-u-gap-md">
                {locationKeys.map((location) => (
                  <Label
                    key={location}
                    color="green"
                    onClick={() => loadSavedLocation(location)}
                    onClose={() => deleteSavedLocation(location)}
                    className="pf-v6-u-cursor-pointer pf-v6-u-mr-xs"
                  >
                    {location}
                  </Label>
                ))}
              </div>
            )}
          </div>
          <Divider />
          <div className="pf-v6-u-mt-lg">
            <Title headingLevel="h3" className="pf-v6-u-mb-md">
              Save Current Search
            </Title>
            <Form onSubmit={handleSaveSubmit}>
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
              <FormGroup>
                <Button
                  variant="primary"
                  type="submit"
                  isDisabled={!name.trim()}
                >
                  Save
                </Button>
              </FormGroup>
              <Divider />
              {locationKeys.length > 0 && (
                <div>
                  <Title headingLevel="h3" className="pf-v6-u-mb-md">
                    Replace Existing Search
                  </Title>
                  <FormGroup>
                    {locationKeys.map((location) => (
                      <Label
                        key={location}
                        onClick={() => {
                          saveUrl(location);
                          loadSavedLocation(location);
                        }}
                        color="green"
                        className="pf-v6-u-cursor-pointer pf-v6-u-mr-xs"
                      >
                        {location}
                      </Label>
                    ))}
                  </FormGroup>
                </div>
              )}
            </Form>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

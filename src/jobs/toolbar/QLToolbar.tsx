import {
  ToolbarItem,
  TextInput,
  Button,
  ToolbarFilter,
  Form,
  ButtonVariant,
  ToolbarGroup,
  Modal,
  ModalVariant,
  Text,
  TextVariants,
  TextContent,
  CodeBlock,
} from "@patternfly/react-core";
import { QuestionCircleIcon } from "@patternfly/react-icons";
import { useState } from "react";

export default function QLToolbar({
  query,
  onSearch,
  onClear,
  showToolbarItem = true,
}: {
  query: string | null;
  onSearch: (search: string | null) => void;
  onClear: () => void;
  showToolbarItem?: boolean;
}) {
  const [value, setValue] = useState(query || "");
  const [showHelperModal, setShowHelperModal] = useState(false);
  const formId = "query-language-form";
  return (
    <>
      <Modal
        id="advanced-search-modal"
        aria-label="Advanced search modal"
        variant={ModalVariant.medium}
        title="Advanced searching"
        isOpen={showHelperModal}
        onClose={() => setShowHelperModal(false)}
      >
        <TextContent>
          <Text component={TextVariants.p}>
            The advanced search allows you to build structured queries using the
            DCI Query Language to search for jobs. You can specify criteria that
            cannot be defined in the basic search.
          </Text>
          <Text component={TextVariants.h3}>Constructing queries</Text>
          <Text component={TextVariants.h4}>Example 1</Text>
          <Text component={TextVariants.p}>
            Find all job with name
            <span className="pf-v5-u-background-color-200 pf-v5-u-px-xs pf-v5-u-mx-xs">
              job-name
            </span>
          </Text>
          <CodeBlock>eq(name,job-name)</CodeBlock>
          <Text component={TextVariants.h4}>Example 2</Text>
          <Text component={TextVariants.p}>
            Find all job with name
            <span className="pf-v5-u-background-color-200 pf-v5-u-px-xs pf-v5-u-mx-xs">
              job-name
            </span>
            and status
            <span className="pf-v5-u-background-color-success pf-v5-u-px-xs pf-v5-u-mx-xs">
              success
            </span>
          </Text>
          <CodeBlock>and( eq(name,job-name), eq(status,success))</CodeBlock>
          <Text component={TextVariants.h4}>Example 3</Text>
          <Text component={TextVariants.p}>
            Find all job with name
            <span className="pf-v5-u-background-color-200 pf-v5-u-px-xs pf-v5-u-mx-xs">
              job-name
            </span>
            and status
            <span className="pf-v5-u-background-color-danger pf-v5-u-px-xs pf-v5-u-mx-xs">
              failure
            </span>
            or
            <span className="pf-v5-u-background-color-danger pf-v5-u-px-xs pf-v5-u-mx-xs">
              error
            </span>
          </Text>
          <CodeBlock>
            and( eq(name,job-name), or( eq(status,failure), eq(status,error) ) )
          </CodeBlock>
        </TextContent>
      </Modal>
      <ToolbarItem>
        <ToolbarFilter
          chips={query === null ? [] : [query]}
          deleteChip={() => {
            setValue("");
            onClear();
          }}
          categoryName="Query"
          showToolbarItem={showToolbarItem}
        >
          <Form
            id={formId}
            onSubmit={(e) => {
              e.preventDefault();
              onSearch(value);
            }}
          >
            <TextInput
              value={value}
              type="text"
              onChange={(_event, value) => setValue(value)}
              placeholder="Query language search"
              aria-label="query language search input"
              style={{ minWidth: "380px" }}
            />
          </Form>
        </ToolbarFilter>
      </ToolbarItem>
      <ToolbarGroup variant="icon-button-group">
        <ToolbarItem>
          <Button variant="secondary" type="submit" form={formId}>
            Search
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button
            variant={ButtonVariant.plain}
            aria-label="refresh"
            type="button"
            onClick={() => setShowHelperModal(!showHelperModal)}
          >
            <QuestionCircleIcon />
          </Button>
        </ToolbarItem>
      </ToolbarGroup>
    </>
  );
}

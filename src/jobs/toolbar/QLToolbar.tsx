import {
  ToolbarItem,
  TextInput,
  Button,
  ToolbarFilter,
  Form,
  ButtonVariant,
  ToolbarGroup,
  Content,
  ContentVariants,
  CodeBlock,
  Label,
} from "@patternfly/react-core";
import { Modal, ModalVariant } from "@patternfly/react-core/deprecated";
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
        <Content>
          <Content component={ContentVariants.p}>
            The advanced search allows you to build structured queries using the
            DCI Query Language to search for jobs. You can specify criteria that
            cannot be defined in the basic search.
          </Content>
          <Content component={ContentVariants.h3}>Constructing queries</Content>
          <Content component={ContentVariants.h4}>Example 1</Content>
          <Content component={ContentVariants.p}>
            Find all job with name
            <Label isCompact className="pf-v6-u-mx-xs">
              job-name
            </Label>
          </Content>
          <CodeBlock>eq(name,job-name)</CodeBlock>
          <Content component={ContentVariants.h4}>Example 2</Content>
          <Content component={ContentVariants.p}>
            Find all job with name
            <Label isCompact className="pf-v6-u-mx-xs">
              job-name
            </Label>
            and status
            <Label isCompact color="green" className="pf-v6-u-mx-xs">
              success
            </Label>
          </Content>
          <CodeBlock>and( eq(name,job-name), eq(status,success))</CodeBlock>
          <Content component={ContentVariants.h4}>Example 3</Content>
          <Content component={ContentVariants.p}>
            Find all job with name
            <Label isCompact className="pf-v6-u-mx-xs">
              job-name
            </Label>
            and status
            <Label isCompact color="red" className="pf-v6-u-mx-xs">
              failure
            </Label>
            or
            <Label isCompact color="red" className="pf-v6-u-mx-xs">
              error
            </Label>
          </Content>
          <CodeBlock>
            and( eq(name,job-name), or( eq(status,failure), eq(status,error) ) )
          </CodeBlock>
        </Content>
      </Modal>
      <ToolbarItem>
        <ToolbarFilter
          labels={query === null ? [] : [query]}
          deleteLabel={() => {
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
      <ToolbarGroup variant="action-group-plain">
        <ToolbarItem>
          <Button variant="secondary" type="submit" form={formId}>
            Search
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button
            icon={<QuestionCircleIcon />}
            variant={ButtonVariant.plain}
            aria-label="refresh"
            type="button"
            onClick={() => setShowHelperModal(!showHelperModal)}
          />
        </ToolbarItem>
      </ToolbarGroup>
    </>
  );
}

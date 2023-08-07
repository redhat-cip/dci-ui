import { useState } from "react";
import {
  Button,
  InputGroup,
  TextInput,
  ButtonVariant,
  ToolbarFilter,
  InputGroupItem,
} from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";

type EmailsFilterProps = {
  search: string;
  onSearch: (search: string) => void;
};

export default function EmailsFilter({ search, onSearch }: EmailsFilterProps) {
  const [email, setEmail] = useState(search);
  return (
    <ToolbarFilter categoryName="Email" showToolbarItem>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setEmail("");
          onSearch(email);
        }}
      >
        <InputGroup>
          <InputGroupItem isFill>
            <TextInput
              name="email"
              id="input-email"
              type="email"
              aria-label="email filter"
              onChange={(_event, email) => setEmail(email)}
              value={email}
              placeholder="Search by email..."
            />
          </InputGroupItem>
          <InputGroupItem>
            <Button
              variant={ButtonVariant.control}
              aria-label="search email button"
              type="submit"
            >
              <SearchIcon />
            </Button>
          </InputGroupItem>
        </InputGroup>
      </form>
    </ToolbarFilter>
  );
}

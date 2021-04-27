import { useState } from "react";
import {
  Button,
  InputGroup,
  TextInput,
  ButtonVariant,
  ToolbarFilter,
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
          <TextInput
            name="email"
            id="input-email"
            type="email"
            aria-label="email filter"
            onChange={(email) => setEmail(email)}
            value={email}
            placeholder="Search by email..."
          />
          <Button
            variant={ButtonVariant.control}
            aria-label="search email button"
            type="submit"
          >
            <SearchIcon />
          </Button>
        </InputGroup>
      </form>
    </ToolbarFilter>
  );
}

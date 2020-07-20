import React, { useState } from "react";
import {
  Button, InputGroup, TextInput, ButtonVariant,
} from "@patternfly/react-core";
import {
  SearchIcon,
} from "@patternfly/react-icons";

const EmailsFilter = ({ onSearch }) => {
  const [email, setEmail] = useState("")
  return <div>
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(email)
      }}>
      <InputGroup>
        <TextInput
          name="email"
          id="input-email"
          type="search"
          aria-label="email filter"
          onChange={(email) => setEmail(email)}
          value={email}
          placeholder="Filter by email..."
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
  </div>
}

export default EmailsFilter;

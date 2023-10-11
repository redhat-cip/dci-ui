import { useState } from "react";
import { ToolbarFilter, SearchInput } from "@patternfly/react-core";

type EmailsFilterProps = {
  search: string;
  onSearch: (search: string) => void;
};

export default function EmailsFilter({ search, onSearch }: EmailsFilterProps) {
  const [email, setEmail] = useState(search);
  return (
    <ToolbarFilter categoryName="Email" showToolbarItem>
      <SearchInput
        placeholder="Find a user by email"
        value={email}
        onChange={(e, value) => setEmail(value)}
        onSearch={(e, value) => {
          onSearch(value);
        }}
        onClear={() => setEmail("")}
      />
    </ToolbarFilter>
  );
}

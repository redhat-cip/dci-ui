import React, { useState } from "react";
import {
  KebabToggle,
  Dropdown,
  DropdownPosition,
} from "@patternfly/react-core";

interface KebabDropdownProps {
  items: React.ReactElement[];
  position: DropdownPosition;
}

export default function KebabDropdown({ items, position }: KebabDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dropdown
      onSelect={() => setIsOpen(!isOpen)}
      toggle={<KebabToggle onToggle={setIsOpen} />}
      isOpen={isOpen}
      isPlain
      dropdownItems={items}
      position={position}
    />
  );
}

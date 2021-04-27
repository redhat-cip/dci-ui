import { useState } from "react";
import * as React from "react";
import {
  KebabToggle,
  Dropdown,
  DropdownPosition,
} from "@patternfly/react-core";

interface KebabDropdownProps {
  items: React.ReactElement[];
  position?: DropdownPosition;
  [x: string]: any;
}

export default function KebabDropdown({
  items,
  position,
  ...props
}: KebabDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dropdown
      onSelect={console.log}
      toggle={<KebabToggle onToggle={setIsOpen} />}
      isOpen={isOpen}
      isPlain
      dropdownItems={items}
      position={position || DropdownPosition.right}
      {...props}
    />
  );
}

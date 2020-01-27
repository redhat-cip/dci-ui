import { useState } from "react";

const useModal = (defaultValue = false) => {
  const [isOpen, setIsOpen] = useState(defaultValue);
  console.log('isOpen in hook',isOpen)
  return {
    isOpen,
    toggle: () => setIsOpen(!isOpen),
    show: () => setIsOpen(true),
    hide: () => setIsOpen(false)
  };
};

export default useModal;

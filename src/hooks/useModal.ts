import { useState } from "react";

const useModal = (defaultValue = false) => {
  const [isOpen, setIsOpen] = useState(defaultValue);
  console.log("useModal isOpen:", isOpen);
  return {
    isOpen,
    toggle: () => setIsOpen(!isOpen),
    show: () => {
      console.log("show ma gueule");
      setIsOpen(true);
    },
    hide: () => setIsOpen(false),
  };
};

export default useModal;

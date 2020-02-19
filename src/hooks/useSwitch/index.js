import { useState } from "react";

const useSwitch = (defaultValue = false) => {
  const [isOn, setIsOn] = useState(defaultValue);
  return {
    isOn,
    on: () => setIsOn(true),
    off: () => setIsOn(false),
    toggle: () => setIsOn(!isOn)
  };
};

export default useSwitch;

import React from "react";

const useEffectAfterFirstMount = (
  effect: React.EffectCallback,
  deps?: React.DependencyList | undefined,
) => {
  const didMount = React.useRef(false);

  React.useEffect(() => {
    if (didMount.current) effect();
    else didMount.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useEffectAfterFirstMount;

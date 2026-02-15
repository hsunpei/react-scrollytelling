import { useContext } from "react";

import { ScrollytellingContext } from "../../context/grouped/ScrollytellingContext";

export function useScrollytelling() {
  const context = useContext(ScrollytellingContext);

  if (!context) {
    throw new Error(
      "useScrollytelling must be used within a ScrollytellingProvider"
    );
  }

  return context;
}

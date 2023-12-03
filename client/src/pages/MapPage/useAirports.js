import { useState } from "react";
import shuffleArray from "shuffle-array";
import { airports as airportsDb } from "./airports";

export const useAirports = () => {
  const [airports, setAirports] = useState(() => shuffleArray(airportsDb));

  const shuffle = () => {
    setAirports(shuffleArray(airportsDb));
  };

  return [airports, { shuffle }];
};

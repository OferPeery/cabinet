import { flag } from "country-emoji";
import { Typography, Box } from "@mui/material";

export const AirportCard = ({ airport }) => {
  const { countryIso, iata, name, location } = airport;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <Typography fontSize={50} lineHeight={0}>
        {flag(countryIso)}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography letterSpacing={1.8} fontWeight={500}>
          {iata}
        </Typography>
        <Typography fontSize={12} color="gray">
          {name}
        </Typography>
        <Typography fontSize={12} color="darkgray" fontStyle="italic">
          {`${location}`}
        </Typography>
      </Box>
    </Box>
  );
};

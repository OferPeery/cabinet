import React, { useState } from "react";
import ReactConfetti from "react-confetti";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Map } from "../../components/Map/Map";
import { useAirports } from "./useAirports";

const MapPage = () => {
  const [gameMode, setGameMode] = useState();
  const [airports, { shuffle }] = useAirports();

  return (
    <div
      className={gameMode ? "hide-tooltips" : null}
      style={{ width: "100%", height: "100%" }}
    >
      <Box sx={{ position: "relative" }} height="100%" width="100%">
        {gameMode ? (
          <GameMode airports={airports} endGame={() => setGameMode(false)} />
        ) : (
          <IdleMode
            airports={airports}
            startGame={() => {
              shuffle();
              setGameMode(true);
            }}
          />
        )}
      </Box>
    </div>
  );
};

export default MapPage;

const IdleMode = ({ airports, startGame }) => {
  return (
    <>
      <Button
        variant="contained"
        sx={{
          position: "absolute",
          top: 20,
          left: 50,
          zIndex: 9999,
        }}
        onClick={startGame}
      >
        Let's play!
      </Button>
      <Map airports={airports} />
    </>
  );
};

const GameMode = ({ airports, endGame }) => {
  const [selectedAirports, setSelectedAirports] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [success, setSuccess] = useState();
  const [party, setParty] = useState(false);
  const currentAirport = airports[currentIndex];

  const addAirportSelection = (airportId, status) =>
    setSelectedAirports((airports) => [...airports, { airportId, status }]);

  const onClickAirport = (airport) => {
    if (success || selectedAirports.includes(airport._id)) {
      return;
    }

    if (airport._id === currentAirport._id) {
      addAirportSelection(airport._id, "correct");
      setParty(true);
      setSuccess(true);
    } else {
      addAirportSelection(airport._id, "wrong");
    }
  };

  const nextQuestion = () => {
    setSuccess(false);
    setSelectedAirports([]);
    setCurrentIndex((index) => index + 1);
  };

  const isLastAirport = currentIndex === airports.length - 1;

  return (
    <>
      {success ? (
        <Button
          variant="contained"
          onClick={isLastAirport ? endGame : nextQuestion}
          color="secondary"
          sx={{
            position: "absolute",
            top: 20,
            left: 50,
            zIndex: 9999,
          }}
        >
          {`Great job! ${
            isLastAirport ? "You found them all!" : "Next question"
          }`}
        </Button>
      ) : (
        <Paper
          sx={{
            position: "absolute",
            top: 20,
            display: "flex",
            justifyContent: "center",
            zIndex: 9999,
            width: "500px",
            left: 50,
          }}
        >
          <Typography fontSize={32} color="text.main">
            {`Where is airport ${currentAirport.iata}?`}
          </Typography>
        </Paper>
      )}
      <ReactConfetti
        style={{
          pointerEvents: "none",
          zIndex: 9999999,
          width: "100%",
          height: "100%",
        }}
        numberOfPieces={party ? 500 : 0}
        recycle={false}
        onConfettiComplete={(confetti) => {
          setParty(false);
          confetti.reset();
        }}
      />
      <Map
        airports={airports}
        selectedAirports={selectedAirports}
        onClickAirport={onClickAirport}
      />

      <Button
        variant="contained"
        onClick={endGame}
        color="error"
        sx={{
          position: "absolute",
          bottom: 20,
          left: 20,
          zIndex: 9999,
        }}
      >
        End Game
      </Button>
    </>
  );
};

import React, { useMemo, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { questionsCollection } from "../utils/quizQuestions";
import { shuffleList } from "../utils/listUtils";
import ScoreBoard from "../components/Quiz/ScoreBoard";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PrintIcon from "@mui/icons-material/Print";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import Rating from "@mui/material/Rating";
import { useQuiz } from "../components/Quiz/useQuiz";
import AppModal from "../components/Modal/AppModal";
import GameEndCard from "../components/Quiz/GameEndCars";

const MainContent = styled(Box)({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

const PageTitle = ({ label }) => (
  <Typography variant="h3" fontWeight={250} mb={3}>
    {label}
  </Typography>
);

const QuestionCard = styled(Card)({
  width: 800,
  minHeight: 700,
  alignItems: "center",
  borderRadius: 10,
});

const QuestionImage = ({ src }) => (
  <CardMedia
    mt={2}
    pt={1}
    sx={{ maxHeight: 200 }}
    component="img"
    image={src}
  />
);

const QuestionNumber = ({ number }) => (
  <Typography gutterBottom variant="h6" fontWeight={350} component="div">
    Question {number}
  </Typography>
);

const QuestionTitle = ({ title }) => (
  <Typography fontWeight={400} component="div">
    {title}
  </Typography>
);

const QuestionTitles = ({ number, title }) => (
  <Box mb={2} ml={5}>
    <QuestionNumber number={number} />
    <QuestionTitle title={title} />
  </Box>
);

const answerButtonStyle = {
  minWidth: "90%",
  maxWidth: "90%",
  margin: 1,
  justifyContent: "left",
  textTransform: "none",
  display: "flex",
};

const CardDivider = () => (
  <Divider
    orientation="horizontal"
    flexItem
    sx={{ width: "100%", marginTop: 3 }}
  />
);

const AnswerRevealingBox = styled(Box)({
  marginTop: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const CorrectMessage = () => (
  <Typography mb={1.5} sx={{ color: "green" }}>
    You're correct
  </Typography>
);

const WrongMessage = ({ correct }) => (
  <>
    <Typography color="error">You're wrong</Typography>
    <Typography>The correct answer: {correct}</Typography>
  </>
);

const NextQuestionButton = ({ label, icon: Icon, color, ...rest }) => (
  <Button
    variant="outlined"
    sx={{ color, marginTop: 2 }}
    endIcon={<Icon />}
    {...rest}
  >
    {label}
  </Button>
);

const QuizPage = () => {
  const [isQuizActive, setIsQuizActve] = useState(true);
  const [questions, { shuffle: reShuffleQuestions }] = useQuiz();
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const question = questions[index];
  const quizSummaryRef = useRef(null);

  const answers = useMemo(() => {
    const { correct, wrongOptions } = question;
    return shuffleList([correct, ...wrongOptions]);
  }, [question]);

  const [analitics, setAnalitics] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState();
  const [openModal, setOpenModal] = useState(false);
  const questionAmount = questionsCollection.length;

  const isLast = () => index >= questionAmount - 1;

  const calcGrade = () => (correctCount * 100) / questionAmount;

  const computeAnswerColor = (answer) =>
    answer === question.correct
      ? "success.light"
      : answer === selectedAnswer
      ? "error.main"
      : "text.disabled.main";

  const handleSelected = (answer) => {
    setSelectedAnswer(answer);
    analitics.push({
      questionTitle: question.title,
      answers,
      userAnswer: answer,
      realCorrect: question.correct,
      isUserCorrect: answer === question.correct,
    });
    if (answer === question.correct) {
      setCorrectCount((count) => count + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!isLast()) {
      setIndex((index) => index + 1);
    } else {
      setOpenModal(true);
      setIsQuizActve(false);
    }

    setSelectedAnswer(undefined);
  };

  const handleReset = () => {
    setIsQuizActve(true);
    reShuffleQuestions();
    setIndex(0);
    setCorrectCount(0);
    setAnalitics([]);
    setSelectedAnswer(undefined);
  };

  return (
    <Box flex={7} p={2}>
      <MainContent>
        <PageTitle label={"Emergency Training"} />
        <Stack direction="row" spacing={2}>
          <Stack direction="column" spacing={2}>
            <ScoreBoard
              title="Grade:"
              label={`${calcGrade()}%`}
              color="info.light"
            />
            <ScoreBoard
              title="Points:"
              label={correctCount}
              color="text.disabled"
            />
            <ScoreBoard title="Answered:" label={index} color="text.disabled" />
            <ScoreBoard
              title="Out of:"
              label={questionAmount}
              color="text.disabled"
            />
            <Button onClick={handleReset} endIcon={<AutorenewIcon />}>
              Start over
            </Button>
          </Stack>

          <QuestionCard elevation={10}>
            {!isQuizActive ? (
              <GameEndCard />
            ) : (
              <>
                <QuestionImage src={question.imageUrl} />
                <CardContent>
                  <QuestionTitles number={index + 1} title={question.title} />
                  <Stack direction="column" alignItems="center">
                    {answers.map((answer, i) => (
                      <Button
                        variant="outlined"
                        sx={{
                          ...answerButtonStyle,
                          ":disabled": {
                            backgroundColor: computeAnswerColor(answer),
                            color: "text.primary",
                          },
                        }}
                        key={answer}
                        onClick={() => handleSelected(answer)}
                        disabled={selectedAnswer !== undefined}
                      >
                        <Stack direction="row" spacing={1}>
                          <Typography fontWeight={700}>
                            {String.fromCharCode("a".charCodeAt(0) + i)}.
                          </Typography>
                          <Typography textAlign="left">{answer}</Typography>
                        </Stack>
                      </Button>
                    ))}
                    {selectedAnswer !== undefined && (
                      <>
                        <CardDivider />
                        <AnswerRevealingBox>
                          {selectedAnswer === question.correct ? (
                            <CorrectMessage />
                          ) : (
                            <WrongMessage correct={question.correct} />
                          )}
                          <NextQuestionButton
                            icon={
                              isLast()
                                ? AssignmentTurnedInIcon
                                : ArrowForwardIosIcon
                            }
                            color={isLast() ? "success.main" : "info.main"}
                            label={
                              isLast() ? "Finish Answering" : "Next Question"
                            }
                            onClick={handleNextQuestion}
                          />
                        </AnswerRevealingBox>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </>
            )}
          </QuestionCard>
        </Stack>
      </MainContent>

      <AppModal
        className="modal"
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <ReactToPrint
          trigger={() => (
            <IconButton>
              <PrintIcon />
            </IconButton>
          )}
          content={() => quizSummaryRef.current}
        />

        <IconButton
          onClick={() => {
            setOpenModal(false);
            handleReset();
          }}
        >
          <AutorenewIcon />
        </IconButton>

        <Box ref={quizSummaryRef}>
          <Typography variant="h5" textAlign="center" mb={2}>
            Answer Review
          </Typography>

          <Typography variant="h6" textAlign="center">
            {`Grade: ${calcGrade()}%`}
          </Typography>

          <Typography variant="body1" textAlign="center">
            {`Answered correctly: ${correctCount} | Out of: ${questionAmount} `}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Rating value={calcGrade() / 20} readOnly size="small" />
          </Box>

          {analitics.map((analitic, i) => (
            <Box mb={2}>
              <CardDivider />
              <Typography fontWeight={500} fontSize={16}>
                ({i + 1}) {analitic.questionTitle}
              </Typography>

              {analitic.answers.map((answer, j) => (
                <Typography
                  color={
                    answer === analitic.realCorrect
                      ? "success.main"
                      : answer === analitic.userAnswer
                      ? "error.main"
                      : "text.default"
                  }
                >
                  <Stack direction="row" spacing={1}>
                    <div>{String.fromCharCode("a".charCodeAt(0) + j)}.</div>
                    <div>{answer}</div>
                  </Stack>
                </Typography>
              ))}
              <Typography
                color={analitic.isUserCorrect ? "success.main" : "error.main"}
              >
                {analitic.isUserCorrect
                  ? ">>> You answered correctly"
                  : ">>> You answered incorrectly"}
              </Typography>
            </Box>
          ))}
        </Box>
      </AppModal>
    </Box>
  );
};

export default QuizPage;

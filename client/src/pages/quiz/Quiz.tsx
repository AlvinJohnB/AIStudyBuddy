import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  XCircle,
  Brain,
  Home,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function Quiz() {
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  interface QuizData {
    _id: string;
    title: string;
    user: string;
    note: { title: string; _id: string };
    questions: Array<{
      _id?: string;
      question: string;
      options: Array<{
        text: string;
        _id: string;
      }>;
      answer: number;
      explanation: string;
    }>;
    createdAt: string;
    updatedAt: string;
  }

  const [quizData, setQuizData] = useState<QuizData | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/quizzes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setQuizData(response.data);
        console.log("Fetched quiz data:", response.data);
      } catch (error) {
        console.log("Error fetching quiz data:", error);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (quizData && currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    if (!quizData) return 0;

    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === quizData.questions[index].answer) {
        correct++;
      }
    });
    return Math.round((correct / quizData.questions.length) * 100);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizCompleted(false);
  };

  if (showResults && quizCompleted) {
    const score = calculateScore();
    const correctAnswers = quizData
      ? selectedAnswers.filter(
          (answer, index) => answer === quizData.questions[index].answer
        ).length
      : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {score >= 70 ? (
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  ) : (
                    <XCircle className="h-16 w-16 text-red-500" />
                  )}
                </div>
                <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-primary">{score}%</p>
                  <p className="text-muted-foreground">
                    You got {correctAnswers} out of{" "}
                    {quizData?.questions.length || 0} questions correct
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {correctAnswers}
                    </p>
                    <p className="text-sm text-muted-foreground">Correct</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {(quizData?.questions.length || 0) - correctAnswers}
                    </p>
                    <p className="text-sm text-muted-foreground">Incorrect</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Review Your Answers:</h3>
                  {quizData?.questions.map((question, index) => {
                    const userAnswer = selectedAnswers[index];
                    const isCorrect = userAnswer === question.answer;

                    return (
                      <div key={question._id} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium mb-2">
                              {question.question}
                            </p>
                            <p className="text-sm text-muted-foreground mb-2">
                              Your answer:{" "}
                              <span
                                className={
                                  isCorrect ? "text-green-600" : "text-red-600"
                                }
                              >
                                {question.options[userAnswer]?.text}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-muted-foreground mb-2">
                                Correct answer:{" "}
                                <span className="text-green-600">
                                  {question.options[question.answer]?.text}
                                </span>
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground italic">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={resetQuiz}
                    variant="outline"
                    className="flex-1 bg-transparent"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retake Quiz
                  </Button>
                  <Link to="/" className="flex-1">
                    <Button className="w-full">
                      <Home className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Ensure quizData is available before rendering
  if (!quizData) return <div>Loading quiz...</div>;

  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
  const currentQ = quizData.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-blue-600" />
              <div className="text-right">
                <p className="font-semibold">{quizData.title}</p>
                {/* <p className="text-sm text-muted-foreground">
                  {quizData.note.title}
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Question {currentQuestion + 1} of {quizData.questions.length}
              </span>
              {/* <Badge variant="secondary">{quizData.difficulty}</Badge> */}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-balance">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={option._id || index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all hover:border-blue-300 ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="font-medium">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {/* Slice - 2 to remove first 3 chars */}
                    <span>{option.text.slice(2)}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
            >
              {currentQuestion === quizData.questions.length - 1
                ? "Finish Quiz"
                : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

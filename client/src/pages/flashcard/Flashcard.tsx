import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Brain,
  Home,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

interface FlashcardCard {
  _id: string;
  note: object;
  title: string;
  user: string;
  questions: Array<{
    _id: string;
    question: string;
    answer: string;
    explanation: string;
  }>;
}

export default function Flashcard() {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set());
  const [flashcardData, setFlashcardData] = useState<FlashcardCard | null>(
    null
  );

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/flashcards/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          setFlashcardData(response.data);
        }
        console.log("Fetched flashcards:", response.data);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };
    fetchFlashcards();
  }, []);

  const handleNext = () => {
    if (flashcardData && currentCard < flashcardData.questions.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setStudiedCards((prev) => new Set([...prev, currentCard]));
    }
  };

  const resetCards = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setStudiedCards(new Set());
  };

  const progress =
    (studiedCards.size / (flashcardData?.questions?.length ?? 1)) * 100;
  const currentCardData = flashcardData?.questions[currentCard];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
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
              <Brain className="h-5 w-5 text-purple-600" />
              <div className="text-right">
                <p className="font-semibold">{flashcardData?.title}</p>
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
                Card {currentCard + 1} of {flashcardData?.questions.length}
              </span>
              <div className="flex items-center gap-2">
                {/* <Badge variant="secondary">{flashcardData?.difficulty}</Badge> */}
                <span className="text-sm text-muted-foreground">
                  {studiedCards.size} studied
                </span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Flashcard */}
          <div className="mb-6 perspective-1000">
            <Card
              className={`h-80 cursor-pointer transition-transform duration-500 transform-style-preserve-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              onClick={handleFlip}
            >
              {/* Front of card */}
              <div
                className={`absolute inset-0 backface-hidden ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-muted-foreground">
                    Question
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-48">
                  <p className="text-xl text-center text-balance font-medium">
                    {currentCardData?.question || "Loading..."}
                  </p>
                </CardContent>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Click to reveal answer
                  </Button>
                </div>
              </div>

              {/* Back of card */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 bg-purple-50 dark:bg-purple-900/20 ${
                  isFlipped ? "" : "rotate-y-180"
                }`}
              >
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-purple-600 dark:text-purple-400">
                    Answer
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid items-center justify-center h-48">
                  <p className="text-xl text-center text-balance font-medium">
                    {currentCardData?.answer || "Loading..."}
                  </p>
                  {currentCardData?.explanation && (
                    <p className="mt-4 text-sm text-center text-muted-foreground">
                      {currentCardData.explanation}
                    </p>
                  )}
                </CardContent>
                <div className="absolute bottom-0 md:bottom-4 left-1/2 transform -translate-x-1/2">
                  <Button variant="ghost" size="sm">
                    <EyeOff className="h-4 w-4 mr-2" />
                    Click to hide answer
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Navigation */}
          <div className="md:flex justify-between flex-wrap items-center hidden md:visible">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentCard === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetCards}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Link to="/">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>

            <Button
              onClick={handleNext}
              disabled={
                !flashcardData?.questions ||
                currentCard === flashcardData.questions.length - 1
              }
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Nav Small Screens */}
          <div className="flex justify-between flex-wrap items-center md:hidden">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentCard === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Prev
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetCards}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Link to="/">
                <Button variant="outline">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <Button
              onClick={handleNext}
              disabled={
                !flashcardData?.questions ||
                currentCard === flashcardData.questions.length - 1
              }
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Study Progress */}
          <Card className="mt-8">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Study Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}% complete
                </span>
              </div>
              <div className="flex gap-1 mt-2">
                {flashcardData?.questions.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded ${
                      studiedCards.has(index)
                        ? "bg-purple-500"
                        : index === currentCard
                        ? "bg-purple-300"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

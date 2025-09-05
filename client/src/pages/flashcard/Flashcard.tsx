import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Brain,
  Home,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock flashcard data
const mockFlashcards = {
  id: "2",
  title: "Math Practice",
  source: "Math Formulas.pdf",
  type: "Flashcards",
  difficulty: "Hard",
  cards: [
    {
      id: 1,
      front: "What is the quadratic formula?",
      back: "x = (-b ± √(b² - 4ac)) / 2a",
    },
    {
      id: 2,
      front: "What is the derivative of sin(x)?",
      back: "cos(x)",
    },
    {
      id: 3,
      front: "What is the integral of 1/x?",
      back: "ln|x| + C",
    },
  ],
};

export default function FlashcardsPage() {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set());

  const handleNext = () => {
    if (currentCard < mockFlashcards.cards.length - 1) {
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

  const progress = (studiedCards.size / mockFlashcards.cards.length) * 100;
  const currentCardData = mockFlashcards.cards[currentCard];

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
                <p className="font-semibold">{mockFlashcards.title}</p>
                <p className="text-sm text-muted-foreground">
                  {mockFlashcards.source}
                </p>
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
                Card {currentCard + 1} of {mockFlashcards.cards.length}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{mockFlashcards.difficulty}</Badge>
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
                    {currentCardData.front}
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
                <CardContent className="flex items-center justify-center h-48">
                  <p className="text-xl text-center text-balance font-medium">
                    {currentCardData.back}
                  </p>
                </CardContent>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <Button variant="ghost" size="sm">
                    <EyeOff className="h-4 w-4 mr-2" />
                    Click to hide answer
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
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
              disabled={currentCard === mockFlashcards.cards.length - 1}
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
                {mockFlashcards.cards.map((_, index) => (
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

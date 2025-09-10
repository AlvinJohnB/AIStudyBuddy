import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, BookOpen, Brain, FileText, Plus, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  interface Note {
    _id: string;
    title: string;
    extractedText: string;
    user: string;
    createdAt: string;
  }

  interface Quiz {
    _id: string;
    title: string;
    user: string;
    note: string;
    questions: any[];
    createdAt: string;
    updatedAt: string;
  }

  interface Flashcard {
    _id: string;
    title: string;
    questions: any[];
    user: string;
    note: string;
  }

  const [notes, setNotes] = useState<Note[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/notes`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setNotes(response.data);
        console.log("Fetched notes:", response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/quizzes`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setQuizzes(response.data);
        console.log("Fetched quizzes:", response.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/flashcards`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFlashcards(response.data);
        console.log("Fetched flashcards:", response.data);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };
    fetchNotes();
    fetchQuizzes();
    fetchFlashcards();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  AI Study Buddy
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Smart learning companion
                </p>
              </div>
            </div>
            {/* <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div> */}
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Upload PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-balance">
            Welcome back to your study space
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Upload your notes and let AI create personalized quizzes to boost
            your learning.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {notes.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Documents uploaded
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {quizzes.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Quizzes generated
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {flashcards.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Flashcards generated
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Study Materials
              </CardTitle>
              <CardDescription>
                Upload PDF files of your notes, textbooks, or handouts to get
                started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Drop your PDF files here
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  or click to browse your files
                </p>
                <Button>Choose Files</Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Notes
              </CardTitle>
              <CardDescription>
                Your recently uploaded study materials.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto">
              {notes.map((note, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 p-3 rounded-lg border bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center mb-1 gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-red-100 dark:bg-red-900">
                      <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {note.title}
                      </p>
                      {/* <p className="text-sm text-gray-600 dark:text-gray-400">
                        {note.pages} pages • {note.date}
                      </p> */}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button variant="outline" size="sm">
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Quiz
                    </Button>
                    <Button variant="outline" size="sm">
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Flashcards
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Generated Quizzes Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Your Generated Quizzes
            </CardTitle>
            <CardDescription>
              AI-generated quizzes from your study materials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz) => (
                <Card
                  key={quiz._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {quiz.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      From: {quiz.title}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span>{quiz.questions.length} questions</span>
                    </div>
                    <Link to={`/quiz/${quiz._id}`}>
                      <Button className="w-full" size="sm">
                        Start Quiz
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Generated Flashcards Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Your Generated Flashcards
            </CardTitle>
            <CardDescription>
              AI-generated flashcards from your study materials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashcards.map((flashcard) => (
                <Card
                  key={flashcard._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {flashcard.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      From: {flashcard.title}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span>{flashcard.questions.length} questions</span>
                    </div>
                    <Link to={`/flashcard/${flashcard._id}`}>
                      <Button className="w-full" size="sm">
                        Start Studying
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

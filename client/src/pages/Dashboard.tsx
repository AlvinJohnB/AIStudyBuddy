import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  BookOpen,
  Brain,
  FileText,
  Plus,
  Clock,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
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
                    12
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
                    8
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
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    24h
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Study time this week
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
                Recent Documents
              </CardTitle>
              <CardDescription>
                Your recently uploaded study materials.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  name: "Biology Chapter 12.pdf",
                  date: "2 hours ago",
                  pages: 24,
                },
                { name: "Math Formulas.pdf", date: "1 day ago", pages: 8 },
                { name: "History Notes.pdf", date: "3 days ago", pages: 16 },
              ].map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-red-100 dark:bg-red-900">
                      <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {doc.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {doc.pages} pages • {doc.date}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Brain className="h-4 w-4 mr-2" />
                    Generate Quiz
                  </Button>
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
              {[
                {
                  id: "1",
                  title: "Biology Quiz #1",
                  source: "Biology Chapter 12.pdf",
                  questions: 15,
                  type: "Multiple Choice",
                  difficulty: "Medium",
                },
                {
                  id: "2",
                  title: "Math Practice",
                  source: "Math Formulas.pdf",
                  questions: 10,
                  type: "Flashcards",
                  difficulty: "Hard",
                },
                {
                  id: "3",
                  title: "History Review",
                  source: "History Notes.pdf",
                  questions: 20,
                  type: "Multiple Choice",
                  difficulty: "Easy",
                },
              ].map((quiz, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {quiz.title}
                      </h3>
                      <Badge
                        variant={
                          quiz.difficulty === "Easy"
                            ? "secondary"
                            : quiz.difficulty === "Medium"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      From: {quiz.source}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span>{quiz.questions} questions</span>
                      <span>{quiz.type}</span>
                    </div>
                    <Link
                      to={
                        quiz.type === "Flashcards"
                          ? `/flashcards/${quiz.id}`
                          : `/quiz/${quiz.id}`
                      }
                    >
                      <Button className="w-full" size="sm">
                        Start {quiz.type === "Flashcards" ? "Study" : "Quiz"}
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

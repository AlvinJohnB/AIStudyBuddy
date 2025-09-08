import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/quiz/Quiz";
import Flashcard from "./pages/flashcard/Flashcard";

import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/flashcard/:id" element={<Flashcard />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </Router>
  );
}

export default App;

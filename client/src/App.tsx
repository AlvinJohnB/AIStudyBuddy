import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/quiz/Quiz";
import Flashcard from "./pages/flashcard/Flashcard";

import { Toaster } from "@/components/ui/sonner";
import Loading from "./components/loading";
import { LoadingProvider } from "./contexts/LoadingContext";
import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from "./contexts/ProtectedRoute";

function App() {
  return (
    <Router>
      <UserProvider>
        <LoadingProvider>
          <Loading />

          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/flashcard/:id" element={<Flashcard />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </LoadingProvider>
      </UserProvider>
    </Router>
  );
}

export default App;

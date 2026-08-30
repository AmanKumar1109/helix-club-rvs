import { Routes, Route } from "react-router-dom";
import QuizzApp, { QuizTakeScreen } from './QuizzScreen';
import AdminApp from './adminScreen';

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizzApp />} />
      <Route path="/quiz/:quizId" element={<QuizTakeScreen />} />
      <Route path="/adminpannel" element={<AdminApp />} />
    </Routes>
  );
}

export default App;

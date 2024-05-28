import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/index.js";
import Login from "./pages/Login/index.js";
import Register from "./pages/Register/index.js";
import "./stylesheets/alignments.css";
import "./stylesheets/sizes.css";
import "./stylesheets/form-elements.css";
import "./stylesheets/custom.css";
import "./stylesheets/mytheme.css";
import ProtectedRoute from "./components/ProtectedRoute.js";
import { useSelector } from "react-redux";
import Profile from "./pages/Profile/index.js";
import Admin from "./pages/Admin/index.js";
import TheatresForMovie from "./pages/TheatresForMovie";
import BookShow from "./pages/BookShow/index.js";
import ForgotPassword from "./pages/Login/ForgotPassword.js";


function App() {
  const { loading } = useSelector((state) => state.loaders);
  return (
    <div>
     {loading && (
        <div className="loader-parent">
          <div className="loader"></div>
        </div>
      )}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/movie/:id"
            element={
              <ProtectedRoute>
                <TheatresForMovie />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-show/:id"
            element={
              <ProtectedRoute>
                <BookShow />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
        </Routes>
          </BrowserRouter> 
    </div>
  );
}

export default App;

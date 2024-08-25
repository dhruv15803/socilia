import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Layouts/Layout";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AppContextProvider from "./Context/AppContext";
export const backendUrl = "http://localhost:5000";

function App() {
  return (
    <>
      <AppContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<>Home</>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Routes>
        </Router>
      </AppContextProvider>
    </>
  );
}

export default App;

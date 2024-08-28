import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Layouts/Layout";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AppContextProvider from "./Context/AppContext";
import CreatePost from "./Pages/CreatePost";
import Home from "./Pages/Home";
import ProtectedRoute from "./Layouts/ProtectedRoute";
import PostDetail from "./Pages/PostDetail";
import Profile from "./Pages/Profile";
import ProfileLayout from "./Layouts/ProfileLayout";
import MyPosts from "./Pages/MyPosts";
export const backendUrl = "http://localhost:5000";

function App() {
  return (
    <>
      <AppContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute />}>
                <Route index element={<Home />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/post/:postId" element={<PostDetail/>}/>
                <Route path="/profile" element={<ProfileLayout/>}>
                  <Route index element={<MyPosts/>}/>
                  <Route path="liked_posts" element={<>liked posts</>}/>
                  <Route/>
                </Route>
              </Route>
            </Route>
          </Routes>
        </Router>
      </AppContextProvider>
    </>
  );
}

export default App;

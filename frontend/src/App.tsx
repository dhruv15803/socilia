import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Layouts/Layout";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AppContextProvider from "./Context/AppContext";
import CreatePost from "./Pages/CreatePost";
import Home from "./Pages/Home";
import ProtectedRoute from "./Layouts/ProtectedRoute";
import PostDetail from "./Pages/PostDetail";
import ProfileLayout from "./Layouts/ProfileLayout";
import MyPosts from "./Pages/MyPosts";
import LikedPosts from "./Pages/LikedPosts";
import UserProfileLayout from "./Layouts/UserProfileLayout";
import UserPosts from "./Pages/UserPosts";
import UserLikedPosts from "./Pages/UserLikedPosts";
import ChatWindow from "./Pages/ChatWindow";
import {io} from "socket.io-client"
import SocketContextProvider from "./Context/SocketContext";
export const backendUrl = "http://localhost:5000";

function App() {
  return (
    <>
      <AppContextProvider>
        <SocketContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute />}>
                <Route index element={<Home/>} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/post/:postId" element={<PostDetail/>}/>
                <Route path="/profile" element={<UserProfileLayout/>}>
                  <Route path=":userId" element={<UserPosts/>}/>
                  <Route path="liked_posts/:userId" element={<UserLikedPosts/>}/>
                </Route>
                <Route path="/profile" element={<ProfileLayout/>}>
                  <Route index element={<MyPosts/>}/>
                  <Route path="liked_posts" element={<LikedPosts/>}/>
                </Route>
                <Route path="chat/:selectedId" element={<ChatWindow/>}/>
              </Route>
            </Route>
          </Routes>
        </Router>
        </SocketContextProvider>
      </AppContextProvider>
    </>
  );
}

export default App;

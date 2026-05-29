import { Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import SavedPage from "./pages/SavedPage";
import ProfilePage from "./pages/ProfilePage";
import EditAccountPage from "./pages/EditAccountPage";
import NewPostPage from "./pages/NewPostPage";
import SpeciesPage from "./pages/SpeciesPage";
import NotFoundPage from "./pages/NotFoundPage";
import PostPage from "./pages/PostPage";

function App() {
  return (
    <>
      <SideBar />
      <div className="lg:ml-60 mt-16 p-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-account" element={<EditAccountPage />} />
          <Route path="/new-post" element={<NewPostPage />} />
          <Route path="/species/:speciesId" element={<SpeciesPage />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

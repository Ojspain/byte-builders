import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import SavedPage from "./pages/SavedPage";
import ProfilePage from "./pages/ProfilePage";
import NewPostPage from "./pages/NewPostPage";
import SpeciesPage from "./pages/SpeciesPage";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/new-post" element={<NewPostPage />} />
        <Route path="/species/:speciesId" element={<SpeciesPage />} />
      </Routes>
    </>
  );
}

export default App

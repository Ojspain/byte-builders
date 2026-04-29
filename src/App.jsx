import { Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import SavedPage from "./pages/SavedPage";
import ProfilePage from "./pages/ProfilePage";
import NewPostPage from "./pages/NewPostPage";
import SpeciesPage from "./pages/SpeciesPage";

function App() {

  return (
    <>
      <SideBar />
      <div className='lg:ml-60 mt-16 p-10'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/new-post" element={<NewPostPage />} />
          <Route path="/species/:speciesId" element={<SpeciesPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App

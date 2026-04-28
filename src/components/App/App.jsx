import './App.css';
// import SideBar from '../SideBar/SideBar';
import Post from '../Post/Post';
import dummy from '../../dummy_db.json';

function App() {

  return (
    <>
      {/* <SideBar /> */}
      <div className='flex flex-col gap-20 p-10'>
        {dummy.posts.map((p) => (
          <Post key={p._id} _id={p._id} authorName={p.authorName} imageUrl={p.imageUrl} speciesCommon={p.speciesCommon} speciesActual={p.speciesActual} textContent={p.textContent} location={p.location} tags={p.tags} rating={p.rating} heart={p.heart} createdAt={p.createdAt} />
        ))}
      </div>
    </>
  )
}

export default App

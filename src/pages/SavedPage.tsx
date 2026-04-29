import SideBar from '../components/SideBar/SideBar';

function SavedPage() {

    return (
        <>
            <SideBar />
            {/* Keep at least these styles so the SideBar works */}
            <div className='ml-60 mt-16 p-10'>
                {/* Page content goes here */}
            </div>
        </>
    )
}

export default SavedPage

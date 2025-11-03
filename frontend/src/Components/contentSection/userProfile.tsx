import { useEffect } from "react";

interface CurrentUser{
  _id:string,
  username:string,
  email:string,
  password:string,
  profileImg:string,
  TopicsInterested:[],
  goal:string,
  createdAt:string,
  updatedAt:string
}

interface userProfileProps {
  currentUser:CurrentUser | null,
  profileImage:string
}


function UserProfile( {currentUser, profileImage}:userProfileProps) {
  
  useEffect(() => {
    console.log(" current User: ",currentUser);
  }, []);
  
  return (
    <aside
      className={`py-8 p-4 w-[25vw] text-center bg-gray-50 shadow:sm rounded:lg text-gray-700`}
    >
      <h2 className="font-bold text:xl mb-6">
        {" "}
        {currentUser?.username && currentUser.username.length
          ? `About ${currentUser.username.toUpperCase()}`
          : "About"}
      </h2>
      {profileImage && (
        <img
          src={profileImage}
          alt="greenry"
          className="w-auto h-52 mx-auto rounded-lg shadow-md mb-6 "
        />
      )}
      <div className="space-y-6">
        <section>
          <h2 className="font-bold mt-4"> Goal</h2>
          {currentUser?.goal && currentUser.goal.length ? (
            <h3> {currentUser.goal} </h3>
          ) : (
            <h3>Goal is not defined</h3>
          )}
        </section>
        <section>
          <h3 className="text-bold text-lg font-bold mt-4 text-center border-t border-blue-400">
            {" "}
            Interest{" "}
          </h3>
          <span className="border-t border-blue-400"></span>

          {currentUser?.TopicsInterested &&
          currentUser.TopicsInterested.length ? (
            currentUser.TopicsInterested.map((interest, index) => (
              <h5 key={index}>{interest} </h5>
            ))
          ) : (
            <h3> interests are not Added</h3>
          )}
        </section>
      </div>
    </aside>
  );
}

export default UserProfile
import React from 'react';
import ProfilePreview from './ProfilePreview';
import Image1 from '../assets/Image1.jpg'; 
import Image2 from '../assets/Image2.jpg';
import Image3 from '../assets/Image3.jpg';
import Image4 from '../assets/Image4.jpg';


const FriendsList = ({ userId }) => {
    const dummyFriends = [
        {
            id: 2,
            firstName: "Joshua",
            lastName: "Roberts",
            username: "Jroberts",
            bio: "Frontend developer and UI/UX enthusiast",
            avatar: Image2
        },
        {
            id: 3,
            firstName: "Lyle",
            lastName: "Cornick",
            username: "Minipekka123",
            bio: "Backend developer specializing in Node.js",
            avatar: Image1
        },{
            id: 4,
            firstName: "Noah",
            lastName: "Dollenberg",
            username: "NJDFilms",
            bio: "Full-stack developer and open-source contributor",
            avatar: Image3
        }, {
            id: 5,
            firstName: "Harry",
            lastName: "Bailey",
            username: "harrybailey",
            bio: "DevOps engineer and cloud computing expert",
            avatar: Image4
        }
    ];

    return (
        <section className="friends-list">
            <h3 className="mb-2">Friends</h3>
            <div className="grid grid-2">
                {dummyFriends.map(friend => (
                    <ProfilePreview key={friend.id} user={friend} />
                ))}
            </div>
        </section>
    );
};

export default FriendsList;

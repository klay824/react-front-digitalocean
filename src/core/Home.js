import React from 'react';
import Posts from '../post/Posts';

const Home = () => {
    return (
        <>
            <div className="p-5 bg-light">
                <h2>Home</h2>
                <p className="lead">Welcome to the React Frontend!</p>
            </div>
            <div className="container">
                <Posts />
            </div>
        </>
    );
};

export default Home;

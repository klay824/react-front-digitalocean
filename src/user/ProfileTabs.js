import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DefaultAvatar from '../images/avatar.jpg';

class ProfileTabs extends Component {
    render() {
        const { following, followers, posts } = this.props;
        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <h3 className="text-info">Followers</h3>
                        <hr />
                        {followers.map((follower, i) => {
                            return (<div key={i}>
                                <div style={{ display: 'in-line' }}>
                                    <Link to={`/user/${follower._id}`}
                                        className="text-info"
                                    >
                                        <img
                                            style={{ borderRadius: "50%", border: "1px solid black" }}
                                            className="float-left me-2"
                                            height="30px"
                                            width="30px"
                                            onError={i => (i.target.src = `${DefaultAvatar}`)}
                                            src={`${process.env.REACT_APP_BASE_URL}/user/photo/${follower._id}`}
                                            alt={follower.name}
                                        />
                                        <div>
                                            <p className="lead">{follower.name}</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                    <div className="col-md-4">
                        <h3 className="text-info">Following</h3>
                        <hr />
                        {following.map((follow, i) => {
                            return (<div key={i}>
                                <div>
                                    <Link to={`/user/${follow._id}`}
                                        className="text-info"
                                    >
                                        <img
                                            style={{ borderRadius: "50%", border: "1px solid black" }}
                                            className="float-left me-2"
                                            height="30px"
                                            width="30px"
                                            onError={i => (i.target.src = `${DefaultAvatar}`)}
                                            src={`${process.env.REACT_APP_BASE_URL}/user/photo/${follow._id}`}
                                            alt={follow.name}
                                        />
                                        <div>
                                            <p className="lead">{follow.name}</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            )
                        })}
                    </div>

                    <div className="col-md-4">
                        <h3 className="text-info">Posts</h3>
                        <hr />
                        {posts.map((post, i) => (
                            <div key={i}>
                                <div>
                                    <Link
                                        to={`/post/${post._id}`}
                                        className="text-info"
                                    >
                                        <div>
                                            <p className="lead">
                                                {post.title}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
};

export default ProfileTabs;
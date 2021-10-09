import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { read, update, updateUser } from './apiUser';
import Loading from './Loading';
import DefaultAvatar from '../images/avatar.jpg';

class EditProfile extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            name: "",
            email: "",
            about: "",
            password: "",
            redirectToProfile: false,
            error: "",
            loading: false,
            fileSize: 0
        };
    };

    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToProfile: true });
                } else {
                    this.setState({
                        id: data._id,
                        name: data.name,
                        email: data.email,
                        about: data.about,
                        error: ""
                    });
                }
            });
    };

    componentDidMount() {
        this.userData = new FormData()
        const userId = this.props.match.params.userId;
        this.init(userId);
    };

    isValid = () => {
        const { name, email, password, fileSize } = this.state;

        if (fileSize > 200000) {
            this.setState({ error: "File size should be less than 2mb." })
            return false;
        }

        if (name.length === 0) {
            this.setState({ error: "Name is required.", loading: false })
            return false;
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            this.setState({ error: "A valid email is required.", loading: false })
            return false;
        }
        if (password.length >= 1 && password.length <= 5) {
            this.setState({ error: "Password must be at least 6 characters long.", loading: false });
            return false;
        }
        return true;
    };

    handleChange = (name) => (e) => {
        const value = name === "photo" ? e.target.files[0] : e.target.value;

        const fileSize = name === "photo" ? e.target.files[0].size : 0;
        this.userData.set(name, value);
        this.setState({ error: "" });
        this.setState({ [name]: value, fileSize });
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;

            update(userId, token, this.userData)
                .then(data => {
                    if (data.error) this.setState({ error: data.error })
                    else
                        updateUser(data, () => {
                            this.setState({
                                redirectToProfile: true
                            });
                        });
                });
        }
    };

    updateForm = (name, email, about, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Profile Photo</label>
                <input
                    onChange={this.handleChange("photo")}
                    type="file"
                    accept='image/*'
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    onChange={this.handleChange("name")}
                    type="text"
                    className="form-control"
                    value={name}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={this.handleChange("email")}
                    type="email"
                    className="form-control"
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">About</label>
                <textarea
                    onChange={this.handleChange("about")}
                    type="text"
                    className="form-control"
                    value={about}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    onChange={this.handleChange("password")}
                    type="password"
                    className="form-control"
                    value={password}
                />
            </div>
            <button
                onClick={this.clickSubmit}
                className="mt-2 btn btn-raised btn-info"
            >
                Update
            </button>
        </form>
    );

    render() {
        const {
            id,
            name,
            email,
            about,
            password,
            redirectToProfile,
            error,
            loading
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`} />
        }

        const photoUrl = id ? `${process.env.REACT_APP_BASE_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultAvatar

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Profile</h2>
                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>

                {loading ? <Loading /> : ""}

                <img
                    className="img-thumbnail"
                    style={{ height: "200px", width: "auto" }}
                    src={photoUrl}
                    onError={i => (i.target.src = `${DefaultAvatar}`)}
                    alt={name}
                />

                {this.updateForm(name, email, about, password)}
            </div>

        )
    };
};

export default EditProfile;
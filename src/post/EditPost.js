import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { singlePost, update } from './apiPost';
import { isAuthenticated } from '../auth';
import DefaultPost from '../images/mountains.jpg';
import Loading from '../user/Loading';

class EditPost extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            title: "",
            body: "",
            redirectToPost: false,
            error: "",
            fileSize: 0,
            loading: false
        };
    };

    init = postId => {
        singlePost(postId)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToProfile: true });
                } else {
                    this.setState({
                        id: data._id,
                        title: data.title,
                        body: data.body,
                        error: ""
                    });
                }
            });
    };

    componentDidMount() {
        this.postData = new FormData()
        const postId = this.props.match.params.postId;
        this.init(postId);
    };

    isValid = () => {
        const { title, body, fileSize } = this.state;

        if (fileSize > 200000) {
            this.setState({ error: "File size should be less than 2mb." })
            return false;
        }

        if (title.length === 0 || body.length === 0) {
            this.setState({ error: "All fields are required.", loading: false })
            return false;
        }

        return true;
    };

    handleChange = (name) => (e) => {
        const value = name === "photo" ? e.target.files[0] : e.target.value;

        const fileSize = name === "photo" ? e.target.files[0].size : 0;
        this.postData.set(name, value);
        this.setState({ error: "" });
        this.setState({ [name]: value, fileSize });
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const postId = this.state.id;
            const token = isAuthenticated().token;

            update(postId, token, this.postData)
                .then(data => {
                    if (data.error) this.setState({ error: data.error })
                    else {
                        this.setState({
                            loading: false,
                            title: "",
                            body: "",
                            photo: "",
                            redirectToPost: true
                        });
                    }
                });
        }
    };

    editPostForm = (title, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Post Photo</label>
                <input
                    onChange={this.handleChange("photo")}
                    type="file"
                    accept='image/*'
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input
                    onChange={this.handleChange("title")}
                    type="text"
                    className="form-control"
                    value={title}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea
                    onChange={this.handleChange("body")}
                    type="text"
                    className="form-control"
                    value={body}
                />
            </div>
            <button
                onClick={this.clickSubmit}
                className="mt-2 btn btn-raised btn-info"
            >
                Submit Edit
            </button>
        </form>
    );

    render() {
        const { id, title, body, redirectToPost, error, loading } = this.state;
        const postId = this.props.match.params.postId;

        if (redirectToPost) {
            return <Redirect to={`/post/${postId}`} />
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">{title}</h2>
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
                    src={`${process.env.REACT_APP_BASE_URL}/post/photo/${id}`}
                    onError={i => (i.target.src = `${DefaultPost}`)}
                    alt={title}
                />
                {this.editPostForm(title, body)}
            </div>
        );
    };
};

export default EditPost;
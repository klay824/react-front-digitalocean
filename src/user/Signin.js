import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Loading from './Loading';
import { signin, authenticate } from '../auth';

class Signin extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            error: '',
            redirectToReferer: false,
            loading: false
        }
    };

    handleChange = (name) => (e) => {
        this.setState({ error: "" });
        this.setState({ [name]: e.target.value });
    };



    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true })
        const { email, password } = this.state;
        const user = {
            email,
            password
        };
        // console.log(user);
        signin(user)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error, loading: false })
                } else {
                    // authenticate
                    authenticate(data, () => {
                        this.setState({ redirectToReferer: true });
                    });
                    // redirect
                }

            });
    };



    signinForm = (email, password) => (
        <form>
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
                Submit
            </button>
        </form>
    )

    render() {
        const { email, password, error, redirectToReferer, loading } = this.state;

        if (redirectToReferer) {
            return <Redirect to="/" />
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-4">Sign In</h2>
                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>
                {loading ? <Loading /> : ""}
                {this.signinForm(email, password)}

                <p className="mt-2">
                    Forgot your password? Click
                    <Link
                        to="/forgot-password"
                        className="text-danger">
                        {" "}
                        here
                    </Link>
                    {" "}
                    to reset it.
                </p>
            </div>
        );
    };
};

export default Signin;

import React, { Component } from 'react'
import axios from "axios";
import Cookies from "js-cookie";
import { Redirect } from "react-router-dom";
export default class Login extends Component {
    constructor() {
        super()
        this.state = {
            user: {

                email: "",
                password: ""
            },

            err: "",
            loggedIn: false
        }
    }

    refresh = refreshToken => {

        console.log("Refreshing token!");

        return new Promise((resolve, reject) => {
            axios
                .post("http://localhost:8000/refresh", { token: refreshToken })
                .then(data => {
                    if (data.data.success === false) {
                        this.setState({
                            err: "Login again"
                        })
                        // set message and return.
                        resolve(false);
                    } else {
                        var { accessToken } = data.data;
                        Cookies.set("access", accessToken);
                        resolve(accessToken);
                    }
                });
        });
    };
    requestLogin = async (accessToken, refreshToken) => {

        console.log(accessToken, refreshToken);
        return new Promise((resolve, reject) => {

            axios.post(
                "http://localhost:8000/protected",
                {},
                { headers: { authorization: `Bearer ${accessToken}` } }
            )
                .then(async data => {
                    if (data.data.success === false) {
                        if (data.data.message === "User not authenticated") {
                            this.setState({
                                err: "Login again"
                            })
                        } else if (
                            data.data.message === "Access token expired"
                        ) {
                            var accessToken = await this.refresh(refreshToken);
                            return await this.requestLogin(
                                accessToken,
                                refreshToken
                            );
                        }

                        resolve(false);
                    } else {
                        // protected route has been accessed, response can be used.
                        // this.setState({
                        //     err: "Protected route accessed!"
                        // })
                        resolve(true);
                    }
                });
        });
    };
    handleChange = (name, value) => {
        var { user } = this.state
        user[name] = value
        this.setState({
            user: user
        })
        console.log(user);
    }

    handleSubmit = async (event) => {
        var { user } = this.state

        event.preventDefault();
        if (!user.email && !user.password) {
            alert("Field must not be empty")
        }
        else {
            axios.post("http://localhost:8000/login", { user }).then(data => {
                var { accessToken, refreshToken } = data.data;

                Cookies.set("access", accessToken);
                Cookies.set("refresh", refreshToken);

            });
        }



    };

    hasAccess = async (accessToken, refreshToken) => {
        if (!refreshToken) return null;

        if (accessToken === undefined) {
            // generate new accessToken
            accessToken = await this.refresh(refreshToken);
            return accessToken;
        }

        return accessToken;
    };
    protect = async (event) => {

        var accessToken = Cookies.get("access");
        var refreshToken = Cookies.get("refresh");
        event.preventDefault()
        accessToken = await this.hasAccess(accessToken, refreshToken);

        if (!accessToken) {
            this.setState({
                err: "First generate Acees and Refresh Token to get authorized"
            })
        } else {
            await this.requestLogin(accessToken, refreshToken);
            this.setState({
                loggedIn: true
            })
        }
    };
    render() {
        var { user, err, loggedIn } = this.state
        if (loggedIn) {
            return <Redirect to="/users" />

        }
        var txt = "Login User"
        return (

            <div style={{ border: "1px solid black", width: "10%", margin: "auto", padding: "10px", marginTop: "20px" }}>

                <h1>{txt}</h1>
                <p style={{ color: "red" }}>{err}</p>
                <form >
                    <input name="email" type="email" placeholder="Email address" value={user.email} onChange={(e) => this.handleChange(e.target.name, e.target.value)} />
                    <br />
                    <br />

                    <input name="password" type="password" placeholder="Password" value={user.password} onChange={(e) => this.handleChange(e.target.name, e.target.value)} />
                    <br />
                    <br />
                    <input type="submit" onClick={this.protect} value="Login" />

                </form>

                <button style={{ marginTop: "10px" }} onClick={this.handleSubmit}>Generate Access and Refresh Token</button>

            </div>
        )
    }
}


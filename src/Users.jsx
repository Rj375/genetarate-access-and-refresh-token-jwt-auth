import React, { Component } from 'react'
import { Redirect } from 'react-router'


export default class Users extends Component {
    constructor(){
        super()
        this.state = {
            loggedIn: true
        }
    }
    logOut = () => {
        this.setState({
            loggedIn: false
        })
    }
    render() {
        var {loggedIn} =this.state
        if(!loggedIn) {
            return <Redirect to="/"/>
        }
        return (
            <div>
               <h1>Iam user</h1>
               <button onClick={this.logOut}>Log out</button>
            </div>
        )
    }
}

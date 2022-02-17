import React from 'react';
import Login from './login';
import ListPosts from './list-posts';
import ListMessages from './list-messages';
import Admin from './admin';
import About from './about';
import Signup from './signup';
import Navbar from './navbar';

export default class TheGodFather extends React.Component {
    constructor(props) {
        super(props);
        this.state = JSON.parse(window.localStorage.getItem('state')) || {
            login: true,
            signup: false,
            admin: false,
            about: false,
            listMessages: false,
            listPosts: false,
            navbar: false

        };

        this.loginToSignup = this.loginToSignup.bind(this);
        this.toLogin = this.toLogin.bind(this);
        this.toMessages = this.toMessages.bind(this);
        this.toHomepage = this.toHomepage.bind(this);
        this.toAbout = this.toAbout.bind(this);
        this.toAdmin = this.toAdmin.bind(this);
    }

    setState(state) {
        window.localStorage.setItem('state', JSON.stringify(state));
        super.setState(state);
    }

    loginToSignup() {
        let new_state = { ...this.state };
        new_state.login = false;
        new_state.signup = true;
        this.setState(new_state);
    }
    
    toLogin() {
        let new_state = { ...this.state };
        new_state.login = true;
        new_state.signup = false;
        new_state.listPosts = false;
        new_state.about = false;
        new_state.admin = false;
        new_state.listMessages = false;
        new_state.navbar = false;
        this.setState(new_state);
    }
    
    toMessages() {
        let new_state = { ...this.state };
        new_state.listPosts = false;
        new_state.about = false;
        new_state.admin = false;
        new_state.listMessages = true;
        new_state.navbar = true;
        this.setState(new_state);
    }
    
    toHomepage() {
        let new_state = { ...this.state };
        new_state.listPosts = true;
        new_state.signup = false;
        new_state.login = false;
        new_state.about = false;
        new_state.admin = false;
        new_state.listMessages = false;
        new_state.navbar = true;
        this.setState(new_state);
    }
    
    toAbout() {
        let new_state = { ...this.state };
        new_state.listPosts = false;
        new_state.about = true;
        new_state.admin = false;
        new_state.listMessages = false;
        new_state.navbar = true;
        this.setState(new_state);
    }

    toAdmin() {
        let new_state = { ...this.state };
        new_state.listPosts = false;
        new_state.about = false;
        new_state.admin = true;
        new_state.listMessages = false;
        new_state.navbar = true;
        this.setState(new_state);
    }


     render() {
         return <div className='theGodFather'>
             {console.log(this.state)}
            {this.state.login ? <Login  loginToSignup={this.loginToSignup} toHomepage={this.toHomepage} ></Login>: null}
            {this.state.signup ? <Signup toLogin={this.toLogin}></Signup>: null}
            {this.state.navbar ? <Navbar toHomepage={this.toHomepage} toMessages={this.toMessages} toAbout={this.toAbout} toAdmin={this.toAdmin} logout={this.toLogin} ></Navbar>: null}
            {this.state.admin ? <Admin toAdmin={this.toAdmin}></Admin>: null}
            {this.state.about ? <About></About>: null}
            {this.state.listPosts ? <ListPosts toMessages={this.toMessages}></ListPosts>: null}
            {this.state.listMessages ? <ListMessages toHomepage={this.toHomepage}></ListMessages> : null}
            

        </div>
    }
}
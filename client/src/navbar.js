import React from 'react';

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: ""
        }

        this.handle_click_logout = this.handle_click_logout.bind( this );
    };

    setIsAdmin() {
        let isAdminCookie = document.cookie.split("isAdmin=")[1];
        let isAdmin = isAdminCookie.split(";")[0];
        return isAdmin === 'true';
	}

    handle_click_logout() {
        window.localStorage.removeItem('messages_length');
        window.localStorage.removeItem('posts_length');
        window.localStorage.removeItem('state');
        document.cookie = `token=;`;
        document.cookie = `isAdmin=;`;
        this.props.logout();
    }


    render() {
        this.state.isAdmin = this.setIsAdmin();
        return <div className='marginTop marginLeft'>
                <button id="homepage" onClick={this.props.toHomepage}>homepage</button>
                <button id="messages" onClick={this.props.toMessages}>messages</button>
                <button id="about" onClick={this.props.toAbout}>about</button>
                <button hidden={!this.state.isAdmin} id="admin" onClick={this.props.toAdmin}>admin</button>
                <button id="logout" onClick={this.handle_click_logout}>logout</button>
            </div>

    }
}

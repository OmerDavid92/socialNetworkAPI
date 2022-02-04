import React from 'react';

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: true
        }

        this.handle_click_logout = this.handle_click_logout.bind( this );
    };

    setIsAdmin() {
        let temp = document.cookie.split(';');
        return temp[1];
	}

    handle_click_logout() {
        document.cookie = "";
        this.props.logout();
    }


    render() {
        this.setIsAdmin();
        if (!this.state.isAdmin) {
            return <div className='navbar'>
                <button id="homepage" onClick={this.props.toHomepage}>homepage</button>
                <button id="messages" onClick={this.props.toMessages}>messages</button>
                <button id="about" onClick={this.props.toAbout}>about</button>
                <button id="logout" onClick={this.handle_click_logout}>logout</button>
            </div>
        }
        return <div className='navbar'>
                <button id="homepage" onClick={this.props.toHomepage}>homepage</button>
                <button id="messages" onClick={this.props.toMessages}>messages</button>
                <button id="about" onClick={this.props.toAbout}>about</button>
                <button id="admin" onClick={this.props.toAdmin}>admin</button>
                <button id="logout" onClick={this.handle_click_logout}>logout</button>
            </div>

    }
}

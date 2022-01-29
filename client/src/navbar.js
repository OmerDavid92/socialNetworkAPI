import React from 'react';

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: this.setIsAdmin()
        }
    };

    setIsAdmin() {
        let temp = document.cookie.split(';');
        return temp[1];
	}

    handle_click_homepage() {
        

    }


    render() {
        return <div className='navbar'>
            <button id="homepage" onClick={this.props.toHomepage}>homepage</button>
            <button id="messages" onClick={this.props.toMessages}>messages</button> 
            <button id="about" onClick={this.props.toAbout}>about</button>
        </div>
    }
}

import React from 'react';

export default class Login extends React.Component 
{
	constructor(props) {
        super(props);
        this.state = {
            email: '',
            pass: ''
        };

		this.handle_click = this.handle_click.bind( this );
		this.handle_change = this.handle_change.bind( this );
	}

    
    handle_change(event) {
        let new_state = { email: this.state.email,pass: this.state.pass };
        
        if (event.target.id === "email") {
            new_state.email = event.target.value;
        } else if (event.target.id === "password") {
            new_state.pass = event.target.value;
        }
        this.setState(new_state);
    }

  
  
  async fetch_messages(token) {
    let res = await fetch("http://localhost:2718/api/getMessages", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
    });
    if (res.status !== 200) throw new Error("Error while fetching messages");
    res = await res.json();
    window.localStorage.setItem('messages_length', JSON.stringify(res.g_messages.length));
  }
  

	async handle_click() {
    let data = { email: this.state.email, password: this.state.pass };
		let res = await fetch("http://localhost:2718/api/login", {
            method: 'POST', 
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    if (res.status != 200) throw new Error('Error while login');
    res = await res.json();
    if (res.token) {
      this.fetch_messages(res.token);
      document.cookie = `token=${res.token};`;
      document.cookie = `isAdmin=${res.isAdmin};`;
      this.props.toHomepage();
    };
	}

	render() {
        return (
          <div className="login">
            <div>Email: </div>
            <input
              id="email"
              type="text"
              value={this.state.email}
              onChange={this.handle_change}
            />
            <div>Password: </div>
            <input
              id="password"
              type="password"
              value={this.state.pass}
              onChange={this.handle_change}
            />
            <button id="signin" onClick={this.handle_click}>
              sign in
            </button>
            <button id="signup" onClick={this.props.loginToSignup}>
              sign up
            </button>
          </div>
        );
	}
}


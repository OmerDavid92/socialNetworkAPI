import React from 'react';

export default class Login extends React.Component 
{
	constructor(props) {
        super(props);
    this.state = {
            err: '',
            email: '',
            pass: ''
        };

		this.handle_click = this.handle_click.bind( this );
		this.handle_change = this.handle_change.bind( this );
	}

    
    handle_change(event) {
      let new_state = { err: this.state.err, email: this.state.email, pass: this.state.pass };
        
        if (event.target.id === "email") {
            new_state.email = event.target.value;
        } else if (event.target.id === "password") {
            new_state.pass = event.target.value;
        }
        this.setState(new_state);
    }
  

	async handle_click() {
    let data = { email: this.state.email, password: this.state.pass };
		let res = await fetch("http://localhost:5000/api/login", {
            method: 'POST', 
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    if (res.status != 200) throw new Error('Error while login');
    res = await res.json();
    if (res.token) {
      document.cookie = `token=${res.token};`;
      document.cookie = `isAdmin=${res.isAdmin};`;
      this.props.toHomepage();
    }
    else {
      let new_state = { err: res.err, email: this.state.email, pass: this.state.pass };
      this.setState(new_state);
    }
	}

	render() {
        return (
          <div className="login marginLeft">
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
             <p style={{color:"red"}}>{this.state.err}</p>
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


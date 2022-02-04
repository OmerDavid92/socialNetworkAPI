import React from 'react';

export default class Signup extends React.Component 
{
	constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            pass: ''
        };

		this.handle_click = this.handle_click.bind( this );
		this.handle_change = this.handle_change.bind( this );
	}

    
    handle_change(event) {
        let new_state = { name: this.state.name, email: this.state.email, pass: this.state.pass };
        
        if (event.target.id === "name") {
            new_state.name = event.target.value;
        } else if (event.target.id === "email") {
            new_state.email = event.target.value;
        } else if (event.target.id === "password") {
            new_state.pass = event.target.value;
        }
        this.setState(new_state);
    }


	async handle_click() {
        let data = { name: this.state.name, email: this.state.email, password: this.state.pass };
        console.log({state: this.state})
		let res = await fetch("http://localhost:2718/api/users", {
            method: 'POST', 
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (res.status != 200) throw new Error('Error while signup');
        this.props.toLogin();
	}

	render() {
        return <div className='signup'>
                    <div>Name: </div> 
                    <input id="name" type="text" value={this.state.name} onChange={this.handle_change} />
                    <div>Email: </div> 
                    <input id="email" type="text" value={this.state.email} onChange={this.handle_change} />
                    <div>Password: </div> 
                    <input id="password" type="password" value={this.state.pass} onChange={this.handle_change}/>
                    <button id="signup" onClick={this.handle_click}>sign up</button>
				</div>
	}
}
import React from 'react';
import User from './user';

export default class Admin extends React.Component 
{
constructor(props) {
        super(props);
        this.state = {
            g_users: [{
                id: '',
                name: '',
                email: '',
                creationDate: '',
                status: ''
            }]
    };
    	this.handle_click_approve = this.handle_click_approve.bind( this );
    }

    
    getToken() {
        let temp = document.cookie.split(';');
        return temp[0];
    }

    async componentDidMount() {
		const users = await this.fetch_users();
		this.setState({ g_users: users.g_users });
    }
    
    async handle_click_approve() {
        let res = await fetch("http://localhost:2718/api/users" , {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer "+ this.getToken()
            },
        });
        if (res.status !== 200) throw new Error('Error while fetching messages');
        return res = await res.json();
    }
    

	render() {
        return <div className='admin'>
            {
                this.state.g_users.map((item, index) => {
                    return <User key={index} id={item.id} name={item.name} email={item.email} creationDate={item.creation_date} status={item.status} ></User>
                    })
                }  
				</div>
	}
}
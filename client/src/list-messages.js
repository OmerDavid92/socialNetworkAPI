import React from 'react';
import Message from './message';

export default class ListMessages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages_array: [{
                send_from: 'Razi',
                send_to: 'ShXXXd',
                creation_date: '20/01/96',
                text: 'dsdadadas'
            }]
        };
    }

    async componentDidMount() {
		const messages = await this.fetch_messages();
		this.setState({ messages_array: messages.messages_array });
    }
    
    async fetch_messages() {
		let res = await fetch("http://localhost:2718/api/messages", {
            method: 'GET', 
            headers: {
            'Content-Type': 'application/json'
            },
        });
        if (res.status != 200) throw new Error('Error while fetching messages');
        return res = await res.json();
	}

    render() {
        return <div className='list-massages'>
                {
                    this.state.messages_array.map((item, index) => {
                        return <Message key={index} sendFrom={item.send_from} sendTo={item.send_to} creationDate={item.creation_date} text={item.text}></Message>
                    })
                }
				</div>
	}   
}
import React from 'react';

export default class User extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        if (this.props.status === "created") {
            return <div className='user'>
                <div>
                    <div>ID:</div>
                    <div>{this.props.id}</div>
                </div>
                <div>
                    <div>Name:</div>
                    <div>{this.props.name}</div>
                </div>
                <div>
                    <div>Email:</div>
                    <div>{this.props.email}</div>
                </div>
                <div>
                    <div>User creation Date</div>
                    <div>{this.props.creationDate}</div>
                </div>
            </div>
        }      
	}
}
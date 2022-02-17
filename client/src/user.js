import React from 'react';

export default class User extends React.Component {
    constructor(props) {
        super(props);
    }



    render() {
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
                    <div>{this.props.creation_date}</div>
                </div>
                <div>
                    <div>User Status</div>
                    <div>{this.props.status}</div>
                </div>
            </div>
        }      
}
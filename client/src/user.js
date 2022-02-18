import React from 'react';

export default class User extends React.Component {
    constructor(props) {
        super(props);
    }



    render() {
            return <div className='marginTop'>
                <div className='marginLeft'>
                    <div>ID: {this.props.id}</div>
                </div>
                <div className='marginLeft'>
                    <div>Name: {this.props.name}</div>
                </div>
                <div className='marginLeft'>
                    <div>Email: {this.props.email}</div>
                </div>
                <div className='marginLeft'>
                    <div>User creation Date: {this.props.creation_date}</div>
                </div>
                <div className='marginLeft'>
                    <div>User Status: {this.props.status}</div>
                </div>
            </div>
        }      
}
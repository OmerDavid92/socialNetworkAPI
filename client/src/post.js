import React from 'react';

export default class Post extends React.Component {
    constructor(props) {
        super(props);
    }


	render() {
        return <div className='post'>
                    <div>
                        <div>Post editor:</div>
                        <div>{this.props.name}</div>
                    </div>
                    <div>
                        <div>Post creation Date</div>
                        <div>{this.props.creationDate}</div>   
                    </div>
                    <p> {this.props.text} </p> 
				</div>
	}
}
import React from 'react';

export default class Post extends React.Component {
    constructor(props) {
        super(props);
    }


	render() {
        return <div className='item'>
                    <div className='marginLeft'>
                        <div>Post editor: {this.props.name}</div>
                    </div>
                    <div className='marginLeft'>
                        <div>Post creation Date: {this.props.creationDate}</div>
                    </div>
                    <div className='marginLeft'>
                        <div>Post:</div>
                        <p> {this.props.text} </p>
                    </div> 
				</div>
	}
}
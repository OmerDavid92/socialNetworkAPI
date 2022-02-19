import React from 'react';

export default class Messages extends React.Component {
    constructor(props) {
        super(props);
    }


	render() {
        return <div className='item'>
                    <div className='marginLeft'>
                        <div>Message sender: {this.props.sendFrom}</div>
                    </div>
                    <div className='marginLeft'>
                        <div>Message receiver: {this.props.sendTo}</div>
                    </div>
                    <div className='marginLeft'>
                        <div>Message creation Date: {this.props.creationDate}</div>
                    </div>
                    <div className='marginLeft'>
                        <div>Message:</div>
                        <p> {this.props.text} </p> 
                    </div>
				</div>
	}
}
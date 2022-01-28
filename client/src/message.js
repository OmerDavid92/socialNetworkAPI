import React from 'react';

export default class Messages extends React.Component {
    constructor(props) {
        super(props);
    }


	render() {
        return <div className='message'>
                    <div>
                        <div>Message sender:</div>
                        <div>{this.props.sendFrom}</div>
                    </div>
                    <div>
                        <div>Message receiver:</div>
                        <div>{this.props.sendTo}</div>
                    </div>
                    <div>
                        <div>Message creation Date</div>
                        <div>{this.props.creationDate}</div>   
                    </div>
                    <p> {this.props.text} </p> 
				</div>
	}
}
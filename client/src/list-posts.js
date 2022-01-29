import React from 'react';
import Post from './post';

export default class ListPosts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            g_posts: [{
                creator_id: 'Razi',
                creation_date: '30/10/96',
                text: 'I was just born'
            }]
        };
    }

    async componentDidMount() {
		const posts = await this.fetch_posts();
		this.setState({ g_posts: posts.g_posts });
    }
    
    getToken() {
        let temp = document.cookie.split(';');
        return temp[0];
    }

    async fetch_posts() {
		let res = await fetch("http://localhost:2718/api/posts", {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer "+ this.getToken()
            },
        });
        if (res.status != 200) throw new Error('Error while fetching posts');
        return res = await res.json();
	}

    render() {
        return <div className='lists-posts'>
                {
                    this.state.g_posts.map((item, index) => {
                        return <Post key={index} name={item.creator_id} creationDate={item.creation_date} text={item.text}></Post>
                    })
                }
				</div>
	}   
}
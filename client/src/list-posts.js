import { REQUEST_HEADER_FIELDS_TOO_LARGE } from 'http-status-codes';
import React from 'react';
import Post from './post';

export default class ListPosts extends React.Component {
    constructor(props) {
        super(props);
        this.interval='';
        this.state = {
            post: "",
            updatedMsg: true,
            updatedPost: true,
            g_posts: [
                {
                    creator_id: "Razi",
                    creation_date: "30/10/96",
                    text: "I was just born",
                },
            ],
        };
        this.displayMsgButton = this.displayMsgButton.bind(this);
        this.displayPostButton = this.displayPostButton.bind(this);
        this.onClickRefreshPost = this.onClickRefreshPost.bind(this);
        this.handle_change = this.handle_change.bind(this);
        this.handle_click = this.handle_click.bind(this);
    }

    async componentDidMount() {
        const posts = await this.fetch_posts();
        window.localStorage.setItem('posts_length', JSON.stringify(posts.g_posts.length));
        if (!window.localStorage.getItem('messages_length')) {
            const messages = await this.fetch_messages();
            window.localStorage.setItem('messages_length', JSON.stringify(messages.g_messages.length));
        }
        this.setState({ g_posts: posts.g_posts });
        this.interval = setInterval(() => {
            this.displayPostButton();
            this.displayMsgButton()
        }, 30000);
    }

    async displayMsgButton() {
        if (this.state.updatedMsg) {
            let prevNumOfMsg = window.localStorage.getItem('messages_length');
            const messages = await this.fetch_messages();
            let new_state = { ...this.state };
            if (parseInt(prevNumOfMsg) !== messages.g_messages.length) {
                new_state.updatedMsg = false;
                this.setState(new_state);
            }
        }
    }

    async displayPostButton() {
        if (this.state.updatedPost) {
            let prevNumOfPosts = this.state.g_posts.length;
            const posts = await this.fetch_posts();
            let new_state = { ...this.state };
            if (prevNumOfPosts !== posts.g_posts.length) {
                new_state.updatedPost = false;
                this.setState(new_state);
            }
        }
    }

    async onClickRefreshPost() {
        const posts = await this.fetch_posts();
        window.localStorage.setItem('posts_length', JSON.stringify(posts.g_posts.length));
        this.setState({ post: this.state.post,updatedMsg: this.state.updatedMsg, updatedPost: true, g_posts: posts.g_posts});
    }
    

    getToken() {
        let tokenCookie = document.cookie.split("token=")[1];
        return tokenCookie.split(";")[0];
    }

    async fetch_messages() {
        let res = await fetch("http://localhost:2718/api/getMessages", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.getToken()
            },
        });
        if (res.status !== 200) throw new Error("Error while fetching messages");
        return (res = await res.json());
    }

    async fetch_posts() {
        let res = await fetch("http://localhost:2718/api/posts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.getToken(),
            },
        });
        if (res.status != 200) throw new Error("Error while fetching posts");
        return (res = await res.json());
    }

    handle_change(event) {
        let new_state = {
            post: this.state.post,
            updatedMsg: this.state.updatedMsg,
            updatedPost: this.state.updatedPost,
            g_posts: this.state.g_posts,
        };

        if (event.target.id === "post") {
            new_state.post = event.target.value;
        }
        this.setState(new_state);
    }

    async handle_click() {
        let data = {
            text: this.state.post
        };
        let res = await fetch("http://localhost:2718/api/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.getToken()
            },
            body: JSON.stringify(data),
        });
        if (res.status != 200) throw new Error("Error while login");
        res = await res.json();
        this.setState({ post: "", updatedMsg: this.state.updatedMsg, updatedPost: this.state.updatedPost, g_posts: this.state.g_posts});
    }

    async timeStampSort(firstEl, secondEl) {
        const d1 = new Date(firstEl.creation_date);
        const d2 = new Date(secondEl.creation_date);
        return d1.getTime() - d2.getTime();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
          <div className="lists-posts">
            <div>Write Post: </div>
            <textarea
              id="post"
              type="text"
              onChange={this.handle_change}
              value={this.state.post}
            />
            <p></p>
            <button id="sendPost" onClick={this.handle_click}>
              Post
            </button>
            <button
              id="refreshPosts"
              hidden={this.state.updatedPost}
              onClick={this.onClickRefreshPost}
            >
              New Post!
                </button>
                <button
              id="refreshMsg"
              hidden={this.state.updatedMsg}
              onClick={this.props.toMessages}
            >
              New Message!
            </button>
            {this.state.g_posts.sort(this.timeStampSort).map((item, index) => {
              return (
                <Post
                  key={index}
                  name={item.creator_id}
                  creationDate={item.creation_date}
                  text={item.text}
                ></Post>
              );
            })}
          </div>
        );
    }
}
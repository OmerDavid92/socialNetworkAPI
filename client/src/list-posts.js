import { REQUEST_HEADER_FIELDS_TOO_LARGE } from 'http-status-codes';
import React from 'react';
import Post from './post';

export default class ListPosts extends React.Component {
    constructor(props) {
        super(props);
        this.interval = '';
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

    getDisplayedTime(ts) {
        if (!ts.getTime()) return 'No Date';

        let hour = ts.getHours() < 10 ? `0${ts.getHours()}` : ts.getHours();
        let min = ts.getMinutes() < 10 ? `0${ts.getMinutes()}` : ts.getMinutes();
        let sec = ts.getSeconds() < 10 ? `0${ts.getSeconds()}` : ts.getSeconds();

        return `${ts.getDate()}/${(ts.getMonth() + 1)}/${ts.getFullYear()} ${hour}:${min}:${sec}`;
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
        }, 5000);
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
        this.setState({ post: this.state.post, updatedMsg: this.state.updatedMsg, updatedPost: true, g_posts: posts.g_posts });
    }


    getToken() {
        let tokenCookie = document.cookie.split("token=")[1];
        return tokenCookie.split(";")[0];
    }

    async fetch_messages() {
        let res = await fetch("http://localhost:5000/api/getMessages", {
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
        let res = await fetch("http://localhost:5000/api/posts", {
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
        let res = await fetch("http://localhost:5000/api/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.getToken()
            },
            body: JSON.stringify(data),
        });
        if (res.status != 200) throw new Error("Error while login");
        res = await res.json();
        let posts = await this.fetch_posts();
        window.localStorage.setItem('posts_length', JSON.stringify(posts.g_posts.length));
        this.setState({ post: "", updatedMsg: this.state.updatedMsg, updatedPost: this.state.updatedPost, g_posts: posts.g_posts });
    }

    timeStampSort(firstEl, secondEl) {
        const d1 = new Date(firstEl.creation_date);
        const d2 = new Date(secondEl.creation_date);
        return d2.getTime() - d1.getTime();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div className="lists-posts marginLeft marginTop">
                <div className="marginLeft marginTop">Write Post: </div>
                <div><textarea
                    className="marginLeft"
                    id="post"
                    type="text"
                    onChange={this.handle_change}
                    value={this.state.post}
                /></div>
                <div><button className="marginLeft marginBottom" id="sendPost" onClick={this.handle_click}>
                    Post
                </button></div>
                <button className="marginLeft marginBottom"
                    id="refreshPosts"
                    hidden={this.state.updatedPost}
                    onClick={this.onClickRefreshPost}
                >
                    New Post!
                </button>
                <button className="marginLeft marginBottom"
                    id="refreshMsg"
                    hidden={this.state.updatedMsg}
                    onClick={this.props.toMessages}
                >
                    New Message!
                </button>
                {this.state.g_posts.sort(this.timeStampSort).slice(0, 10).map((item, index) => {
                    return (
                        <Post
                            key={index}
                            name={item.creator_id}
                            creationDate={this.getDisplayedTime(new Date(item.creation_date))}
                            text={item.text}
                        ></Post>
                    );
                })}
            </div>
        );
    }
}
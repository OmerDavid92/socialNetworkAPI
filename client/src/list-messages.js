import React from 'react';
import Message from './message';

export default class ListMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updatedMsg: true,
      updatedPost: true,
      g_messages: [
        {
          send_from: "Razi",
          send_to: "ShXXXd",
          creation_date: "20/01/96",
          text: "dsdadadas",
        },
      ],
    };

    this.displayMsgButton = this.displayMsgButton.bind(this);
    this.displayPostButton = this.displayPostButton.bind(this);
    this.onClickRefreshMsg = this.onClickRefreshMsg.bind(this);
  }

  getToken() {
    let tokenCookie = document.cookie.split("token=")[1];
    return tokenCookie.split(";")[0];
  }

  async componentDidMount() {
    const messages = await this.fetch_messages();
    window.localStorage.setItem('messages_length', JSON.stringify(messages.g_messages.length));
    this.setState({ g_messages: messages.g_messages });
    if (!window.localStorage.getItem('posts_length')) {
      const posts = await this.fetch_posts();
      window.localStorage.setItem('posts_length', JSON.stringify(posts.g_posts.length));
    }
    this.setState({ g_messages: messages.g_messages });
    this.interval = setInterval(() => {
      this.displayPostButton();
      this.displayMsgButton()
    }, 5000);
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

  async displayPostButton() {
    if (this.state.updatedPost) {
      let prevNumOfPost = window.localStorage.getItem('post_length');
      const posts = await this.fetch_posts();
      let new_state = { ...this.state };
      if (parseInt(prevNumOfPost) !== posts.g_posts.length) {
        new_state.updatedPost = false;
        this.setState(new_state);
      }
    }
  }

  async displayMsgButton() {
    if (this.state.updatedMsg) {
      let prevNumOfMsg = this.state.g_messages.length;
      const messages = await this.fetch_messages();
      let new_state = { ...this.state };
      if (prevNumOfMsg !== messages.g_messages.length) {
        new_state.updatedMsg = false;
        this.setState(new_state);
      }
    }
  }

  async onClickRefreshMsg() {
    const messages = await this.fetch_messages();
    window.localStorage.setItem('messages_length', JSON.stringify(messages.g_messages.length));
    this.setState({ updatedPost: this.state.updatedPost, updatedMsg: true, g_messages: messages.g_messages });
  }

  async timeStampSort(firstEl, secondEl) {
    return secondEl.creation_date - firstEl.creation_date;
  }


  render() {
    return (
      <div className="list-massages">
         <button
              id="refreshPosts"
              hidden={this.state.updatedPost}
              onClick={this.props.toHomepage}
            >
              New Post!
                </button>
                <button
              id="refreshMsg"
              hidden={this.state.updatedMsg}
              onClick={this.onClickRefreshMsg}
            >
              New Message!
            </button>
        {this.state.g_messages.sort(this.timeStampSort).map((item, index) => {
          return (
            <div key={index}>
              <Message
                sendFrom={item.send_from}
                sendTo={item.send_to}
                creationDate={item.creation_date}
                text={item.text}
              ></Message>
            </div>
          );
        })}
      </div>
    );
  }
}
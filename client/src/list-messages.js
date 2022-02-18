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

    this.displayPostButton();
    this.displayMsgButton = this.displayMsgButton.bind(this);
    this.displayPostButton = this.displayPostButton.bind(this);
    this.onClickRefreshMsg = this.onClickRefreshMsg.bind(this);
  }

  getDisplayedTime(ts) {
    if (!ts.getTime()) return 'No Date';

    let hour = ts.getHours() < 10 ? `0${ts.getHours()}` : ts.getHours();
    let min = ts.getMinutes() < 10 ? `0${ts.getMinutes()}` : ts.getMinutes();
    let sec = ts.getSeconds() < 10 ? `0${ts.getSeconds()}` : ts.getSeconds();

    return `${ts.getDate()}/${(ts.getMonth() + 1)}/${ts.getFullYear()} ${hour}:${min}:${sec}`;
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
      this.displayMsgButton();
    }, 5000);
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

  async displayPostButton() {
    if (this.state.updatedPost) {
      let prevNumOfPost = window.localStorage.getItem('posts_length');
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
      <div className="list-massages marginLeft">
        <button className="marginLeft marginBottom marginTop"
          id="refreshPosts"
          hidden={this.state.updatedPost}
          onClick={this.props.toHomepage}
        >
          New Post!
        </button>
        <button className="marginLeft marginBottom marginTop"
          id="refreshMsg"
          hidden={this.state.updatedMsg}
          onClick={this.onClickRefreshMsg}
        >
          New Message!
        </button>
        {this.state.g_messages.sort(this.timeStampSort).slice(0, 10).map((item, index) => {
          return (
            <div key={index}>
              <Message
                sendFrom={item.send_from}
                sendTo={item.send_to}
                creationDate={this.getDisplayedTime(new Date(item.creation_date))}
                text={item.text}
              ></Message>
            </div>
          );
        })}
      </div>
    );
  }
}
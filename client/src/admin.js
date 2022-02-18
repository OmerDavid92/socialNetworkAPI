import React from 'react';
import User from './user';

export default class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      g_users: [
        {
          id: "",
          name: "",
          email: "",
          creation_date: "",
          status: "",
        },
      ],
    };
    this.handle_click_approve = this.handle_click_approve.bind(this);
    this.handle_click_delete = this.handle_click_delete.bind(this);
    this.handle_click_suspend = this.handle_click_suspend.bind(this);
    this.handle_click_restore = this.handle_click_restore.bind(this);
    this.handle_change = this.handle_change.bind(this);
    this.handle_click = this.handle_click.bind(this);
  }

  getToken() {
    let tokenCookie = document.cookie.split("token=")[1];
    return tokenCookie.split(";")[0];
  }

  async componentDidMount() {
    const users = await this.fetch_users();
    this.setState({ g_users: users.g_users });
    console.log(this.state.g_users);
  }

  async fetch_users() {
    let res = await fetch("http://localhost:5000/admin/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.getToken(),
      },
    });
    if (res.status !== 200) throw new Error("Error while fetching users");
    return (res = await res.json());
  }

  updateStatus(res) {
    let new_state = this.state.g_users.map(user => {
      if (user.id === res.id) user.status = res.status;
      return user;
    });
    this.setState(new_state);
  }

  async handle_click_approve(id) {
    console.log(id);
    let res = await fetch("http://localhost:5000/admin/approve/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.getToken(),
      },
    });
    if (res.status != 200) throw new Error("Error while approving");
    res = await res.json();
    this.updateStatus(res);
  }

  async handle_click_delete(id) {
    console.log(id);
    let res = await fetch("http://localhost:5000/admin/delete/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.getToken(),
      },
    });
    if (res.status != 200) throw new Error("Error while deleting");
    res = await res.json();
    this.updateStatus(res);
  }

  async handle_click_suspend(id) {
    console.log(id);
    let res = await fetch("http://localhost:5000/admin/suspend/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.getToken(),
      },
    });
    if (res.status != 200) throw new Error("Error while suspending");
    res = await res.json();
    this.updateStatus(res);
  }

  async handle_click_restore(id) {
    console.log(id);
    let res = await fetch("http://localhost:5000/admin/restore/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.getToken(),
      },
    });
    if (res.status != 200) throw new Error("Error while restoring");
    res = await res.json();
    this.updateStatus(res);
  }

  handle_change(event) {
    let new_state = {
      message: this.state.post,
      g_users: this.state.g_users
    };

    if (event.target.id === "message") {
      new_state.message = event.target.value;
    }
    this.setState(new_state);
  }

  async handle_click() {
    let data = {
      text: this.state.message
    };
    let res = await fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.getToken()
      },
      body: JSON.stringify(data),
    });
    if (res.status != 200) throw new Error("Error while sending");
    res = await res.json();
    this.setState({ message: "", g_users: this.state.g_users });
  }

  render() {
    return (
      <div>
        <div className='marginLeft marginTop'>Write Message to all users: </div>
        <div><textarea className='marginLeft marginTop'
              id="message"
              type="text"
              onChange={this.handle_change}
              value={this.state.message}
          /></div>
        <div> <button className='marginLeft marginBottom' id="sendMsg" onClick={this.handle_click}>
              Send Message
        </button></div>
        {this.state.g_users.map((item, index) => {
          return (
            <div className='item' key={index}>
              <User
                id={item.id}
                name={item.name}
                email={item.email}
                creation_date={item.creation_date}
                status={item.status}
              ></User>
              <button className='marginLeft marginTop marginBottom2'
                disabled={item.status !== "created"}
                id="approve"
                onClick={() => this.handle_click_approve(item.id)}
              >
                Approve
              </button>
              <button className='marginLeft marginTop marginBottom2'
                disabled={item.status === "deleted"}
                id="delete"
                onClick={() => this.handle_click_delete(item.id)}
              >Delete
              </button>
              <button className='marginLeft marginTop marginBottom2'
                disabled={item.status !== "active"}
                id="suspend"
                onClick={() => this.handle_click_suspend(item.id)}
              >Suspend
              </button>
              <button className='marginLeft marginTop marginBottom2'
                disabled={
                  item.status !== "suspended"
                }
                id="restore"
                onClick={() => this.handle_click_restore(item.id)}
              >Restore
              </button>
            </div>
          );
        })}
      </div>
    );
  }
}
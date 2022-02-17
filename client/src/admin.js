import React from 'react';
import User from './user';

export default class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    let res = await fetch("http://localhost:2718/admin/users", {
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
    let res = await fetch("http://localhost:2718/admin/approve/" + id, {
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
    let res = await fetch("http://localhost:2718/admin/delete/" + id, {
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
    let res = await fetch("http://localhost:2718/admin/suspend/" + id, {
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
    let res = await fetch("http://localhost:2718/admin/restore/" + id, {
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

  render() {
    return (
      <div className="admin">
        {this.state.g_users.map((item, index) => {
          return (
            <div key={index}>
              <User
                id={item.id}
                name={item.name}
                email={item.email}
                creation_date={item.creation_date}
                status={item.status}
              ></User>
              <button
                disabled={item.status !== "created"}
                id="approve"
                onClick={() => this.handle_click_approve(item.id)}
              >
                Approve
              </button>
              <button
                disabled={item.status === "deleted"}
                id="delete"
                onClick={() => this.handle_click_delete(item.id)}
              >Delete
              </button>
              <button
                disabled={item.status !== "active"}
                id="suspend"
                onClick={() => this.handle_click_suspend(item.id)}
              >Suspend
              </button>
              <button
                disabled={
                  item.status !== "suspended"
                }
                id="restore"
                onClick={() => this.handle_click_restore(item.id)}
              >Restore
              </button>
              <p></p>
            </div>
          );
        })}
      </div>
    );
  }
}
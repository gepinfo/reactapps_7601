import React from "react";
import "./manageusers.scss";
import { GpGetAllRoles, GpGetAllUsers, GpUpdateUsers } from './manageuser.service';

export class Manageusers extends React.Component {

  // userslist: any;
  // rolelist: any;
  user: any;
  roles: any;
  selectedoption: any;
  role_id: any;

  state ={userslist:{data:[]},rolelist:{data:[]}}

  componentDidMount() {
    this.getUsers();
    this.getRoles();
  }

  getUsers() {
    GpGetAllUsers().then((usersList) => {
      // this.userslist = userslist;
      this.setState({userslist:usersList})
      console.log("userslist---->", this.state.userslist);
    }, (error) => {
      console.log('Error--->>>>>', error);
    });
  }

  getRoles() {
    GpGetAllRoles().then((roleList) => {
      // this.rolelist = rolelist;
      this.setState({rolelist:roleList})
      console.log("List===>", this.state.rolelist)
    }, (error) => {
      console.log('Error--->>>>>', error);
    });
  }

  save(user: any) {
    console.log("USER",user);
    let selected_role = user.role.role;
    console.log("selected", selected_role)
    this.state.rolelist.data.map((element: any) => {
      if (element.role == selected_role) {
        console.log("elemnt.role", element.role)
        this.role_id = element._id
        const tempObj = {
          id: user._id,
          role: {
            role: user.role.role,
            _id: this.role_id
          },
          email: user.email,
          username: user.username
        };

        console.log("obj", tempObj)
        GpUpdateUsers(tempObj).then((response) => {
        }, (error) => {
          console.log('error--save>>>>>', error)
        })
      }
    });
  }

  render() {
    return (
      <>
        <div>
          <h1>Manage Users</h1>
        </div>

        <div style={{ padding: "10px" }}>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.userslist.data.map((key: any) => {
                return (
                  <tr>
                    <td>{key.email}</td>
                    <td><select>   {this.state.rolelist.data.map((roles: any) => {
                      return (
                        <option>{roles.role}</option>
                      )
                    })}</select>
                    </td>
                    <td>
                      <button>save</button>
                    </td>
                  </tr>
                )
                }
               ) }

            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default Manageusers; 
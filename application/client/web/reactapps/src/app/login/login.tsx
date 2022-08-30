import React, { useEffect, useState } from "react";
import "./login.scss";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import logo from '../../assets/img/Group2704.png';
import { Consent, login } from "./login.services";
import { useHistory } from "react-router-dom";

const Login = (props:any) => {
  let id :any;
  let userDetails:any;
  let openId: String = 'openid';
  let permission: any[] = [];
  const [formData, setFormData] = useState({
    email: '',
    password: ''
});

const { email, password } = formData;
const history = useHistory();    

const onChange = (e:any) => setFormData({ ...formData, [e.target.name]: e.target.value });

const onSubmit = async (e:any) => {
  e.preventDefault();
  const data = JSON.stringify(formData);
  login(data).then((logindatas:any) => {
    sessionStorage.setItem('Name', logindatas.data.Userdetails.firstname+" "+logindatas.data.Userdetails.lastname);
    // if(logindatas.data.Userdetails.avatar !== null){
      
    //   sessionStorage.setItem('Image', logindatas.data.Userdetails.avatar);
    //       }else {
      let name = logindatas.data.Userdetails.firstname
      let image = `../../assets/profile/${name.length}.png`;
      sessionStorage.setItem('Image', image);
    // }
    let tokenError = logindatas.error;
    if (userDetails === 'Incorrect Username or Password') {
     let errorMessage = userDetails;
    } else {
      if (tokenError !== undefined) {
        if (tokenError.name === 'TokenExpiredError') {
          consent();
        }
      }
       else {

         id = logindatas.data.Userdetails._id;           
        sessionStorage.setItem('Id', logindatas.data.Userdetails._id);
        sessionStorage.setItem('lastLoggedInTime', logindatas.data.Userdetails.loggedinDate);
        sessionStorage.setItem('email', logindatas.data.Userdetails.email);
        sessionStorage.setItem('JwtToken',logindatas.data.Userdetails.Idtoken);
        if (logindatas.data.Userdetails.Idtoken === null || logindatas.data.Userdetails.Idtoken === '') {
           consent();          
        }
         else {
          window.location.href = "/sefscreen"
        }

      }
      //  (error:any) => {
      //   console.error('error---------->>>>>', error);
      // }
    }
  });
};



const consent=()=>{
  const temp = {
    submit: 'Allow access',
    scope: openId,
    id:id,}
  // const temp = 1;
   Consent(temp).then((consentValue:any)=>{
    if (consentValue.data.Access !== undefined) {
     let  accessLevel = consentValue.data.Access[0];
     permission.push(accessLevel)
    // broadcast.sendMessage({ 'Access':permission });
    sessionStorage.setItem('Access', JSON.stringify (permission))
    }
    userDetails = consentValue.data.Userdetails;
   let id = userDetails._id;
   let lastLoggedInTime = userDetails.loggedinDate;
    //  history.push({ pathname: "/sefscreen" })
     window.location.href="/sefscreen"
    sessionStorage.setItem('Id', id);
    sessionStorage.setItem('lastLoggedInTime', lastLoggedInTime);
    sessionStorage.setItem('email', userDetails.email);
    sessionStorage.setItem('JwtToken', userDetails.Idtoken);
   
   })
   
  }
  return (
    <div className="background-images">
    <div className="container left_align">
      <div className="row">
        <div className="col-lg-4"></div>
        <div className="col-lg-4">
          <div className="main">
            <div className="geppetto-img">
              <img src={logo}/>
            </div>
              <div className="login-Wrappe text-left ">
                <h3 className="login-title">Please login</h3>
                <div className="text-align-left">
                  <Form onSubmit={(e:any) => onSubmit(e)}>
                    <FormGroup>
                      <Label className="login-label" for="exampleEmail">
                        Email
                      </Label>
                      <Input
                        className="login-input"
                        type="text"
                        name="email"
                        value={email}
                        id="exampleEmail"
                        placeholder="Email"
                        onChange={(e:any) => onChange(e)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="login-label" for="examplePassword">
                        Password
                      </Label>
                      <Input
                        className="login-input"
                        type="password"
                        name="password"
                        value={password}
                        id="examplePassword"
                        placeholder="password"
                        onChange={(e:any) => onChange(e)}
                      />
                    </FormGroup>
                    <div className="text-center mb-3">
                      <Button className="login-btn-width">Submit</Button>
                    </div>
                  </Form>
                </div>
                <span className="signup-text-color">Please Login or <span className="span-text-link" onClick={()=>props.history.push("/signup")}>Login</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;

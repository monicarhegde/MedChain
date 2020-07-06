import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {PostData} from '../../services/PostData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import './Login.css'
class Login extends Component {
constructor(){
super();
this.state = {
username: '',
password: '',
redirectToReferrer: false,
redirectToReferrerr: false,
redirectToReferrerz: false,
redirectToManage: false,
backToHome: false,
};
this.data = {};
this.login = this.login.bind(this);
this.onChange = this.onChange.bind(this);
}
login() {
if(this.state.username && this.state.password){
PostData('login',this.state).then((result) => {
let responseJson = result;
if(responseJson.userData){
let jsondata = JSON.stringify(responseJson.userData);
sessionStorage.setItem('userData',jsondata);
this.data = JSON.parse(sessionStorage.getItem('userData'));
if(this.data.username=="admin" && this.data.password=="admin")
	this.setState({redirectToReferrerr: true});
else if(this.data.id==-1 && this.data.username=="management" && this.data.password=="management")
this.setState({redirectToManage: true});
else if(this.data.id<999)
this.setState({redirectToReferrer: true});
else if(this.data.id>=1000)
this.setState({redirectToReferrerz: true});


}
else
alert(result.error);
});
}
else
	alert("Please enter username and password");
}
onChange(e){
this.setState({[e.target.name]:e.target.value});
}

render() {
if (this.state.redirectToReferrer) {
return (<Redirect to={'/doctordash'}/>)
}
else if(this.state.redirectToReferrerr) {
return (<Redirect to={'/admindash'}/>)
}
else if(this.state.redirectToReferrerz)
{
	return(<Redirect to={'/Patientdash'}/>)
}
else if(this.state.redirectToManage)
{
	return(<Redirect to={'/management'}/>)
}
else if(this.state.backToHome)
{
	return(<Redirect to={'/'}/>)
}


return (
	<div>
	<button class="backtohome" onClick={(event)=>{
		this.setState({backToHome: true})
	}}><FontAwesomeIcon icon={faHome} /> Home</button>
<div className="row" id="Body">
<div className="monica">

<h4>Login</h4>
<input type="text" name="username" placeholder="Username" onChange={this.onChange}/>
<input type="password" name="password" placeholder="Password" onChange={this.onChange}/>
<div class="btnstyle"><input type="submit" className="button" value="Login" onClick={this.login}/></div>
<p class="para">Not yet a member ? <a href="/signdoc">  Register</a></p>
</div>
</div>
</div>
);
}
}
export default Login;
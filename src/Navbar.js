import React,{ Component } from "react";
import {withRouter} from "react-router-dom";

import "./Navbar.css";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
  } from "react-router-dom";
import Profile from "./Profile";
import ReactSession from "react-client-session/dist/ReactSession";

export default class Navbar extends Component{

    constructor(props){
        super(props);
        this.state={
            id:ReactSession.get("id"),
            name:ReactSession.get("name"),
            username:ReactSession.get("username"),
            password:ReactSession.get("password"),
        }
    }
    handleLogout(e){
        e.preventDefault();
        console.log("pressed");
        this.setState({
            id:"",name:"",username:"",password:""
        })
        var {history}= this.props;
        history.push("/login");
    }
    render()
    {
        var {id,name,username}=this.state;
        console.log("USER IS ",ReactSession.get("name"));
        
        return(

            
                <div className="navbar-c">
                    <nav class="navbar navbar-expand-lg navbar-light  ">
                    <a class="navbar-brand" href="#">Instagram</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarText ">
                        <ul class="navbar-nav ">
                            <li class="nav-item active mx-auto">
                                <Link to="/addPost" class="input-group-text plus-button " id="basic-addon1"><i class="fas fa-plus mx-auto"></i></Link>
                            </li>
                        </ul>
                        <ul class="navbar-nav ">
                        
                        <li class="nav-item active">
                           
                            <Link to="/" className="nav-link"><i class="fas fa-home"></i></Link>
                        </li>
                       
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img class="nav-profile-img" src={ReactSession.get("profilepicture")}/>
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <Link class="dropdown-item nav-link" to={"/profile/"+id}>Profile</Link>
                                <div class="dropdown-divider"></div>
                                <button onClick={(e)=>{this.handleLogout(e)}} class="dropdown-item navbar-link logout-button">Log out({name})</button>
                            </div>
                        </li>

                        </ul>
                        
                    </div>
                    </nav>
                </div>
            
        );
    }

}

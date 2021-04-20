import { Component } from "react";
import axios from "axios";
import ReactSession from "react-client-session/dist/ReactSession";
export default class Register extends Component{
    constructor(props){
        super(props);
        this.state={
            name:"",
            username:"",
            password:"",
            active:"hidden"

        }
    }
    handleAlert(){
        console.log("ERROR");
        this.setState({active:"visible"})
    }
    handleSubmit(e){
        e.preventDefault();
        var {fullname,username,password}=e.target;
        var set={
            name:fullname.value,
            username:username.value,
            password:password.value,
            profilepicture:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        };
        this.setState(set);
        console.log(set);
        var obj=JSON.stringify(set);
        console.log(obj);
        axios.post("http://localhost:8091/api/Insta/v1/addUser",obj,{
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
        })
        .then(
            res=>{
                console.log(res);
               
                if(res.status===200)
                {
                    const {id,name,username,password}=res.data;
                    ReactSession.set("id",id);
                    ReactSession.set("name",name);
                    ReactSession.set("username",username);
                    ReactSession.set("password",password);
                    this.props.history.push("/")
                }
                else
                {
                    console.log("ERROR")
                    
                }
            }
            
        )
        .catch(e=>{
            console.log(e)
            this.handleAlert()
        });
        
    }
    render(){

        return(

            <div className="view">
                
                <div style={{visibility:this.state.active}} class=" login-alert alert alert-danger" role="alert">
                    This username already exists,please try another.
                    </div>
                <div className="login-c-c">
                    
                <div class="login-card card rounded-0">
                    <h5 class="login-c-h card-header">Instagram</h5>
                    <div class="login-c-b card-body">
                    <form onSubmit={(e)=>{this.handleSubmit(e)}} >
                        <div class="form-group">
                            <input name="fullname" type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter FullName"/>
                        </div>
                        <div class="form-group">
                            <input name="username" type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Username"/>
                        </div>
                        <div class="form-group">
                            <input  name="password" type="password" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Choose a Password"/>
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Confirm Password"/>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Sign up</button>
                    </form>
                    </div>
                    
                        <small class="text-muted"><hr></hr><span> OR </span></small>
                    <div className="login-c-t card-text">
                        Already have an account?<a class=" login-c-a "href="/login">Log in.</a>
                        
                    </div>
                    <div class="login-c-f card-footer">
                        <small class="text-muted"><span> &#169;</span>Instagram 2021</small>
                    </div>
                </div>
            </div>
            </div>
    )
    }
    
}

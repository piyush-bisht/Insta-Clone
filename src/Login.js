import react,{ Component } from "react";
import "./Login.css";
import axios from "axios";
import ReactSession from "react-client-session/dist/ReactSession";
export default class Login extends Component{
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
        var {username,password}=e.target;
        var set={
            
            username:username.value,
            password:password.value
        };
        this.setState(set);
        console.log(set);
        var obj=JSON.stringify(set);
        console.log(obj);
        axios.post("http://localhost:8091/api/Insta/v1/login",obj,{
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
                    const {id,name,username,password,profilepicture}=res.data;
                    
                    ReactSession.set("id",id);
                    ReactSession.set("name",name);
                    ReactSession.set("username",username);
                    ReactSession.set("password",password);
                    ReactSession.set("profilepicture",profilepicture);
                    console.log("SET ALL DATA");
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
            <div>
            <div className="container">
                <div style={{visibility:this.state.active}} class=" login-alert alert alert-danger" role="alert">
                    Invalid Username/Password,try again!
                    </div>

                <div className="login-c-c">
                    <div class="login-card card rounded-0">
                        <h5 class="login-c-h card-header">Instagram</h5>
                        <div class="login-c-b card-body">
                        <form onSubmit={(e)=>this.handleSubmit(e)}>
                            <div class="form-group">
                                <input name="username" type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username"/>
                            </div>
                            <div class="form-group">
                                <input name="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"/>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Submit</button>
                        </form>
                        </div>
                        
                            <small class="text-muted"><hr></hr><span> OR </span></small>
                        <div className="login-c-t card-text">
                            Don't have an account?<a class=" login-c-a "href="/register">Sign up.</a>
                            
                        </div>
                        <div class="login-c-f card-footer">
                            <small class="text-muted"><span> &#169;</span>Instagram 2021</small>
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="jumbotron jumbotron-fluid landing-j-1">
                <div class="container row">
                    <div class="col landing-j-1-col-1">
                    <h1 class="display-3 landing-j-1-t ">Express in Potraits</h1>
                    </div>
                    
                </div>
            </div>
            </div>
                    )
    }
    
}
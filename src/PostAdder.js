import React, { Component } from 'react'
import Navbar from "./Navbar";
import ReactSession from "react-client-session/dist/ReactSession";
import "./PostAdder.css";
import axios from 'axios';
import moment from 'moment';

export default class PostAdder extends Component{
    state={
        
            user:{
                id:"",
                name:"",
                username:"",
                password:""
            }
    }
    componentWillMount(){
        if(ReactSession.get("id")===""||ReactSession.get("id")===undefined)
        {
            console.log("NO SESSION FOUND IN PROFILE");
            this.props.history.push("/login");
        }
        else{
            console.log("SESSION FOUND IN PROFILE "+ReactSession.get("id"));
            var User={
                id:ReactSession.get("id"),
                name:ReactSession.get("name"),
                username:ReactSession.get("username"),
                password:ReactSession.get("password")
            }
            //console.log(User);
            this.setState({user:{
                id:User.id,
                name:User.name,
                username:User.username,
                password:User.password
            }});

            //console.log(this.state.user);
        }
    }
    
    render()
    {
        console.log(this.state.user);
        
        return(
            <div>
                <Navbar/>
                
                <InputForm user={this.state.user} history={this.props.history} />
            </div>
            
        )
        
    }
}


class InputForm extends Component {
    constructor(props)
    {
        
        super(props);
        
        var {user}=this.props;
        console.log(user);
        this.state={
            postSenderId:this.props.user.id,
            img:"Choose Image",
            postSender:this.props.user.username,
            caption:"",
            date:""
        }
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    
    handleSubmit(e)
    {
        
        e.preventDefault();
        if(this.state.img==="Choose Image" || this.state.caption==="")
        {
            $('#upload-popover').popover('show')
            setTimeout(() => {
                $('#upload-popover').popover('hide') 
            }, 1000);
        }
        else
        {
            var obj=JSON.stringify(this.state);
            console.log(obj);
            axios.post("http://localhost:8091/api/Insta/v1/addPost",obj,{
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
                        console.log("POST ADDED SUCCESSFULLY");
                        this.props.history.push({pathname:"/",data:"Sucessfully Posted"});
                    }
                    else
                    {
                        console.log("ERROR")
                        
                    }
                }
                
            )
            .catch(e=>{
                console.log(e)
                
            });
            
        }
    }
        loadProgressBar(){
        console.log("FIRED PGBAR");
        document.getElementById("pg-bar").classList.add("prog-anim");
    }
    loadImage(e)
    {
        //document.getElementById("")
        this.loadProgressBar();
        var reader=new FileReader();
        var dataURL;
        reader.onload=()=>{
            var output=document.getElementById("op");
             dataURL=reader.result;
            output.src=dataURL;
            //console.log(dataURL);
            this.setState({img:dataURL});
            this.setState({date:moment().format()});
            console.log(this.state);
        }

        reader.readAsDataURL(e.target.files[0]);
        
    }
    render() {
        
        return (
            <div className="container ip-c">
            <form>
            <div class="jumbotron ip-j">
                <h1 class="display-4">Hello, there</h1>
                <p class="lead">Add to show the world your marvels</p>
                <hr class="my-4"/>
                <div class="progress" >
                    <div className="progress-bar" id="pg-bar" role="progressbar"  aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <div class="custom-file ip-1">
                    <input placeholder="upload an image" type="file" class="custom-file-input form-control-file" id="inputGroupFile01 exampleFormControlFile1" accept="image/*" onChange={(e)=>{this.loadImage(e)}}/>
                    <label class="custom-file-label " id="i-label" for="inputGroupFile01" >{this.state.upload}
                    
                    </label>
                </div>
                <div class="input-group ip-2">
                    
                    <textarea id="caption" placeholder="add a caption" class="form-control" aria-label="With textarea" onChange={(e)=>{this.setState({caption:e.target.value});console.log(this.state)}}></textarea>
                    <img id="op" src="https://st4.depositphotos.com/17828278/24401/v/600/depositphotos_244011872-stock-illustration-image-vector-symbol-missing-available.jpg"/>
                </div>
                <p class="lead upload">
                    <button id="upload-popover" data-content="Please fill all fields" class="btn btn-primary btn-lg"  role="button" onClick={this.handleSubmit}>Upload</button>
                </p>
                
            </div>
            </form>
            </div>
        )
    }
}

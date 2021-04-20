import react,{ Component } from "react";
import Navbar from "./Navbar";
import "./HomePage.css";
import ReactSession from "react-client-session/dist/ReactSession";
import Spinner from "./Spinner";
import axios from "axios";
import moment from 'moment';
import Popup from "./PopUpPost";
import Alert from "./Alert";
import UserList from "./UserList";
export default class HomePage extends Component{

    constructor(props){

        super(props);
        var id=ReactSession.get("id");
        var name=ReactSession.get("name");
        var username=ReactSession.get("username");
        var password=ReactSession.get("password");
        var profilepicture=ReactSession.get("profilepicture");
        this.state={
            loading:true,
            user:{
                id,name,username,password,profilepicture
            },
            posts:[],
            activePost:"",
            activeComments:[],
            alertMessage:this.props.location.data, 
        }
    }

    async componentDidMount(){

        if(ReactSession.get("id")==""||ReactSession.get("id")==undefined)
            this.props.history.push("/login");
        else
        {
            console.log("SESSION LOGGED IN "+ReactSession.get("id"));
        }
        
            var url="http://localhost:8091/api/Insta/v1";
            await axios.get(url,{
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                  },
            })
            .then(
                res=>{
                    console.log("HOME PAGE POSTS"+res);
                    if(res.status===200)
                    {
                    
                       console.log(res.data);
                       var posts=res.data;
                       this.setState({loading:false,
                                        posts
                                        });
    
                                    }
                        
                    
                }
            )
            .catch(e=>{
                console.log(e)
    
            });
    }
   
    async setActiveComponentHandler(post){
        //console.log(post);
        //REQUESTING COMMENTS
        var url="http://localhost:8091/api/Insta/v1/comment/"+post.postId;
        await axios.get(url,{
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
                
                   console.log(res.data);
                   var comments=res.data;
                   this.setState({
                            activeComments:comments
                    });

                }
                
            }
        )
        .catch(e=>{
            console.log(e)

        });
        this.setState({
            activePost:post
        })

        

        
    }
    handleCommentSubmit(post,comment)
    {
        console.log(this.state);
        var id=ReactSession.get("id");
        var username=ReactSession.get("username");
        var data={
            sender:username,
            senderId:id,
            postId:post.postId,
            text:comment

        }
        var obj=JSON.stringify(data);
        axios.post("http://localhost:8091/api/Insta/v1/addComment",obj,{
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
                    console.log("COMMENT ADDED SUCCESSFULLY");
                    this.props.history.push("/");
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

    handleUpdatePost(post)
    {
        console.log(post.likes);
        var obj=JSON.stringify(post);
        var url="http://localhost:8091/api/Insta/v1/post/"+post.postId;
        axios.post(url,obj,{
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
                    console.log("Likes ADDED SUCCESSFULLY");
                    
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
    render()
    {
        var {posts,user}=this.state;
        if(this.state.loading===true)

        return <Spinner/>
        else        
        return <div>
        <Navbar user={user} history={this.props.history}/>
        <Alert alertMessage={this.state.alertMessage}/>
        <div className="home-container container">
            <div className="row">
                <div className="col-8">
                { posts.map((post,index)=>(

                    <FeedComponent key={index} post={post} comments={this.state.activeComments} setActiveComponent={()=>{this.setActiveComponentHandler(post)}} sendComment={this.handleCommentSubmit} updatePost={this.handleUpdatePost}/>
                ))}
                <Popup activePost={this.state.activePost} activeComments={this.state.activeComments} sendComment={this.handleCommentSubmit} />         
                </div>
                <div className="col-4 user-list">
                
                    <UserList user={this.state.user}/>
                </div>
            </div>
        </div>
        </div>
    }
}


class FeedComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            liked:0,
            classN:["far fa-heart","fas fa-heart"],
            activePost:"",
            comment:"",
            likes:this.props.post.likes,
            postComments:[],
            postSender:{}
        }
    }
   
    async componentDidMount(){
        var url="http://localhost:8091/api/Insta/v1/comment/"+this.props.post.postId;
        await axios.get(url,{
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
                
                   console.log(res.data);
                   var comments=res.data;
                   this.loadSender();
                   this.setState({
                            postComments:comments
                    });

                }
                
            }
        )
        .catch(e=>{
            console.log(e)

        });
    }

    async loadSender(){
        console.log(this.props.post);
        var url="http://localhost:8091/api/Insta/v1/showUser/"+this.props.post.postSenderId;
        await axios.get(url,{
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
                
                   console.log(res.data);
                   var user=res.data;
                   this.loadSender();
                   this.setState({
                           postSender:user 
                    });

                }
                
            }
        )
        .catch(e=>{
            console.log(e)

        });

    }
    appearlike(e){
        console.log(e.target.parentElement.childNodes[1]);
        e.target.parentElement.childNodes[1].classList.add("feed-img-like-appear");
        setTimeout(()=>{e.target.parentElement.childNodes[1].classList.remove("feed-img-like-appear");},500)
        
        
    }
    handleLike(e){

        e.preventDefault();
        console.log("liked");
        var newState=this.state.liked==0?1:0;
        var modify=newState==1?1:-1
        this.setState({liked:newState,classN:this.state.classN,likes:this.props.post.likes+modify});
        this.props.post.likes=this.props.post.likes+modify    ;
        this.props.updatePost(this.props.post);

    }
    handleCommentType(e)
    {
        e.preventDefault();
        if(e.target.value!=="")
        {
            document.getElementById("postcommentbutton").removeAttribute("disabled");
        }
        else
        {
            document.getElementById("postcommentbutton").setAttribute("disabled",true);
        }
        this.setState({comment:e.target.value});
        
    }
    handleCommentSubmit(e)
    {
        if(this.state.comment!=="")
            this.props.sendComment(this.props.post,this.state.comment)
        this.setState({comment:""});
        
        
    }
    
    render()
    {
        var {postId,senderId,postSender,caption,img,date}=this.props.post;
        var {liked,classN,likes}=this.state;
        var {postComments}=this.state;
        
        return(
        <div>
            <div class="card homepage-card">
                <div class="card-header">
                <img class="feed-postSender-img" src={this.state.postSender.profilepicture}/>
                <span class="feed-postSender-name">{postSender}</span>
                </div>
                <div class="feed-img-container">
                    <img class="card-img-top feed-img" alt="Card image cap" src={img} onDoubleClick={(e)=>{this.appearlike(e);this.handleLike(e)}} alt="Card image cap"/>
                    <i class="fas fa-heart feed-img-like "></i>
                </div>
                <h5 class="card-header">
            
                <a href="#"><i  id="like-button" className={classN[liked]} onClick={(e)=>{this.handleLike(e)}}></i></a>
                <a href="#"><i class="far fa-comment"></i></a>
                </h5>
                <div class="card-body hp-card">
                
                    <p class="card-text text-c">{likes} Likes</p>
                </div>
                <div class="card-body hp-card">
                
                    <p class="card-text text-c"><span id="username"><b>{postSender}</b></span> <span>{caption}</span></p>
                    <p class="card-text time-c"><small class="text-muted">{moment(date).fromNow()}</small></p>
            
                </div>
                <a href="#" onClick={()=>{this.props.setActiveComponent()}} data-toggle="modal" data-target="#exampleModalCenter" class="text-muted comments-link">View all {postComments.length} comments</a>
                <div class="card-body hp-card">
                {   
                        postComments.length>2 && postComments.reverse().slice(0,2).map(comment=>(
                            <p class="card-text comment-text"><span id="username"><b>{comment.sender}</b></span> <span>{comment.text}</span></p>
                        ))
                }
                </div>
                <div class="input-group input-group-sm mb-3 comment-ip">
                
                <input type="text"  data-target="#exampleModalCenter" value={this.state.comment} onChange={(e)=>{this.handleCommentType(e)}} placeholder="Add a comment" class="form-control comment-ip-text" aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
                <button id="postcommentbutton"  aria-label="Small" aria-describedby="inputGroup-sizing-sm" onClick={(e)=>{this.handleCommentSubmit(e)}}>Post</button>
                <hr/>
                </div>
                </div>
        
            </div>
                )
    }
}
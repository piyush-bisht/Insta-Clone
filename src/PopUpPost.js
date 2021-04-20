import react,{ Component } from "react";
import moment from 'moment';  
import axios from "axios";
import "./popuppost.css"
import ReactSession from "react-client-session/dist/ReactSession";
export default class Popup extends Component{
    constructor(props)
    {
        
        super(props);
        this.state={
            loading:true,
            comments:this.props.activeComments,
            comment:""
        }
        
    }
    async deletePost(e,post)
    {
        e.preventDefault();
        var obj=JSON.stringify({postId:post.postId});
        var url="http://localhost:8091/api/Insta/v1/post/delete";
        await axios.post(url,obj,{
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
                   var curr=this.props.history.location.pathname;
                   console.log(curr);
                   document.getElementById("#exampleModalCenter").modal('toggle');
                   this.props.history.push({pathname:"/",data:"Sucessfully Deleted Post"});

                }
                
            }
        )
        .catch(e=>{
            console.log(e)

        });
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
    sendComment(post,comment)
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
                    this.setState({
                        comments:[...this.state.comments,comment]
                    })
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
    handleCommentSubmit(e)
    {
        if(this.state.comment!=="")
            this.sendComment(this.props.activePost,this.state.comment)
        
        this.setState({comment:""});
        
        
    }
    
    render()
    {
        
        console.log("THIS MODAL IS FIRED");
        console.log(this.props.activePost);
        console.log(this.props.activeComments);
        
        var {postId,caption,img,likes,postSender,postSenderId,date}=this.props.activePost;
        return(

            <div class="modal fade " id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="row">
                    <div class=" img-popup">
                        <img  class="img-pop" src={img}/>
                    </div>
                    <div class=" popup-text">
                        <ul class="list-group list-group-flush ">
                            
                            <li class="list-group-item subtext"><i class="fas fa-thumbs-up"></i>Liked by {likes} others  
                                {postSenderId===ReactSession.get("id") &&
                                <span class="options">
                                    <div class="dropleft">
                                        <a href="#" data-toggle="dropdown"><i  class="fas fa-ellipsis-v"></i></a>
                                            <div class="dropdown-menu" aria-labelledby="dLabel">
                                            <a class="dropdown-item" onClick={(e)=>(this.deletePost(e,this.props.activePost))} href="#">Delete Post</a>
                                            </div>
                                        </div>
                                </span>
                                }
                            </li>
                            <li class="list-group-item subtext feedposter"><b>@{postSender}</b>  {caption}</li>
                        </ul>
                        <ul class="list-group list-comments list-group-flush">
                        <li class="list-group-item subtext card-text"><small class="text-muted">{moment(date).fromNow()}</small></li>
                        <li class="list-group-item comments"><hr></hr></li>
                      
                        {
                        this.props.activeComments.map((comment,id)=>(

                        <Comments comment={comment}/>

                        ))}
                        
                        </ul>
                        <div class="input-group input-group-sm mb-3 comment-ip">
                            <input type="text"  data-target="#exampleModalCenter" value={this.state.comment} onChange={(e)=>{this.handleCommentType(e)}} placeholder="Add a comment" class="form-control comment-ip-text" aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
                            <button id="postcommentbutton"  aria-label="Small" aria-describedby="inputGroup-sizing-sm" onClick={(e)=>{this.handleCommentSubmit(e)}}>Post</button>
                            <hr/>
                        </div>
                    </div>      
                </div>
                </div>
            </div>
            </div>

        )
        
    }
}

class Comments extends Component{
    render()
    {
        return(
            <li class="list-group-item comments"><p className="card-text comments"><b>{this.props.comment.sender}</b> {this.props.comment.text}</p></li>
        )               
    }
}
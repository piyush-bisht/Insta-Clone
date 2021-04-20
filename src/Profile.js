import react,{ Component } from "react";
import Navbar from "./Navbar";
import "./Profile.css";
import ReactSession from "react-client-session/dist/ReactSession";
import axios from "axios";
import Loader from 'react-loader-spinner'
import Spinner from "./Spinner";  
import moment from 'moment';  
import Popup from "./PopUpPost";
import Alert from "./Alert";
export default class Profile extends Component
{
    constructor(props)
    {
        super(props);
  
        this.state={
            loading:true,
            user:{
                id:"",
                name:"",
                username:"",
                password:"",
                profilepicture:""
            },
            posts:[],
            alertMessage:this.props.location.data
            
        }
        this.profilePictureUpdate=this.profilePictureUpdate.bind(this);
        console.log("USER IS PROFILE",this.state.user);
    }
    async componentDidMount(){
        if(ReactSession.get("id")==""||ReactSession.get("id")==undefined)
        {
            console.log("NO SESSION FOUND IN PROFILE");
            this.props.history.push("/login");
        }
        else{
            console.log("SESSION FOUND IN PROFILE "+ReactSession.get("id"));

        }

        var url="http://localhost:8091/api/Insta/v1/showUser/"+this.props.match.params.id;
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
                   var  id=res.data.id;
                   var name=res.data.name;
                   var username=res.data.username;
                   var password=res.data.password;
                   var profilepicture=res.data.profilepicture;
                   console.log("SET ALL DATA "+id+name+username+password);
                   this.setState({loading:false,
                                    user:{
                                        id,name,username,password,profilepicture
                                    }
                                    
                                    });
                    
                    this.requestPosts();
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

    
    async requestPosts(){
        var url="http://localhost:8091/api/Insta/v1/post/"+this.state.user.id;
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
    async profilePictureUpdate(img,user){
        // console.log(img);
        console.log(user);
        var data={id:user.id,username:user.username,password:user.password,profilepicture:img}
        var obj=JSON.stringify(data);
        var url="http://localhost:8091/api/Insta/v1/profile/addProfilePicture/"+user.id;
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
                   ReactSession.set("profilepicture",img);
                   this.setState({user:{...this.state.user,profilepicture:img}});
                }
            }
        )
        .catch(e=>{
            console.log(e)
        });
        
    }
    render()
    {

        if(this.state.loading===false)
        return(

            <div >
                <Navbar history={this.props.history} user={this.state.user}/>
                <Alert alertMessage={this.state.alertMessage}/>
                <ProfileInfo user={this.state.user} posts={this.state.posts} profilePictureUpdate={this.profilePictureUpdate}/>
                <Posts history={this.props.history} user={this.state.user} posts={this.state.posts} loading={this.state.loading}/>
            </div>
        )
        else
        return <Spinner/>

    }
}

class ProfileInfo extends Component{

    
    
    render()
    {
        console.log("INSIDE PROF: "+this.props.posts.length);
        var {name,username,profilepicture}=this.props.user;
        console.log(this.props.user);
        return(
            <div className="container">
            <div class="jumbotron jumbotron-fluid">
                <div class="media">
                    <img data-toggle="modal" data-target="#ProfilePictureModal" class="mr-3 dp" src={profilepicture} alt="Generic placeholder image"/>
                    {
                        ReactSession.get("id")==this.props.user.id &&
                        <ProfilePictureEdit user={this.props.user} profilePictureUpdate={this.props.profilePictureUpdate}/>}
                    <div class="media-body">
                        <h3 class="mt-0">{username}</h3>
                        <span><b>{this.props.posts.length}</b> Posts <b>125</b> Followers <b>131</b> Following</span>
                        <div className="name"><b>{name}</b></div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

class ProfilePictureEdit extends Component{
    handleprofilePictureUpdate(e){
        e.preventDefault();
        var img=document.querySelector(".profile-picture-input");
        img.click();
        
        
            
    }
    handleProfilePictureChange(e)
    {
        console.log("IMAGE"+e.target.files[0]);
        var reader=new FileReader();
        var dataURL;
        reader.onload=()=>{
            dataURL=reader.result;
            console.log("NOW");
            $('#ProfilePictureModal').modal('toggle');
            this.props.profilePictureUpdate(dataURL,this.props.user);
            
        }
        reader.readAsDataURL(e.target.files[0]);
    }
    handleProfilePictureDelete(e)
    {
        $('#ProfilePictureModal').modal('toggle');
        this.props.profilePictureUpdate("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",this.props.user);
    }
    render()
    {
        return(
            <div class="modal fade" id="ProfilePictureModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content profile-picture-modal-content">
                    <div class="modal-header mx-auto">
                        <h5 class="modal-title" id="exampleModalLongTitle">Change Profile Picture</h5>  
                    </div>
                        <div class="list-group">
                        <input type="file" class="profile-picture-input" accept="image/*" onChange={(e)=>(this.handleProfilePictureChange(e))}/>
                        <a href="#" onClick={(e)=>(this.handleprofilePictureUpdate(e))} class="list-group-item list-group-item-action ">
                            Change Profile Picture
                        </a>
                        <a href="#" onClick={(e)=>{this.handleProfilePictureDelete(e)}} class="list-group-item list-group-item-action">Remove Profile Picture</a>
                        <a href="#" data-dismiss="modal" class="list-group-item list-group-item-action">Cancel</a>
                        
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
class Posts extends Component{
    
    constructor(props){
        
        super(props);
        
        this.state={
            loading:this.props.loading,
            posts:this.props.posts,
            active:{},
            activeComments:[],
            mLoading:true
        }
        console.log("NO OF POSTS INSIDE "+this.props.posts.length);
        this.handleClick=this.handleClick.bind(this);
        
    }

    
    
    
    async handleClick(e,key)
    {
        
        var {posts}=this.props;
        var post=posts[key];

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
        console.log(posts[key]);
        await this.setState({
            ...this.state.loading,
            ...this.state.posts,
            active:this.props.posts[key],
            mLoading:false
        })
        console.log("PRESSED POST: "+this.state.active.postId);
    }
    
    
    render()
    {
        var {posts}=this.props;
        console.log("STATE POSTS "+posts.length);
        var len=posts.length;
        var i=0;
        
        if(this.state.loading===true)

        return <Spinner/>        
        else{
            console.log('NOT LOADING ANYMORE');
            return(

                <div className="prof-c container"> 
                {
                    [...posts.keys()].map((pIndex)=>{   
                                return(
                                     
                                        <div key={pIndex} data-toggle="modal" data-target="#exampleModalCenter"class="col-prof rounded-0 card" onClick={(e)=>{this.handleClick(e,pIndex)}}>
                                            <img class="card-img-top prof-img rounded-0" src={posts[pIndex].img} alt="Card image cap"/>  
                                        </div>
                                )
                    })
                }
                <Popup history={this.props.history}  activePost={this.state.active} activeComments={this.state.activeComments} isLoading={this.state.mLoading}/>
                </div>  
                )
        } 
    }
}


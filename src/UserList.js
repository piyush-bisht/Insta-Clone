import React, { Component } from 'react'
import Spinner from './Spinner';
import axios from 'axios';
import "./UserList.css";
import { Link } from 'react-router-dom';
export default class UserList extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            loading:true,
            user:this.props.user,
            users:[]
        }
    }
    async componentDidMount()
    {
        var url="http://localhost:8091/api/Insta/v1/showAllUsers";
        await axios.get(url,{
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
        })
        .then(
            res=>{
                if(res.status===200)
                {
                   console.log(res.data);
                   var users=res.data;
                   this.setState({
                        loading:false,
                        users
                    });

                }
                
            }
        )
        .catch(e=>{
            console.log(e)

        });
    }
    render() {
        var{loading,users}=this.state;
        console.log(users.filter(user=>user.id!=this.state.user.id));
        if(loading===true)
        return <Spinner/>
        else return (
            <div className="list-holder">
                <div>
                <p class="card-title list-title">
                 People you may know
                </p>
                
                </div>
                
            {
                
                users.filter(user=>user.id!=this.state.user.id).map(user=>(
                    <div class="card user-card">
                        <div class="card-body">
                            <div className="row">
                                <div className="col">
                                    <Link to={"/profile/"+user.id} class="card-link"><p class="card-title user-card-title">{user.name}</p></Link>
                                    <p class="card-subtitle mb-2 text-muted user-card-subs">Followed by 122 others</p>
                                </div>
                                <div className="col">    
                                    <a href="#" class="card-link user-card-follow-link">Follow</a>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                ))
            }
            </div>
        )
    }
}

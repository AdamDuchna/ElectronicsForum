import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {Link} from "react-router-dom";
import { useEffect } from "react";
import { getUsers,deleteUser,editUser } from "../../ducks/users/operations";
import { getPosts } from "../../ducks/posts/operations";
import { getPostsList } from "../../ducks/posts/selectors";
import { getUsersList } from "../../ducks/users/selectors";
import "../../styling/profiles/UserProfile.css"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from "react";
const UserProfile = ({user,posts,getUsers,getPosts,login,deleteUser,editUser}) => {
    const history = useHistory()
    const [calls,setCalls] = useState(0)
    const [editing,setEditing] = useState(false)
    const [name,setName] = useState(undefined)
    const [surname,setSurname] = useState(undefined)
    useEffect(() => {
        if(calls<2){
        if(posts.length === 0){getPosts()}
        if(!user){getUsers()}
        setCalls(calls+1)
        }
    },[posts,user,getPosts,getUsers,calls])

    const handleBan = (id)=>{
        history.push("/")
        deleteUser(id)
    }
    const handleSetRole = (role)=>{
        const newRole = {...user,"role":role}
        editUser(newRole)
    }
    const handleEditUser = ()=>{
        setEditing(false)
        const toSend={...user,"firstName":name,"lastName":surname}
        editUser(toSend)
    }
    const handleCheck=()=>{
        setName(user.firstName)
        setSurname(user.lastName)
        setEditing(true)
    }

    return (
        <div className="user-profile">
            { user ?
                <div className="user-data">
                    <div>
                        { !editing ?<div>Name: {user.firstName}</div> : <div>Name:<input value={name} 
                        onChange={e=>setName(e.target.value)}></input></div>}
                        { !editing ?<div>Surname: {user.lastName}</div> : <div>Surname:<input value={surname}
                        onChange={e=>setSurname(e.target.value)}></input></div>}
                        <div>Login: {user.login}</div>
                        <div>Role: {user.role}</div>
                        <div>Member since: {new Date(user.registrationDate).toLocaleDateString()}</div>
                    </div>
                    <div className="panels">
                    {login.role === "admin" && user._id !== login._id? 
                    <div className="admin-panel">
                        { user.role === "admin" ? <div onClick={()=>handleSetRole("user")}><i class="fa fa-level-down"></i></div> : 
                        <div onClick={()=>handleSetRole("admin")}><i class="fa fa-level-up"></i></div>}
                        <div onClick={()=>handleBan(user._id)}><i className="fa fa-ban"></i></div>
                    </div> : <></>
                    }
                    {user._id === login._id? 
                    <div className="user-panel">
                        <div onClick={()=>{handleCheck()}}>
                        <i className="fa fa-pencil"></i></div>
                        {editing ? <div onClick={()=>handleEditUser()}><i className="fa fa-check"></i></div> : <></> }
                    </div> : <></>
                    }
                    </div>
                </div>
             : <></>}
        <div className="post-list">
            <div className="posts">Posts</div>
            {posts && posts.map(post => (<div className="post" key={post._id}><Link to={`/posts/${post._id}`} 
            style={{ textDecoration: 'none', color: "black" }}>
            <div>{post.title}</div>
            <div>{new Date(post.creationDate).toLocaleString()}</div></Link></div>))}
        </div>
        </div>
    )
};
const mapStateToProps = (state,ownProps) => {
    return {
        user: getUsersList(state).find(user => user._id === ownProps.match.params.id),
        posts: getPostsList(state).filter(post => post.author === ownProps.match.params.id),
        login: state.login
    };
}

const mapDispatchToProps = {
    getUsers,
    getPosts,
    deleteUser,
    editUser
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfile));
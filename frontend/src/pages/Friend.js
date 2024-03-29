import { useEffect, useState } from 'react'
import Footer from './components/footer'
import NMHeader from './components/nonMediaHeader'
import { Box, List, ListItem, Paper, AvatarGroup, Avatar, CircularProgress } from '@mui/material'
import { padding } from '@mui/system'
import { userMetadata } from '../APIInterface/GetUserData'
import { useParams } from 'react-router-dom'
import { getFriendInfo } from '../APIInterface/Friendships'

const User = () => {
    let {userID} = useParams();
    const [friendInfo, setFriendInfo] = useState(null);
    const [friendLists, setFriendLists] = useState(null);
    const [userInfo,setUserInfo] = useState(null)
    const [userLists, setUserLists] = useState([])

    useEffect(()=>{
        const setup = async() =>{
            await userMetadata().then(res=> {
                setUserInfo(res);
                let holdList=[];
                res.groups.map(groups =>  groups.lists.map(list => holdList=([...holdList, list])))
                setUserLists(holdList.slice(0,5));
            });
            await getFriendInfo(userID).then(res => {
                setFriendInfo(res);
                let holdList=[];
                res.groups.map((groups,groupIdx) =>  groups.lists.map(list => holdList=([
                    ...holdList, 
                    {
                        ...list, 
                        groupName:groups.groupName, 
                        groupID:groups.groupID, 
                        groupIdx:groupIdx
                    }
                ])))
                setFriendLists(holdList.slice(0,5));
            });
        }
        setup()
    },[])

    return ( 
        friendInfo ?
        <>
            <div style = {{paddingBottom: '80px',}}>    
                <NMHeader />
                <div style={{ margin: '0% 5% 5%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        {friendInfo.ProfileImageID !== null ? 
                        <img
                            alt='user profile'
                            style={{ maxWidth: '100px', borderRadius: '50%' }}
                            src={`/profileImages/${friendInfo.ProfileImageID}.jpg`}
                        />
                        :
                        <img style={{maxWidth:'100px', borderRadius:'50%'}} alt='user profile holder' src={`https://eu.ui-avatars.com/api/?name=${friendInfo.username}&size=250&length=1&background=bdbdbd&color=fff`}/>
                        }
                        <p>Date Joined: {friendInfo.Date_joined.split('T')[0]}</p>
                    </div>

                    <div style={{ width: '100%', margin: '1% 5%', maxWidth: '227px' }}>
                        <h2>{friendInfo.username}</h2>
                        <div
                            style={{
                                backgroundColor: 'rgb(217, 217, 217, 0.25)',
                                textAlign: 'start',
                                height: '150px',
                                width: '227px',
                                padding: '1% 3%',
                            }}
                        >
                            <p
                                style={{
                                    fontSize: 'large',
                                    fontFamily: 'sans-serif',
                                }}
                            >{friendInfo.Bio}</p>
                        </div>
                    </div>
                </div>
                <hr />
                <div style={{margin: '0 5%',}}>
                    <h1 style={{textAlign:'center' }}>Lists</h1>
                    <Box style = {{ margin: 'auto', padding}}>
                        <List>
                            {friendLists.length === 0 ? (
                                <p style={{ textAlign: 'center'}}> No lists yet</p>
                            ) : (
                                
                                <Box style={{ margin: 'auto'}}>
                                    <List>
                                        {friendLists.map((list,index) => 
                                            <ListItem key={index}>
                                                <Paper
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        width: '300px',
                                                        padding: '4%',
                                                        margin: 'auto',
                                                        borderRadius: '25px',
                                                    }}
                                                    elevation={3}
                                                >
                                                    <p style={{margin:'auto'}}>{list.listName}</p>
                                                    <AvatarGroup max={2}>
                                                        {list.listMembers.map((member, index) => (
                                                            <Avatar
                                                                key={index}
                                                                alt={member.username.toUpperCase()}
                                                                src={`/profileImages/${member.profileID}.jpg`}
                                                            />
                                                        ))}
                                                    </AvatarGroup>
                                                </Paper>
                                            </ListItem> 
                                        )}
                                    </List>
                                </Box>
                            )}
                        </List>
                    </Box>
                </div>
                <div>
                    <h1
                        style = {{
                            textAlign: 'center'
                        }}
                    >
                        Groups
                    </h1>
                    <Box style={{ margin: 'auto'}}>
                        <List>
                            {friendInfo.groups.map((group, index) => (
                                <ListItem key={index}>
                                    <Paper
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '300px',
                                            padding: '4%',
                                            margin: 'auto',
                                            borderRadius: '25px',
                                        }}
                                        elevation={3}
                                    >
                                        <p style={{margin:'auto'}}>{group.groupName}</p>
                                        <AvatarGroup max={2}>
                                            {group.members.map((member, index) => (
                                                <Avatar
                                                    key={index}
                                                    alt={member.username.toUpperCase()}
                                                    src={`/profileImages/${member.profileID}.jpg`}
                                                />
                                            ))}
                                        </AvatarGroup>
                                    </Paper>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </div>
            </div>
            <Footer />
        </>
        :
        <CircularProgress style={{color:'#6C63FF', width:'100px', height:'100px', display:'flex', margin:'auto', alignItems:'center', height:'800px'}}/>
    )
}

export default User

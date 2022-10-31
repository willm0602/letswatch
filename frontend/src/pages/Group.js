import { Link, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Footer from './components/footer'
import NMHeader from './components/nonMediaHeader'

import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'

const Group = () => {
    const location = useLocation()
    const groupInfo = location.state.group

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
            }}
        >
            <NMHeader />
            <h1>{groupInfo.groupName}</h1>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {groupInfo.members.map((member) => (
                    <Avatar
                        style={{ margin: '5px' }}
                        alt={member.username}
                        src={`/profileImages/${member.profileID}.jpg`}
                    />
                ))}
            </div>

            <Box>
                <List>
                    {groupInfo.lists.map((list, listIdx) => (
                        <ListItem key={listIdx}>
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
                                <Link
                                    to={`/list/${list.listID}`}
                                    style={{
                                        margin: 'auto',
                                        textDecoration: 'none',
                                        color: 'black',
                                    }}
                                    state={{
                                        list: list,
                                        groupName: groupInfo.groupName,
                                        groupID: groupInfo.groupID,
                                        groupIdx: location.state.groupIdx,
                                        listIdx: listIdx,
                                    }}
                                >
                                    {list.listName}
                                </Link>
                                <AvatarGroup max={2}>
                                    {list.listMembers.map((member) => (
                                        <Avatar
                                            alt={member.username}
                                            src={`/profileImages/${member.profileID}.jpg`}
                                        />
                                    ))}
                                </AvatarGroup>
                            </Paper>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Footer />
        </div>
    )
}

{
    /* 
 state={{
    list:list, 
    groupName:groupInfo.groupName, 
    groupID:groupInfo.groupID,
    groupIdx:location.state.groupIdx,
    listIdx:listIdx
}}


<Paper style={{display:'flex', justifyContent:'space-between', width:'300px', padding:'4%', margin:'auto', borderRadius:'25px'}} elevation={3}>
    <Link to={`/list/${list.listID}`} style={{margin:'auto', textDecoration:'none', color:'black'}} state={{}}>
        {list.listName}
    </Link>
    <AvatarGroup max={2}>
        {list.listMembers.map( member => 
            <Avatar alt={member.username} src={`/profileImages/${member.profileID}.jpg`} />
        )}
    </AvatarGroup>
</Paper> 
*/
}

export default Group

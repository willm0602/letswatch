import { useContext } from 'react';
import {UserContext} from '../contextSetup';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Link } from 'react-router-dom';
import Footer from './components/footer';
import NMHeader from './components/nonMediaHeader';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';

const Home = () => {
    const ctx = useContext(UserContext);
    const fakeData = ctx.fakeDBInfo;

    const myLists = fakeData.groups.filter( group => group.groupName === "My Lists")[0].lists;
    const otherLists = fakeData.groups.filter( group => group.groupName !== "My Lists");

    const autoCompletePlaceholderData = [
        {
            label:'test1'
        },
        {
            label:'test2'
        },
        {
            label:'test3'
        }
    ]

    return(
        <div style={{display:'flex', flexDirection:'column', textAlign:'center', marginBottom:'100px'}}>
            <NMHeader />
            
            <Autocomplete
                id='autocomplete'
                options={autoCompletePlaceholderData}
                sx={{width:300, borderRadius:'105px', margin:'auto', marginTop:'15px',  border:'1px solid lightgrey'}}
                renderInput={(params)=><TextField {...params} label="Media Search"/>}
            />
            <img style={{maxWidth:'200px', margin:'auto', marginTop:'2em'}} src='/undraw1.svg'/>
            
            <h2>My Lists</h2>
            <Box style={{margin:'auto'}}>
                <List>
                    {myLists.map( (list,listIdx) => 
                        <ListItem>
                            <Paper style={{display:'flex', justifyContent:'space-between', width:'300px', padding:'4%', margin:'auto', borderRadius:'25px'}} elevation={3}>
                                <Link 
                                    to={`/list/${list.listID}`} 
                                    style={{margin:'auto', textDecoration:'none', color:'black'}}
                                    state={{
                                        list:list, 
                                        listIdx:listIdx,
                                        groupIdx:0
                                    }}
                                >
                                    {list.listName}
                                </Link>
                                <AvatarGroup max={2}>
                                        {list.listMembers.map( member => 
                                            <Avatar alt={member.username} src={`/profileImages/${member.profileID}.jpg`} />
                                        )}
                                </AvatarGroup>
                            </Paper>
                        </ListItem>
                    )}
                </List>
            </Box>
            
            <Button variant="contained" style={{maxWidth:'300px', margin:'auto', backgroundColor:'#6C63FF', borderRadius:'15px'}}>
                See More
            </Button>

            <h2>Groups</h2>
            <Box style={{margin:'auto'}}>
                <List>
                    {otherLists.map( (group,index) =>  
                        // index + 1, because we took my list out of the entire list
                        <ListItem key={index+1}>
                                <Paper style={{display:'flex', justifyContent:'space-between', width:'300px', padding:'4%', margin:'auto', borderRadius:'25px'}} elevation={3}>
                                    <Link to={`/group/${group.groupID}`} state={{group:group, groupIdx:index+1}} style={{margin:'auto', textDecoration:'none', color:'black'}}>
                                        {group.groupName}
                                    </Link>
                                    <AvatarGroup max={2}>
                                        {group.members.map( member => 
                                            <Avatar alt={member.username} src={`/profileImages/${member.profileID}.jpg`} />
                                        )}
                                    </AvatarGroup>
                                </Paper>
                        </ListItem>
                    )}
                </List>
            </Box>
            <Button variant="contained" style={{maxWidth:'300px', margin:'auto', backgroundColor:'#6C63FF', borderRadius:'15px'}}>
                See More
            </Button>
            <Footer />
        </div>
    )
}

export default Home;
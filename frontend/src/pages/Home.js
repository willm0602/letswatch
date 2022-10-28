import { useContext } from 'react';
import {UserContext} from '../contextSetup';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Link } from 'react-router-dom';

const Home = () => {
    const ctx = useContext(UserContext);
    const fakeData = ctx.fakeDBInfo;

    return(
        <>
            <h1>Let's Watch</h1>
            <h2>Groups</h2>
            <Box>
                <List>
                    {fakeData.groups.map( (group,index) =>  
                        <ListItem key={index}>
                            <Link to={`/group/${group.groupID}`} state={{group:group}}>
                                {group.groupName}
                            </Link>
                        </ListItem>
                    )}
                </List>
            </Box>
        </>
    )
}

export default Home;
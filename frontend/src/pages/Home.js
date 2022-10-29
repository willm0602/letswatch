import { useContext } from 'react';
import {UserContext} from '../contextSetup';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Link } from 'react-router-dom';
import Footer from './components/footer';
import NMHeader from './components/nonMediaHeader';

const Home = () => {
    const ctx = useContext(UserContext);
    const fakeData = ctx.fakeDBInfo;

    return(
        <div style={{display:'flex', flexDirection:'column', textAlign:'center'}}>
            <NMHeader />
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
            <Footer />
        </div>
    )
}

export default Home;
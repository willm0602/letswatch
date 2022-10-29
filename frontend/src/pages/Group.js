import { Link, useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Footer from "./components/footer";
import NMHeader from "./components/nonMediaHeader";

const Group = () => {
    const location = useLocation();
    const groupInfo = location.state.group;

    console.log(groupInfo);

    return(
        <>
            <NMHeader />
            <h1>{groupInfo.groupName}</h1>
            <p>Members are: {groupInfo.members.map(member => <p> {member.username} </p>)}</p>
            <Box>
                <List>
                    {groupInfo.lists.map( (list, listIdx) =>
                        <ListItem key={listIdx}>
                            <Link to={`/list/${list.listID}`} state={{list:list}}>
                                {list.listName}
                            </Link>
                        </ListItem>
                    )}
                </List>
            </Box>
        <Footer />
        </>
    )

}

export default Group;
import { Link, useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Autocomplete, TextField } from "@mui/material";
const ListOfMedia = () => {
    const location = useLocation();
    const listInfo = location.state.list;

    console.log(listInfo);

    const mockMedia = [
        {label:'one'},
        {label:'two'},
        {label:'three'},
    ]

    return(
        <>
            <Link to='/'>
                Home
            </Link>
            
            <h1>{listInfo.listName}</h1>
            <h2>List members:</h2>
            {listInfo.listMembers.map( member => <p>{member}</p>)}

            <Autocomplete
                id='add-media'
                options={mockMedia}
                getOptionLabel={(option)=> option.label}
                renderOption={(props,options)=>(
                    <Box>
                        {options.label}
                    </Box>
                )}
                renderInput={(params)=>(
                    <TextField
                        {...params}
                        label='Choose Media'
                        inputProps={{
                            ...params.inputProps,
                            autocomplete:'new-password',
                        }}
                    />
                )}
            >
            </Autocomplete>

            <Box>
                <List>
                    {listInfo.media.map( (mediaItem, mediaIndex) =>
                        <ListItem>
                            
                            <img style={{maxWidth:'100px'}} src={mediaItem.poster}/>
                            <p>{mediaItem.title}</p>
                            <p>{mediaItem.addedBy}</p>
                            <p>{mediaItem.score}</p>
                            <p>{mediaItem.synopsis}</p>

                        </ListItem>
                    )}
                </List>
            </Box>

        </>
    )
}
export default ListOfMedia;
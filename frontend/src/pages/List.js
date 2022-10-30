import React, { useState, useContext, useEffect } from "react";

import { useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Autocomplete, TextField } from "@mui/material";
import {UserContext} from '../contextSetup';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {Button} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

import Footer from "./components/footer";
import NMHeader from "./components/nonMediaHeader";

const ListOfMedia = () => {
    //used for displaying the content as updating content doesn't update the DOM.
    const [listContent, setListContent] = useState([]); 
    const ctx = useContext(UserContext);
    const {fakeDBInfo, setFakeDBInfo} = ctx;
    const location = useLocation();    
    const groupIdx = location.state.groupIdx;
    const listIdx = location.state.listIdx;
    const listInfo = location.state.list;
    const fakeMedia = ctx.fakeMediaSearch;


    const handleClick = (mediaTitle) => {
        if(listContent.filter(item => item.title === mediaTitle).length > 0 
            || ctx.fakeDBInfo.groups[groupIdx].lists[listIdx].media.filter(item => item.title === mediaTitle).length > 0)
                return;
        addToCTXList(mediaTitle);
    }

    const addToCTXList = (mediaTitle) => {
        let chosenMedia = fakeMedia.filter(media => media.title === mediaTitle);
        chosenMedia = {...chosenMedia[0], addedBy:ctx.fakeDBInfo.username};

        let newDBInfo = ctx.fakeDBInfo;
        let newMedia = newDBInfo.groups[groupIdx].lists[listIdx].media.slice();
        newMedia = [...newMedia, chosenMedia];
        newDBInfo.groups[groupIdx].lists[listIdx].media = newMedia;
        setFakeDBInfo(newDBInfo);
        setListContent([...listContent, chosenMedia])
    }

    const handleRemove = (itemToRemove) => {
        let newDBInfo = fakeDBInfo;
        let newMedia = newDBInfo.groups[groupIdx].lists[listIdx].media.slice();
        newMedia = newMedia.filter(item => item.title !== itemToRemove);
        newDBInfo.groups[groupIdx].lists[listIdx].media = newMedia;
        setFakeDBInfo(newDBInfo);
        
        const newList = listContent.filter(item => item.title !== itemToRemove);
        setListContent(newList);
    }

    useEffect(()=>{
        setListContent([...listInfo.media]);
    },[]);

    return(
        <>
        <NMHeader />
        <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', marginTop:'5%', paddingBottom:'100px'}}>

            <h1>{listInfo.listName}</h1>
            <h2>List members:</h2>
            <Stack direction="row">
                {listInfo.listMembers.map( member => 
                    <Avatar style={{margin:'15px 5px', border:'1px solid black'}} alt={member.username} src={`/profileImages/${member.profileID}.jpg`} />
                )}
            </Stack>
            <Autocomplete
                id='add-media'
                sx={{ width: '90%', border:'1px solid lightgrey'}}
                options={fakeMedia}
                getOptionLabel={(option)=> option.title}
                renderOption={(props,options)=>(
                    <Button style={{
                        display:'flex',
                        justifyContent:'space-between',
                        paddingTop:'10px',
                        width:'100%',
                        textTransform: 'none'
                    }}>                        <img style={{maxWidth:'50px'}} src={options.poster}/>
                        <p style={{marginLeft:'15px'}}>{options.title}</p>
                        <AddCircleIcon onClick={()=>{handleClick(options.title)}}/>
                    </Button>
                )}
                renderInput={(params)=>(
                    <TextField
                        {...params}
                        label='Add Media'
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
                    {listContent.map( (mediaItem, mediaIndex) => //was listContent
                        <ListItem>
                            <div style={{display:'flex', justifyContent:'space-around'}}>
                                <div style={{display:'flex', flexDirection:'column'}}>
                                <div style={{position:'relative'}}>
                                    <img style={{maxWidth:'90px', margin:'15px'}} src ={mediaItem.poster}/>
                                    
                                    <div 
                                    style={{
                                        position:'absolute', 
                                        display:'flex',
                                        justifyContent:'center',
                                        alignItems:'center',
                                        width:'15px', 
                                        height:'15px', 
                                        borderRadius:'50%', 
                                        bottom:'5px', 
                                        left:'70%', 
                                        color:'black', 
                                        backgroundColor: mediaItem.score > 70 ? '#66FF63': mediaItem.score > 50 ? '#FFF963' : '#FFC165', 
                                        padding:'5px',
                                        textAlign:'start',
                                        border:'1px solid black'
                                        }}>
                                        <span style={{fontSize:'0.75em'}}><b>{mediaItem.score}</b></span><span style={{fontSize:'0.55em'}}>%</span>
                                    </div>
                                </div>
                                
                                <Button  variant="contained" onClick={()=>{handleRemove(mediaItem.title)}} style={{backgroundColor:'crimson', color:'white', marginLeft:'auto', marginRight:'auto', padding:'0'}}><CloseIcon /></Button>

                                </div>

                                <div>
                                <p style={{margin:'5px'}}><b>{mediaItem.title}</b>, added by: <b>{mediaItem.addedBy}</b></p>
                                <div style={{maxHeight:'250px', padding:'5px', overflow:'scroll'}}>
                                    <p style={{margin:'5px', fontSize:'14px'}}>{mediaItem.synopsis}</p>
                                </div>
                                </div>
                            </div>

                        </ListItem>
                    )}
                </List>
            </Box>
        <Footer />
        </div>
    </>
    )
}
export default ListOfMedia;
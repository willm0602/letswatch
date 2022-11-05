import React, { useContext } from 'react'
import { UserContext } from '../contextSetup'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import { ListItem, List, Paper } from '@mui/material'
import Footer from './components/footer'
import NMHeader from './components/nonMediaHeader'
import { Link } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { TextField } from '@mui/material'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'

//API stuff
import { makeNewGroup } from '../APIInterface/CreateGroup'
import { userMetadata } from '../APIInterface/GetUserData'
const Groups = () => {
    const ctx = useContext(UserContext)
    const userGroups = ctx.userInfo.groups

    const [open, setOpen] = React.useState(false)
    const [newGroupName, setNewGroupName] = React.useState('')
    const handleOpen = () => setOpen(true)
    const handleClose = () => {
        setOpen(false)
        setNewGroupName('')
    }

    const handleInputChange = (event) => {
        setNewGroupName(event.target.value)
    }

    const handleCreateGroup = () => {
        console.log(newGroupName)
        const currentGroups = ctx.userInfo.groups
        let userInfo = ctx.userInfo

        const newGroups = [
            ...currentGroups,
            {
                groupID: 9999,
                groupName: newGroupName,
                lists: [],
                members: [
                    {
                        username: ctx.userInfo.username,
                        profileID: ctx.userInfo.profileID,
                    },
                ],
            },
        ]
        userInfo.groups = newGroups
        ctx.setUserInfo(userInfo)

        //This function doesn't have the backend setup as of right now
        makeNewGroup(newGroupName, ctx.userInfo.userID).then(
            userMetadata().then((res) => ctx.setUserInfo(res))
        )

        handleClose()
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
    }

    return (
        <>
            {userGroups ? (
                <>
                    <NMHeader />
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <h2>Groups</h2>
                        <Box style={{ margin: 'auto' }}>
                            <List>
                                {userGroups.map((group, groupIndex) => (
                                    <ListItem>
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
                                                to={`/group/${group.groupID}`}
                                                state={{
                                                    group: group,
                                                    groupIdx: groupIndex,
                                                }}
                                                style={{
                                                    margin: 'auto',
                                                    textDecoration: 'none',
                                                    color: 'black',
                                                }}
                                            >
                                                {group.groupName}
                                            </Link>

                                            <AvatarGroup max={2}>
                                                {group.members.map((member) => (
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
                    </div>
                </>
            ) : (
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            )}

            <Fab
                onClick={() => handleOpen()}
                color="primary"
                aria-label="add"
                style={{
                    position: 'fixed',
                    top: '80%',
                    left: '80%',
                    backgroundColor: '#6C63FF',
                }}
            >
                <AddIcon />
            </Fab>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h3>Create New Group?</h3>
                    <TextField
                        id="filled-basic"
                        label="Group Name"
                        variant="filled"
                        onChange={handleInputChange}
                    />
                    <Button
                        onClick={() => handleCreateGroup()}
                        variant="contained"
                        style={{
                            maxWidth: '300px',
                            margin: 'auto',
                            backgroundColor: '#6C63FF',
                            borderRadius: '15px',
                            margin: '5%',
                        }}
                    >
                        Submit
                    </Button>
                </Box>
            </Modal>

            <Footer />
        </>
    )
}

export default Groups
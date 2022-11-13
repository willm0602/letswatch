import { useContext } from 'react'
import { UserContext } from '../contextSetup'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { Link } from 'react-router-dom'
import Footer from './components/footer'
import NMHeader from './components/nonMediaHeader'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Button from '@mui/material/Button'
import { userMetadata } from '../APIInterface/GetUserData'
import { setAccessToken, getAccessToken } from '../LocalStorageInterface'

/*
    There's an issue with auto-complete adding to the media list, i'll need to re-call the function that gets the media lists
    cause right now the app needs to be reloaded for the new media to apply to the lists
    something like:
        allMedia().then((res) => ctx.setAutoFillMedia(res));



    TODO:
        [] fix the thing above?
        [] have extended media search add to the backend
        [] play with media(plural) page and get it setup
*/

const Home = () => {
    const ctx = useContext(UserContext)
    const fakeData = ctx.fakeDBInfo

    const autoFillMedia = ctx.autoFillMedia

    console.log(ctx)

    userMetadata().then((res) => {
        console.log(res)
    })

    let personalGroup = []
    let personalLists = []
    if (ctx.userInfo) {
        personalGroup = ctx.userInfo.groups.filter(
            (group) =>
                group.members.length === 1 &&
                group.members[0].username === ctx.userInfo.username
        )
        if (personalGroup) personalLists = personalGroup[0].lists.slice(0, 3)
    }

    const autoCompletePlaceholderData = [
        {
            label: 'test1',
        },
        {
            label: 'test2',
        },
        {
            label: 'test3',
        },
    ]

    return ctx.userInfo ? (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                marginBottom: '100px',
            }}
        >
            <NMHeader />

            <Autocomplete
                id="autocomplete"
                options={autoCompletePlaceholderData}
                sx={{
                    width: 300,
                    borderRadius: '105px',
                    margin: 'auto',
                    marginTop: '15px',
                    border: '1px solid lightgrey',
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Media Search" />
                )}
            />
            <img
                style={{ maxWidth: '200px', margin: 'auto', marginTop: '2em' }}
                src="/undraw1.svg"
            />

            <h2>My Lists</h2>
            <Box style={{ margin: 'auto' }}>
                <List>
                    {!personalLists ? (
                        <p>No Lists yet, ya goober :)</p>
                    ) : (
                        personalLists.map((list, listIdx) => (
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
                                        to={`/list/${list.listID}`}
                                        style={{
                                            margin: 'auto',
                                            textDecoration: 'none',
                                            color: 'black',
                                        }}
                                        state={{
                                            list: list,
                                            listIdx: listIdx,
                                            groupIdx: 0,
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
                        ))
                    )}
                </List>
            </Box>

            <Button
                variant="contained"
                style={{
                    maxWidth: '300px',
                    margin: 'auto',
                    backgroundColor: '#6C63FF',
                    borderRadius: '15px',
                }}
            >
                See More
            </Button>

            <h2>Groups</h2>
            <Box style={{ margin: 'auto' }}>
                <List>
                    {ctx.userInfo.groups.map((group, index) => (
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
                                <Link
                                    to={`/group/${group.groupID}`}
                                    state={{
                                        group: group,
                                        groupIdx: index,
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
            <Link to="/groups" style={{ textDecoration: 'none' }}>
                <Button
                    variant="contained"
                    style={{
                        maxWidth: '300px',
                        margin: 'auto',
                        backgroundColor: '#6C63FF',
                        borderRadius: '15px',
                    }}
                >
                    See More
                </Button>
            </Link>
            <Footer />
        </div>
    ) : null
}

export default Home

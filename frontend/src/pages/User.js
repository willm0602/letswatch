import { useLocation, useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import Footer from './components/footer'
import NMHeader from './components/nonMediaHeader'
import { UserContext } from '../contextSetup'
import { deleteAccessToken } from '../LocalStorageInterface'
import { Button } from '@mui/material'
import { userMetadata } from '../APIInterface/GetUserData'

const User = () => {
    const [userInfo,setUserInfo] = useState(null)
    //fixes refresh problem
    useEffect(()=>{
        const setup = async() =>{
            await userMetadata().then(res=> setUserInfo(res));
        }
        setup()
    },[])

    return ( 
        userInfo ?
        <>
            <NMHeader />
            <div
                style={{ margin: '5%', display: 'flex', alignItems: 'center' }}
            >
                <div style={{ textAlign: 'center' }}>
                    <img
                        style={{ maxWidth: '100px', borderRadius: '50%' }}
                        src={`/profileImages/${userInfo.profileID}.jpg`}
                    />
                    <p>Date Joined: {userInfo.dateJoined.split('T')[0]}</p>
                </div>

                <div style={{ width: '100%', margin: '0 5%' }}>
                    <h2>{userInfo.username}</h2>
                    <div
                        style={{
                            backgroundColor: 'rgb(217, 217, 217, 0.25)',
                            textAlign: 'start',
                            height: '150px',
                            width: '180px',
                            padding: '1% 10%',
                        }}
                    >
                        <p>{userInfo.bio}</p>
                    </div>
                </div>
            </div>

            <hr />
            <div>
                <h3>Lists</h3>

                <h3>Groups</h3>

                <Button
                    variant="contained"
                    style={{
                        maxWidth: '300px',
                        margin: 'auto',
                        backgroundColor: '#6C63FF',
                        borderRadius: '15px',
                    }}
                    onClick={(e) => {
                        deleteAccessToken()
                        window.location = '/'
                    }}
                >
                    Sign Out
                </Button>
            </div>
            <Footer />
        </>
        :
        <></>//add loading circle thing here later
    )
}

export default User

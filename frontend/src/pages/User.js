import { useLocation } from 'react-router-dom'
import Footer from './components/footer'
import NMHeader from './components/nonMediaHeader'

const User = () => {
    const location = useLocation()
    const userInfo = location.state.userInfo

    return (
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
                    <p>{userInfo.dateJoined.split(' ')[0]}</p>
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
            </div>
            <Footer />
        </>
    )
}

export default User
import { Link } from 'react-router-dom'

const NMHeader = () => {
    return (
        <div style={{ backgroundColor: '#6C63FF', color: 'white' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                <h1
                    style={{
                        margin: '0',
                        padding: '15px',
                        textAlign: 'center',
                    }}
                >
                    Let's Watch
                </h1>
            </Link>
        </div>
    )
}

export default NMHeader

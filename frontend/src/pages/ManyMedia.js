import Footer from './components/footer'
import { UserContext } from '../contextSetup'
import React, { useContext, useEffect, useState } from 'react'
import { Autocomplete } from '@mui/material'
import { TextField } from '@mui/material'
const ManyMedia = () => {
    const [randomBackground, setRandomBackground] = useState(0)

    useEffect(() => {
        const randomNumber = Math.floor(Math.random() * 21)
        setRandomBackground(randomNumber)
    }, [])

    const ctx = useContext(UserContext)
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
    console.log(ctx.chainsawMan)

    return (
        <>
            <div
                style={{
                    backgroundImage: `url(/mediaBackgroundImages/${randomBackground}.jpg)`,
                    height: '250px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    boxShadow: '0px 1px 5px black',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        backgroundColor: 'rgba(108,99,255,0.7)',
                        height: '100%',
                        width: '100%',
                    }}
                ></div>
                <h1 style={{ color: 'white', zIndex: '99' }}>Let's Watch</h1>
                <Autocomplete
                    id="autocomplete"
                    options={autoCompletePlaceholderData}
                    sx={{
                        width: 300,
                        marginTop: '15px',
                        backgroundColor: 'white',
                        zIndex: 99,
                        borderRadius: '100px',
                    }}
                    renderInput={(params) => (
                        <TextField
                            InputProps={{ style: { color: 'red' } }}
                            {...params}
                            label="Search"
                        />
                    )}
                />
            </div>

            <>medias</>
            <Footer />
        </>
    )
}

export default ManyMedia

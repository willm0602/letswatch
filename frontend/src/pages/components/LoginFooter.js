import { Paper } from '@mui/material'

const LoginFooter = () => {
    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#6C63FF',
                textAlign: 'center',
                color: 'white',
                padding: 1,
                fontSize: 20,
            }}
            elevation={3}
        >
            Copyright Glasses Cubed Inc
        </Paper>
    )
}

export default LoginFooter

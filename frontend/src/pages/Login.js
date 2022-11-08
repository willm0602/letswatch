import {useNavigate} from 'react-router-dom';
import { Stack, FilledInput, ToggleButtonGroup, ToggleButton, Button, Box} from "@mui/material";
import { Fragment, useState } from "react";
import { login, signup} from "../APIInterface/AccountManagement";
import LoginFooter from "./components/LoginFooter";

const Login = () => {
    const [action, setAction] = useState('Login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [cPasswordError, setCPasswordError] = useState(false);
    const navigate = useNavigate(); // For when Will add's something to be returned when finished, will route it to home page

    const handleSubmit = (e) => {
        e.preventDefault();
        setUsernameError(false);
        setPasswordError(false);
        setCPasswordError(false);

        if(action === 'Login'){
            if(username === '') { 
                setUsernameError(true);
            }
            if(password === '') { 
                setPasswordError(true);
            } else {
                login(username, password);
            }
        } else if( action === 'Register') {
            if(password === '') { 
                setPasswordError(true);
            }
            if(cPassword !== password) { 
                setCPasswordError(true);
            }
            if(username === '') { 
                setUsernameError(true);
            } else if(cPasswordError && passwordError) {
                signup(username, password);
            }
        }
    }

    const handleAction = (event, newAction) => {
        if(newAction !== null)
        {
            setAction(newAction);
            setUsernameError(false);
            setPasswordError(false);
            setCPasswordError(false);
        }
    };

    return (
    <div className="LoginPage">
        <img style={{maxWidth: '350px',marginTop: '2%'}} src="/loginImageMan.svg" alt="whoopsies"/>
        <h1>Let's Watch</h1>
        <h2>{action}</h2>
        <ToggleButtonGroup
            value={action}
            exclusive
            onChange={handleAction}
            aria-label = "Toggle-Group"
        >
            <ToggleButton value = "Login" aria-label = "Login-Switch">
                Login
            </ToggleButton>
            <ToggleButton value = "Register" aria-label = "Register-Switch">
                Register
            </ToggleButton>
        </ToggleButtonGroup>
        <form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            {(action === "Login") && (
            <Stack
                py = {5}
                spacing={2}
                alignItems="center"
            >
                    <FilledInput
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        error = {usernameError} 
                    />
                    {usernameError && (<Fragment>Username can't be empty</Fragment>)}
                    <FilledInput
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                        error = {passwordError}
                    />
                    {passwordError && (<Fragment>Password can't be empty</Fragment>)}
            </Stack>
            )}

            {(action === "Register") && (
            <Stack
                py = {5}
                spacing={2}
                alignItems="center"
            >
                    <FilledInput
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        error = {usernameError}
                    />
                    {usernameError && (<Fragment>Username can't be empty</Fragment>)}
                    <FilledInput 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type = "password"
                        required
                        error = {passwordError}
                    />
                    {passwordError && (<Fragment>Password can't be empty</Fragment>)}
                    <FilledInput
                        onChange={(e) => setCPassword(e.target.value)}
                        placeholder="Confirm password"
                        type = "password"
                        required
                        error = {cPasswordError}
                    />
                    {cPasswordError && (<Fragment>Passwords don't match</Fragment>)}
            </Stack>
            )}
            <Box textAlign='center'>
                <Button
                    type = "submit"
                    variant = "contained"
                    size = "medium"
                    sx = {{backgroundColor:'#6C63FF'}}
                >
                    {action}
                </Button>
            </Box>
            <LoginFooter/>
        </form>
    </div>
    )
}

export default Login;
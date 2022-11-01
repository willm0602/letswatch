import { Stack, FilledInput, ToggleButtonGroup, ToggleButton, Button, Box} from "@mui/material";
import { useState } from "react";
import { login, signup } from "../APIInterface/AccountManagement";

const Login = () => {
    const [action, setAction] = useState('Login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [cPasswordError, setCPasswordError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault()
        
        setUsernameError(false);
        setPasswordError(false);
        setCPasswordError(false);
        setErrorMessage("");
        let newErrorMessage = "";

        if(action === 'Login'){
            if(username === '') { setUsernameError(true); }
            if(password === '') { setPasswordError(true); }

        } else if( action === 'Register') {
            if(username === '') { 
                setUsernameError(true);
                newErrorMessage += "Username Field can't be empty" + "\n";
            }
            if(password === '') { 
                setPasswordError(true);
                newErrorMessage += "Password field can't be empty" + "\n";
            }
            if(cPassword === '') { 
                setCPasswordError(true);
                newErrorMessage += "Confirm Password can't be empty" + "\n";
            }
            if(password !== cPassword) {
                setCPasswordError(true);
                setPasswordError(true);
                newErrorMessage += "Passwords don't match" + "\n";
            }
            console.log(newErrorMessage)
            console.log(`Username is: ${username}\nPassword is: ${password}\nConfirm Password is: ${cPassword}`)
            setErrorMessage(newErrorMessage);
        }
    }

    const handleAction = (event, newAction) => {
        if(newAction !== null)
        {
            setAction(newAction);
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
        {(cPasswordError || passwordError || usernameError) && (
        <h3> 
            {errorMessage.replace(/\n/g, <br />)}
        </h3>
        )}
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
                    <FilledInput
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                        error = {passwordError}
                    />
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
                    <FilledInput 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type = "password"
                        required
                        error = {passwordError}
                    />
                    <FilledInput
                        onChange={(e) => setCPassword(e.target.value)}
                        placeholder="Confirm password"
                        type = "password"
                        required
                        error = {cPasswordError}
                    />
            </Stack>
            )}
            <Box textAlign='center'>
                <Button
                    type = "submit"
                    variant = "contained"
                    size = "medium"
                >
                    {action}
                </Button>
            </Box>
        </form>
    </div>
    )
}

export default Login;
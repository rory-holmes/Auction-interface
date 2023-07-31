import React from "react";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import "../store/index"
import {useUserStore} from "../store";
import Header from "./Header";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {FormControl, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import IconButton from "@mui/material/IconButton";

const Login = () => {
    // @ts-ignore
    const getUser = useUserStore(state => state.user)
    // @ts-ignore
    const setUser = useUserStore(state => state.setUser)
    // const setImage = useUserStore((state: string) => state.setImagePath)
    const [userPassword, setPassword] = React.useState("")
    const [userEmail, setEmail] = React.useState("")
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false)

    const emailInput = (event: any) => {
        setEmail(event.target.value);
    };

    const passwordInput = (event: any) => {
        setPassword(event.target.value);
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const login = () => {
        if ((getUser.userId == -1)) {
            axios.post('http://localhost:4941/api/v1/users/login', {"email": userEmail, "password": userPassword})
                .then((response) => {
                    setUser({"userId": response.data.userId, "token": response.data.token})
                    navigate('/Auction')
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.response.statusText)
                })
        } else {
            setErrorFlag(true)
            setErrorMessage("You must log out first")
        }


    }
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
    <html lang="en">
    <head>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Bootstrap 5 - Login Form</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"/>
    </head>
    <Header/>

    <body className="main-bg">
    <div className="container">
        <div className="row justify-content-center mt-5">
            <div className="col-lg-4 col-md-6 col-sm-6">
                <div className="card shadow">
                    <div className="card-title text-center border-bottom">
                        <h2 className="p-3">Login</h2>
                    </div>
                    <div className="card-body">
                            <div className="mb-4">
                                <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
                                    <OutlinedInput
                                        type='text'
                                        onChange={emailInput}
                                        label="email"
                                    />
                                </FormControl>
                            </div>
                            <div className="mb-4">
                                <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={passwordInput}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary" onClick={login}>Login</button>
                            </div>
                            <br/>
                            <div className="d-grin">
                                <Link to={"/register"}>Register</Link>
                            </div>
                    </div>
                </div>
            </div>
        </div>
        <br/>
        {errorFlag &&
            <div style={{color: "red"}}>
                {errorMessage}
            </div>
        }
    </div>
    </body>

    </html>
    )
}
export default Login;

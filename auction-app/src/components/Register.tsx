import React from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import {useUserStore} from "../store";
import {FormControl, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";

const Register = () => {
    // @ts-ignore
    const getUser = useUserStore(state => state.user)
    // @ts-ignore
    const setUser = useUserStore(state => state.setUser)

    const [userPassword, setPassword] = React.useState("")
    const [userEmail, setEmail] = React.useState("")
    const [userFirstName, setFirstName] = React.useState("")
    const [userLastName, setLastName] = React.useState("")
    const [image, setImage] = React.useState("")
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const navigate = useNavigate();
    const [imageContentType, setImageContentType] = React.useState("")

    const emailInput = (event: any) => {
        setEmail(event.target.value);
    };

    const passwordInput = (event: any) => {
        setPassword(event.target.value);
    }
    const firstNameInput = (event: any) => {
        setFirstName(event.target.value);
    }
    const lastNameInput = (event: any) => {
        setLastName(event.target.value);
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const validationCheck = () => {
        const email = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!email.test(userEmail)){
            setErrorFlag(true)
            setErrorMessage("Email must be syntactically valid")
            return false
        } else if (userPassword.length < 6) {
            setErrorFlag(true)
            setErrorMessage("Password must be at least 6 characters long")
            return false
        } else if ((userFirstName.length < 2) || (userLastName.length < 2)) {
            setErrorFlag(true)
            setErrorMessage("Names must be more than one character long")
            return false
        }
        else {
            return true
        }
    }


    const addImage = (event: number, token:string) => {
        // @ts-ignore
        axios.put('http://localhost:4941/api/v1/users/' + event + '/image', image,
            {headers: {"X-Authorization": token, "Content-Type" : imageContentType}})
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage("You have been logged in but: " + error.response.statusText)
                return false
            })

    }
    const login = () => {
        axios.post('http://localhost:4941/api/v1/users/login', {"email": userEmail, "password": userPassword})
            .then((response) => {
                setUser({"userId": response.data.userId, "token": response.data.token})
                if (image) {
                    addImage(response.data.userId, response.data.token)
                }
                navigate('/Auction')
            }, (error) => {

                setErrorFlag(true)
                setErrorMessage(error.response.statusText)
                return false
            })
    }

    const register = () => {
        if ((getUser.userId == -1)) {
            if (validationCheck()) {
                axios.post('http://localhost:4941/api/v1/users/register',
                    {
                        'firstName': userFirstName,
                        'lastName': userLastName,
                        'email': userEmail,
                        'password': userPassword
                    })
                    .then((response) => {
                        login()
                    }, (error) => {
                        setErrorFlag(true)
                        setErrorMessage(error.response.statusText)
                    })
            }
        } else {
            setErrorFlag(true)
            setErrorMessage("Please Log out to register a new account")
            return false
        }
    }

    const onImageChange = (event: any) => {
        setImageContentType(event.target.files[0].type)
        setImage(event.target.files[0])
    }

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
                            <h2 className="p-3">Register</h2>
                        </div>
                        <div className="card-body">
                            <div className="mb-4">
                                <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                    <InputLabel htmlFor="firstName">First Name</InputLabel>
                                    <OutlinedInput
                                        type='text'
                                        onChange={firstNameInput}
                                        label="email"
                                    />
                                </FormControl>
                            </div>
                            <div className="mb-4">
                                <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                    <InputLabel htmlFor="lastName">Last Name</InputLabel>
                                    <OutlinedInput
                                        type='text'
                                        onChange={lastNameInput}
                                        label="email"
                                    />
                                </FormControl>
                            </div>
                            <div className="mb-4">
                                <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                    <InputLabel htmlFor="email">Email</InputLabel>
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
                                <div className="mb-4">
                                    <label htmlFor="image" className="form-label">Image:</label>
                                    <input type="file" accept="image/*" className="form-control" id="image" onChange={onImageChange}/>
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary" onClick={register}>Register</button>
                                </div>
                                <br/>
                                <div className="d-grin">
                                    <Link to={"/login"}>Cancel</Link>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
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
export default Register;

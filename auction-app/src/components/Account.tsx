import Header from "./Header";
import {Link, useNavigate, useParams} from "react-router-dom";
import React from "react";
import {useUserStore} from "../store";
import {Button, FormControl, InputAdornment, InputLabel, OutlinedInput, TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import axios from "axios";
import Avatar from "@mui/material/Avatar";

const Account = () => {
    // @ts-ignore
    const getUser = useUserStore(state => state.user)
    // @ts-ignore

    const setUser = useUserStore(state => state.setUser)
    const params = useParams()

    const [imageContentType, setImageContentType] = React.useState("")
    const [editOff, setEditOff] = React.useState(true)
    const [image, setImage] = React.useState("")
    const [url, setUrl] = React.useState("")
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [updateSuccess, setUpdateSuccess] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [showPassword2, setShowPassword2] = React.useState(false)
    const [retrievedUser, setUserInfo] = React.useState({
        userId: -1,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        currentPassword: "",
        image_filename: ""
    })

    const getUserInfo = () => {
        axios.get("http://localhost:4941/api/v1/users/" +params.id,
            {headers: {"X-Authorization" : getUser.token}})
            .then((response) => {
                setUserInfo(response.data)
            })
    }

    React.useEffect(() => {
        getUserInfo()
    }, [params.id, editOff])

    const navigate = useNavigate();

    const emailInput = (event: any) => {
        retrievedUser.email = event.target.value;
    };

    const newPasswordInput = (event: any) => {
        retrievedUser.password = event.target.value;
    }
    const oldPasswordInput = (event: any) => {
        retrievedUser.currentPassword = event.target.value;
    }
    const firstNameInput = (event: any) => {
        retrievedUser.firstName = event.target.value
    }
    const lastNameInput = (event: any) => {
        retrievedUser.lastName = event.target.value
    }
    const Edit = () => {
        setEditOff(!editOff)
        setUpdateSuccess(false)
        setErrorFlag(false)
        setErrorMessage("")
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
    const handleClickShowPassword2 = () => {
        setShowPassword2(!showPassword2)
    };

    const onImageChange = (event: any) => {
        setImageContentType(event.target.files[0].type)
        setImage(event.target.files[0])
    }

    const validationCheck = () => {
        const email = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!email.test(retrievedUser.email)){
            setErrorFlag(true)
            setErrorMessage("Email must be syntactically valid")
            return false
        } else if (retrievedUser.password) {
            if (retrievedUser.password.length < 6 || retrievedUser.currentPassword.length < 6) {
                setErrorFlag(true)
                setErrorMessage("Passwords must be at least 6 characters long")
                return false
            }

        } else if ((retrievedUser.firstName.length < 2) || (retrievedUser.lastName.length < 2)) {
            setErrorFlag(true)
            setErrorMessage("Names must be more than one character long")
            return false
        }
        return true
    }

    const deleteImageToggle = () => {
        setImage("Delete")
    }

    const deleteImage = () => {
        axios.delete('http://localhost:4941/api/v1/users/' + params.id + '/image',
            {headers: {"X-Authorization": getUser.token}})
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage("Error deleting image")
            })
    }

    const addImage = () => {
        axios.put('http://localhost:4941/api/v1/users/' + params.id + '/image', image,
            {headers: {"X-Authorization": getUser.token, "Content-Type" : imageContentType}})
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage("Error saving image, try again using a different image")
                return false
            })

    }

    const updateUserInformation = () => {
         if (validationCheck()) {
             axios.patch("http://localhost:4941/api/v1/users/" + params.id,
                 retrievedUser, {headers: {"X-Authorization": getUser.token}})
                 .then((response) => {
                    if (image) {
                        if (image == "Delete") {
                            deleteImage()
                        } else {
                            addImage()
                        }
                     }
                     getUserInfo()
                     Edit()
                     setUpdateSuccess(true)
                 }, (error) => {
                     setErrorFlag(true)
                     setErrorMessage(error.response.statusText)
                 })
         }

    }

    if (getUser.userId == parseInt(params.id as string)){
        // @ts-ignore
        if (editOff) {
            return (
                <html lang="en">
            <head>
                <meta charSet="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Bootstrap 5 - Login Form</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"/>
            </head>
            <Header/>
            <br/>
            {updateSuccess &&
                <div style={{color: "green"}}>
                    User Updated Successfully!
                </div>
            }
            {errorFlag &&
                <div style={{color: "red"}}>
                    {errorMessage}
                </div>
            }
            <body className="main-bg">
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-lg-4 col-md-6 col-sm-6">
                        <div className="card shadow">
                            <div className="card-title text-center border-bottom">
                                <h2 className="p-3">Account</h2>
                            </div>

                            <div className="card-body">
                                <Avatar className={"registerLogo"} alt="User Image" src={"http://localhost:4941/api/v1/users/" + params.id + "/image"} />
                                <br/>
                                <div className="mb-4">
                                    <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                        <TextField
                                            id='firstName'
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            type='text'
                                            label="First Name:"
                                            value={retrievedUser.firstName}
                                        />
                                    </FormControl>
                                </div>
                                <div className="mb-4">
                                    <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                        <TextField
                                            id='lastName'
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            type='text'
                                            label="Last Name:"
                                            value={retrievedUser.lastName}
                                        />
                                    </FormControl>
                                </div>
                                <div className="mb-4">
                                    <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                        <TextField
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            type='text'
                                            label="Email:"
                                            value={retrievedUser.email}
                                        />
                                    </FormControl>
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary" onClick={Edit}>{"Edit Account"}</button>
                                </div>
                                <br/>
                                <div className="d-grin">
                                    <Link to={"/auction"}>Auction Page</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            </body>

            </html>
        ) //Edit is on
            } else {
                return (
                    <html lang="en">
                    <head>
                        <meta charSet="UTF-8"/>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                        <title>Bootstrap 5 - Login Form</title>
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"/>
                    </head>
                    <Header/>
                    <br/>
                    {errorFlag &&
                        <div style={{color: "red"}}>
                            {errorMessage}
                        </div>
                    }
                    <body className="main-bg">
                    <div className="container">
                        <div className="row justify-content-center mt-5">
                            <div className="col-lg-4 col-md-6 col-sm-6">
                                <div className="card shadow">
                                    <div className="card-title text-center border-bottom">
                                        <h2 className="p-3">Account</h2>
                                    </div>
                                    <div className="card-body">
                                        <Avatar className={"registerLogo"} alt="User Image" src={"http://localhost:4941/api/v1/users/" + params.id + "/image"} />
                                        <br/>
                                        <div className="mb-4">
                                            <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                                <TextField
                                                    id='firstName'
                                                    type='text'
                                                    onChange={firstNameInput}
                                                    label="First Name:"
                                                    defaultValue={retrievedUser.firstName}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className="mb-4">
                                            <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                                <TextField
                                                    id='lastName'
                                                    type='text'
                                                    onChange={lastNameInput}
                                                    label="Last Name:"
                                                    defaultValue={retrievedUser.lastName}
                                                />
                                            </FormControl>
                                        </div>
                                        <div className="mb-4">
                                            <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                                <TextField
                                                    type='text'
                                                    onChange={emailInput}
                                                    label="Email:"
                                                    defaultValue={retrievedUser.email}
                                                />
                                            </FormControl>
                                        </div>

                                        <div className="mb-4">
                                            <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                                <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    onChange={newPasswordInput}
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
                                            <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                                <InputLabel htmlFor="outlined-adornment-oldPassword">Current Password</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-oldPassword"
                                                    type={showPassword2 ? 'text' : 'password'}
                                                    onChange={oldPasswordInput}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword2}
                                                                edge="end"
                                                            >
                                                                {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    label="Password"
                                                />
                                                <br/>
                                                <div className="d-grin">
                                                    <Button variant="contained" color="error" onClick={deleteImageToggle}>Delete image</Button>
                                                </div>
                                            </FormControl>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="image" className="form-label">Image:
                                                <input type={"file"} accept="image/*" className="form-control" id="image" onChange={onImageChange}/>
                                            </label>
                                        </div>
                                        <div className="d-grid">
                                            <Button variant="contained" color="success" onClick={updateUserInformation}>{"Save Account"}</Button>
                                        </div>
                                        <br/>
                                        <div className="d-grin">
                                            <Button variant="contained"  onClick={Edit}>Cancel</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    </body>

                    </html>
                )
        }

    } else { //Not Logged into this user
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
                                <h2 className="p-3">Account</h2>
                            </div>
                            <div className="card-body">
                                <Avatar className={"registerLogo"} alt="User Image" src={"http://localhost:4941/api/v1/users/" + params.id + "/image"} />
                                <br/>
                                <div className="mb-4">
                                    <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                        <TextField
                                            id='firstName'
                                            type='text'
                                            label="First Name:"
                                            value={retrievedUser.firstName}
                                        />
                                    </FormControl>
                                </div>
                                <div className="mb-4">
                                    <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
                                        <TextField
                                            id='lastName'
                                            type='text'
                                            label="Last Name:"
                                            value={retrievedUser.lastName}
                                        />
                                    </FormControl>
                                </div>
                                <div className="d-grin">
                                    <Link to={"/auction"}>Auction Page</Link>
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

}
export default Account;
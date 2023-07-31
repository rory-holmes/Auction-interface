import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useUserStore} from "../store";
import logo from "../store/auction.png"

const ResponsiveAppBar = () => {
    // @ts-ignore
    const removeUser = useUserStore(state => state.removeUser)
    // @ts-ignore
    const getUser = useUserStore(state => state.user)
    const settingsLoggedIn = ['Account', 'Logout'];
    const settingsLoggedOut = ['Login', 'Register'];
    const navigate = useNavigate();
    const [userImage, setUserImage] = React.useState(<Avatar alt="User Image" src="/static/images/avatar/2.jpg" />);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    let url = "";
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const getUserToken = {
        'X-Authorization': getUser?getUser.token:''
    }



    const logout = () => {
        // @ts-ignore
        axios.post("http://localhost:4941/api/v1/users/logout", null, {headers: getUserToken})
            .then((response) => {
                removeUser({"userId": -1, "token": ""})
                navigate("/login")
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.response.statusText)
            })
    }

    const openAuctions = () => {
        navigate("/Auction")
    }

    const clickedSettings = (event: string) => {
        switch (event){
            case "Login": navigate('/login'); break;
            case "Account": navigate('/Account/' + getUser.userId); break;
            case "Logout": logout(); break;
            case "Register": navigate('/Register'); break;
        }
    }
    const menuOptions = () => {
        // @ts-ignore
        if ((getUser.userId != -1)) {
            return (
                settingsLoggedIn.map((setting: string) => (
                    <MenuItem key={setting} onClick={() => clickedSettings(setting)}>
                        <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                ))
            )
        } else {
            return (
                settingsLoggedOut.map((setting: string) => (
                    <MenuItem key={setting} onClick={() => clickedSettings(setting)}>
                        <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                ))
            )
        }
    }


    return (

        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {errorFlag &&
                        <div style={{color: "red"}}>
                            {errorMessage}
                        </div>
                    }
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Image" src={logo} />
                            </IconButton>
                        </Tooltip>

                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >{menuOptions()}
                        </Menu>
                    </Box>
                    <MenuItem key="Auctions" onClick={openAuctions}>
                        <b>
                            <Typography textAlign="center">Auctions</Typography>
                        </b>
                    </MenuItem>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;
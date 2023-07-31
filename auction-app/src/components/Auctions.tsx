import React from "react";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../types/auction.d.ts'
import '../types/category.d.ts'
import '../types/bid.d.ts'

import {
    Avatar, Chip,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    InputLabel, MenuItem, OutlinedInput, Pagination,
    Select, SelectChangeEvent,
    TextField, Theme, useTheme
} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();


const Auctions = () => {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = React.useState("")
    const [auctions, setAuctions] = React.useState<Array<auction>>([])
    const [categories, setCategories] = React.useState<Array<Category>>([])
    const [selectedCategories, setSelectedCategories] = React.useState<Array<Category>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [openClosed, setOpenClosed] = React.useState("")
    const [sortBy, setSortBy] = React.useState("CLOSING_SOON")
    const [pageNumber, setPageNumber] = React.useState(1)
    const [numOfPages, setNumOfPages] = React.useState(-1)
    const [auctionLength, setAuctionLength] = React.useState(-1)
    const handlePagination = (event: React.ChangeEvent<unknown>, page: number) => {
        setPageNumber(page)
    }

    React.useEffect(() => {
        getAllAuctions()
        getAllCategories()
    }, [])

    React.useEffect(() => {
        updateNumOfPages()
    }, [auctions])

    React.useEffect(()=> {
        updateAuctions()
    }, [pageNumber])

    const updateNumOfPages = () => {
        let comboQuery = ""
        selectedCategories.map((category) => {
            // @ts-ignore
            comboQuery += "&categoryIds=" + (findCategoryId(category))
        })
        if (openClosed) {
            comboQuery += ("&status=" + openClosed)
        }
        comboQuery += ("&sortBy=" + sortBy)
        axios.get('http://localhost:4941/api/v1/auctions?q=' + searchQuery + comboQuery)
            .then((response) => {
                let localAuctions = response.data.auctions
                setAuctionLength(localAuctions.length)
                setNumOfPages(Math.ceil(localAuctions.length/9))
            })

    }

    //-------------------------------------------------------Filter--------------------------------------------
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const handleChange = (event: SelectChangeEvent<any>) => {
        const {
            target: { value },
        } = event;
        setSelectedCategories(value);
    };
    const handleOpenClosed = (event: SelectChangeEvent) => {
        setOpenClosed(event.target.value);
    };

    const handleSortBy = (event: SelectChangeEvent) => {
        setSortBy(event.target.value)
    }
//-------------------------------------------------------------------------------------------------------
    const calculate_days_till_close = (endDate : string) => {
        const today = new Date().getTime()
        const closing = new Date(endDate).getTime()
        if (today > closing){
            return "Closed"
        } else {
            let calc = new Date(closing - today);
            let calcFormatTmp = calc.getDate() + '-' + (calc.getMonth() + 1) + '-' + calc.getFullYear();
            let calcFormat = calcFormatTmp.split("-");
            let days_passed = parseInt(String(Math.abs(parseInt(calcFormat[0])) - 1));
            let months_passed = parseInt(String(Math.abs(parseInt(calcFormat[1])) - 1));
            let years_passed = parseInt(String(Math.abs(parseInt(calcFormat[2]) - 1970)));

            const yrsTxt = ["year", "years"];
            const mnthsTxt = ["month", "months"];
            const daysTxt = ["day", "days"];

            const result = ((years_passed == 1) ? years_passed + ' ' + yrsTxt[0] + ' ' : (years_passed > 1) ?
                    years_passed + ' ' + yrsTxt[1] + ' ' : '') +
                ((months_passed == 1) ? months_passed + ' ' + mnthsTxt[0] : (months_passed > 1) ?
                    months_passed + ' ' + mnthsTxt[1] + ' ' : '') +
                ((days_passed == 1) ? days_passed + ' ' + daysTxt[0] : (days_passed > 1) ?
                    days_passed + ' ' + daysTxt[1] : '');
            return "Closes in " + result;
        }
    }

    const getAllAuctions = () => {
        axios.get('http://localhost:4941/api/v1/auctions?count=9')
            .then((response) => {
                setAuctions(response.data.auctions)
                setErrorFlag(false)
                setErrorMessage("")
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.response.statusText)
            })
    }
    const getAllCategories = () => {
        axios.get('http://localhost:4941/api/v1/auctions/categories')
            .then((response) => {
                setCategories(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.response.statusText)
            })
    }
    const getCategory = (event: number) => {
        if (categories[(event) - 1]) {
            return (categories[(event.valueOf()) - 1].name);
        } else {
            return null
        }
    }
    const openAuction = (event: number) => {
        navigate("/Auction/" + event)
    }
    const list_auctions = () => {
        return auctions.map((item: auction) =>
        <Grid item sm={4} key={item.auctionId}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                    component="img"
                    height="300vh"
                    src={`http://localhost:4941/api/v1/auctions/${item.auctionId}/image`}
                    alt={item.title}>
                </CardMedia>
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                            {item.title}
                        </Typography>
                        <Typography>
                            <>
                            Category: {getCategory(item.categoryId)}
                            <br/>
                            Seller: {item.sellerFirstName} {item.sellerLastName}
                            <br/>
                            Reserve: ${item.reserve}
                            <br/>
                                {item.highestBid?"Highest Bid: " +"$"+ item.highestBid:"No Bids yet"}
                            <br/>
                            {calculate_days_till_close(item.endDate)}
                            </>
                        </Typography>

                        <Avatar src = {`http://localhost:4941/api/v1/users/${item.sellerId}/image`}/>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={() => openAuction(item.auctionId)}>View</Button>
                    </CardActions>
                </Card>
            </Grid>
        )
    }
    const queryChange = (event: any) => {
        setSearchQuery(event.target.value)
    }
    function findCategoryId(event: string)  {
        let id = -1
        categories.map((category) => {
            if (category.name == event) {
                id = category.categoryId
            }
        })
        return id;
    }
    const pageIndex = () => {
        let startIndex = (pageNumber-1)*9
        let endIndex = (pageNumber*9)
        if (endIndex > auctionLength) {
            endIndex = auctionLength
        }
        return <p>Index: {startIndex}-{endIndex}</p>

    }

    const updateAuctions = () => {
        let comboQuery = ""
        selectedCategories.map((category) => {
            // @ts-ignore
            comboQuery += "&categoryIds=" + (findCategoryId(category))
        })
        if (openClosed) {
            comboQuery += ("&status=" + openClosed)
        }
        comboQuery += ("&sortBy=" + sortBy)
        comboQuery += ("&startIndex=" + ((pageNumber-1)*9))
        comboQuery += ("&count=" + 9)
        axios.get('http://localhost:4941/api/v1/auctions?q=' + searchQuery + comboQuery)
            .then((response) => {
                setAuctions(response.data.auctions)
                setErrorFlag(false)
                setErrorMessage("")
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.response.statusText)
            })
    }

    return (

            <main>
                {/* Hero unit */}
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        pt: 8,
                        pb: 6,
                    }}
                >

                    <Container maxWidth="sm">
                        <div>
                            <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel id="demo-multiple-chip-label">Categories</InputLabel>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    value={selectedCategories}
                                    onChange={handleChange}
                                    input={<OutlinedInput id="select-multiple-chip" label="categories" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value : Category) => (
                                                // @ts-ignore
                                                <Chip key={value.categoryId} label={value} />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {categories.map((category) => (
                                        <MenuItem
                                            key={category.categoryId}
                                            value={category.name}
                                        >
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <FormControl sx={{ m: 1, minWidth: 300 }}>
                                <InputLabel id="demo-simple-select-autowidth-label">Filter</InputLabel>
                                <Select
                                    labelId="demo-simple-select-autowidth-label"
                                    id="demo-simple-select-autowidth"
                                    value={openClosed}
                                    onChange={handleOpenClosed}
                                    autoWidth
                                    label="Age"
                                >
                                    <MenuItem value="">
                                        All
                                    </MenuItem>
                                    <MenuItem value={"OPEN"}>Open</MenuItem>
                                    <MenuItem value={"CLOSED"}>Closed</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <FormControl sx={{ m: 1, minWidth: 300 }}>
                                <InputLabel id="SortBy">Sort by</InputLabel>
                                <Select
                                    labelId="SortBy"
                                    id="SortBy"
                                    value={sortBy}
                                    onChange={handleSortBy}
                                    autoWidth
                                    label="SortBy"
                                    defaultValue={"CLOSING_SOON"}
                                >
                                    <MenuItem value={"CLOSING_SOON"}>Closing Soon</MenuItem>
                                    <MenuItem value={"CLOSING_LAST"}>Closing Last</MenuItem>
                                    <MenuItem value={"ALPHABETICAL_ASC"}>Alphabetically</MenuItem>
                                    <MenuItem value={"ALPHABETICAL_DESC"}>Reverse Alphabetically</MenuItem>
                                    <MenuItem value={"BIDS_ASC"}>Bid Price</MenuItem>
                                    <MenuItem value={"BIDS_DESC"}>Descending Bid Price</MenuItem>
                                    <MenuItem value={"RESERVE_ASC"}>Reserve Price</MenuItem>
                                    <MenuItem value={"RESERVE_DESC"}>Descending Reserve Price</MenuItem>

                                </Select>
                            </FormControl>
                        </div>
                        <div className="form-outline">
                            <FormControl sx={{ m: 1, minWidth: 300 }}>
                                <TextField id="searchQuery" label="Search Auction" variant="outlined" onChange={queryChange} />
                                <IconButton size="large" color="primary" type="submit" sx={{ p: '10px' }} aria-label="search" onClick={updateAuctions}>
                                    <SearchIcon />
                                </IconButton>
                            </FormControl>
                        </div>
                    </Container>
                </Box>
                <Container sx={{py: 5}} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={2}>
                        {list_auctions()}
                    </Grid>
                </Container>
                <Pagination count={numOfPages} size="large" onChange={handlePagination} showFirstButton showLastButton />
                {pageIndex()}
                <br/><br/>
            </main>

    );
}

export default Auctions;
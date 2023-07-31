import Header from "./Header";
import * as React from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {Avatar, Box, Modal, SelectChangeEvent, TextField, Theme, useTheme} from "@mui/material";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import {useUserStore} from "../store";
import {stringify} from "querystring";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const AuctionDetails = () => {
    const navigate = useNavigate();
    // @ts-ignore
    const getUser = useUserStore(state => state.user)
    // @ts-ignore
    const setUser = useUserStore(state => state.setUser)

    const [auction, setAuction] = React.useState<auction>({
        auctionId: -1,
        title: "",
        description: "",
        endDate: "",
        image_filename: "",
        reserve: -1,
        sellerId: -1,
        sellerFirstName: "",
        sellerLastName: "",
        categoryId: -1,
        numBids: -1,
        highestBid: -1
    })
    const [open, setOpen] = React.useState(false);
    const [openLogin, setLoginOpen] = React.useState(false);

    const handleOpen = () => {
        if (getUser.userId != -1) {
            setOpen(true);
        } else {
            setLoginOpen(true);
        }
    }
    const handleClose = () => {
        setOpen(false);
        setLoginOpen(false);
        setModalErrorFlag(false)
        setModalErrorMessage("")
    }
    const [bids, setBids] = React.useState<Array<Bid>>([])
    let [similarSellerAuctions, setSimilarSellerAuctions] = React.useState<Array<auction>>([])
    let [similarCategoryAuctions, setSimilarCategoryAuctions] = React.useState<Array<auction>>([])
    const [rows, setRows] = React.useState<Array<localBid>>([])
    const [categories, setCategories] = React.useState<Array<Category>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [modalErrorFlag, setModalErrorFlag] = React.useState(false)
    const [modalErrorMessage, setModalErrorMessage] = React.useState("")
    const params = useParams()
    let similarAuctions: auction[] = []


    React.useEffect(() => {
        getAuction()
    }, [auction])

    React.useEffect(() => {
        createRows()
    }, [bids])


    const getSimilarSellerAuctions = () => {
        if (auction.categoryId != -1) {
            axios.get('http://localhost:4941/api/v1/auctions?categoryIds=' + auction.categoryId)
                .then((response) => {
                    setSimilarSellerAuctions(response.data.auctions)
                    setErrorFlag(false)
                    setErrorMessage("")
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.response.statusText)
                })
        }


    }
    const updateSimilarAuctions = () => {
        getSimilarSellerAuctions()
        getSimilarCategoryAuctions()
        similarCategoryAuctions.forEach((auction: auction) => {
            similarSellerAuctions.forEach((sellerAuction: auction) => {
                if (auction.auctionId == sellerAuction.auctionId) {
                    const index = similarSellerAuctions.indexOf(sellerAuction)
                    if (index > -1) {
                        similarSellerAuctions.splice(index, 1);
                    }
                }
            })
        })
        similarAuctions = similarSellerAuctions.concat(similarCategoryAuctions);

        similarAuctions.forEach((auction: auction) => {
            if (auction.auctionId == parseInt(params.id as string)){
                const index = similarAuctions.indexOf(auction)
                if (index > -1) {
                    similarAuctions.splice(index, 1);
                }
            }
        });
    }

    const getSimilarCategoryAuctions = () => {
        if (auction.sellerId != -1) {
            axios.get('http://localhost:4941/api/v1/auctions?sellerId=' + auction.sellerId)
                .then((response) => {
                    setSimilarCategoryAuctions(response.data.auctions)
                    setErrorFlag(false)
                    setErrorMessage("")
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.response.statusText)
                })
        }
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

    const getBids = () => {
        axios.get('http://localhost:4941/api/v1/auctions/' + params.id + '/bids')
            .then((response) => {
                setBids(response.data)
                createRows()
            })
    }
    const createRows = () => {
        let localRows = bids.map((Bid) =>
            (createData(Bid.bidderId, Bid.firstName, Bid.lastName, Bid.amount, Bid.timestamp)
        ))
        setRows(localRows)
    }

    const getAuction = () => {
        axios.get('http://localhost:4941/api/v1/auctions/' + params.id)
            .then((response) => {
                setAuction(response.data)
                getBids()
                getAllCategories()
                setErrorFlag(false)
                setErrorMessage("")
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.response.statusText)
            })
    }



    const getDate = (event: string) => {
        let date = new Date(event).toLocaleDateString()
        let time = new Date(event).toLocaleTimeString('NZ')
        return date + " " +  time

    }

    interface Column {
        id: 'profilePicture' | 'firstName' | 'lastName' | 'bid' | 'timestamp' ;
        label: string;
        minWidth?: number;
        align?: 'left' | 'right';
        format?: (value: number) => string;
    }

    const columns: readonly Column[] = [
        {
            id: 'profilePicture',
            label: 'Profile Picture',
            minWidth: 170,
            align: 'left',
        },
        { id: 'firstName', label: 'First Name', minWidth: 170 },
        { id: 'lastName', label: 'Last Name', minWidth: 100 },
        {
            id:'timestamp', label: 'Time Stamp', minWidth: 100
        },
        {
            id: 'bid',
            label: 'Bid Amount',
            minWidth: 170,
            align: 'right',
        },

    ];
    interface localBid {
        bidderId: number,
        profilePicture: JSX.Element;
        firstName: string;
        lastName: string;
        bid: string;
        timestamp: string;


    }

    function createData(
        bidderId: number,
        firstName: string,
        lastName: string,
        bidAmount: number,
        timestampOg: string,
    ): localBid {
        const profilePicture = <Avatar src = {"http://localhost:4941/api/v1/users/" + bidderId + "/image"}/>
        const bid = "$" + bidAmount
        const timestamp = getDate(timestampOg)
        return { profilePicture, firstName, lastName, bid, bidderId, timestamp};
    }


    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

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

            let total_days = (years_passed * 365) + (months_passed * 30.417) + days_passed;

            const result = ((years_passed == 1) ? years_passed + ' ' + yrsTxt[0] + ' ' : (years_passed > 1) ?
                    years_passed + ' ' + yrsTxt[1] + ' ' : '') +
                ((months_passed == 1) ? months_passed + ' ' + mnthsTxt[0] : (months_passed > 1) ?
                    months_passed + ' ' + mnthsTxt[1] + ' ' : '') +
                ((days_passed == 1) ? days_passed + ' ' + daysTxt[0] : (days_passed > 1) ?
                    days_passed + ' ' + daysTxt[1] : '');
            return "Closes in " + result;
        }
    }
    const openAuction = (event: number) => {
        navigate("/Auction/" + event)
    }
    const list_auctions = () => {
        updateSimilarAuctions()
        return (similarAuctions).map((item: auction) =>
            <Grid item sm={4} key={item.auctionId}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                        component="img"//
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
                                Reserve: {item.reserve}
                                <br/>
                                {item.highestBid?"Highest Bid: " + item.highestBid:"No Bids yet"}
                                <br/>
                                {calculate_days_till_close(item.endDate)}
                                <br/>
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
    const logInButton = () => {
        navigate('/login')
    }
    const bidValidation = () => {
        if (typeof userBid == "number") {
            if (userBid > 0) {
                if (rows[0]) {
                    if (userBid > parseInt((rows[0].bid).split("$").join(""))) {
                        submitBid()
                    } else {
                        setModalErrorFlag(true)
                        setModalErrorMessage("Your bid must be higher than " + rows[0].bid)
                    }
                } else {
                    submitBid()
                }
            }else {
                setModalErrorFlag(true)
                setModalErrorMessage("Your bid must be more than $0")
            }
        } else {
            setModalErrorFlag(true)
            setModalErrorMessage("Your bid must be a whole number")
        }
    }
    const submitBid = () => {
        axios.post('http://localhost:4941/api/v1/auctions/' + params.id + '/bids',
            {"amount": userBid}, {headers:{"X-Authorization" : getUser.token}})
            .then((response) => {
                handleClose()
            })

    }
    const [userBid, setUserBid] = React.useState(-1)
    const updateUserBid = (event: any) => {
        setUserBid(parseInt(event.target.value))
    }
    const bidOption = () => {
        if ((calculate_days_till_close(auction.endDate) != "Closed") && (getUser.userId != auction.sellerId)) {
            return (
                <div>
                    <Button variant="contained" onClick={handleOpen}>Bid</Button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="Bid"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="Bid" variant="h6" component="h2">
                                Place Bid on Current Auction
                            </Typography>
                            <br/>
                            {modalErrorFlag &&
                                <div style={{color: "red"}}>
                                    {modalErrorMessage}
                                </div>
                            }
                            <br/>
                            <TextField id="outlined-basic" label="Amount: $" variant="outlined" onChange={updateUserBid} />
                            <br/>
                            <Button variant="contained" onClick={bidValidation}>Submit Bid</Button>

                        </Box>
                    </Modal>
                    <Modal
                        open={openLogin}
                        onClose={handleClose}
                        aria-labelledby="Login"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                You must be Logged in to bid
                            </Typography>
                            <Button variant="contained" onClick={logInButton}>Log in</Button>
                        </Box>
                    </Modal>
                </div>
            )
        }
    }

    return (
        <>
            <Header/>
            {auction.auctionId > -1 &&
                <img src={`http://localhost:4941/api/v1/auctions/${auction.auctionId}/image`}></img>

            }
            <p>
                Title: {auction.title}
                <br/>
                <>End Date: {getDate(auction.endDate)}</>
                <br/>
                {auction.sellerId > -1 &&
                    <Avatar src={`http://localhost:4941/api/v1/users/${auction.sellerId}/image`}/>
                }
                Seller: {auction.sellerFirstName} {auction.sellerLastName}
                <br/>
                Category: {getCategory(auction.categoryId)}
                <br/>
                Description: {auction.description}
                <br/>
                Reserve: ${auction.reserve}
                <br/>
                Number of Bids: {auction.numBids}
                <br/>
                {rows[0]?
                    "Current Bid: " + rows[0].bid + " by " + rows[0].firstName + " " + rows[0].lastName:
                    "No Current Bids"}
                {rows[0]?rows[0].profilePicture:""}
            </p>
            {bidOption()}
            <br/>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.bid}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <Container sx={{py: 5}} maxWidth="md">
                {/* End hero unit */}
                <Grid container spacing={2}>
                    {list_auctions()}
                </Grid>
            </Container>
        </>

    )
}
export default AuctionDetails;
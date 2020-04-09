import React, {useState, useEffect} from 'react';

import { Paper, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TableContainer, TextField, InputAdornment, Input, Select, MenuItem, InputLabel, FormControl} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search';

const styles = makeStyles({
    root: {
        backgroundColor: 'white'
    },
    table: {
        maxHeight: 500
    },
    body: {
        overflow: 'auto'
    },
    searchBar: {
        display: 'flex',
        color: 'grey',
        justifyContent: 'flex-end',
        margin: 5,
        '& #search-bar': {
            alignSelf: 'flex-end',
            width: 200

        },
        '& svg': {
            paddingTop: 4,
            paddingRight: 5
        }
    }
})



const TableChart = (props) => { 
    
    const classes = styles();

    const [sortDirection, toggleSortDirection] = useState(1)
    const [sortBy, setSortBy] = useState("confirmed")
    const [filter, setFilter] = useState('')
    const [summary, setSummary] = useState({'confirmed': 0, 'deaths': 0, 'recovered': 0});

    useEffect(()=>{
        setTotals()
    },[])

    const changeSortBy = (sort) => {
        console.log(sort, sortBy)
        if (sortBy !== sort ) {
            setSortBy(sort)
        } else {
            console.log(sortDirection)
            toggleSortDirection(sortDirection*-1)
        }
    }

    const handleChange = e => {
        setFilter(e.target.value);
    }
    const setTotals = (data)=> {
        if (data) {
            let totalConfirmed = 0
            let totalDeaths = 0
            let totalRecovered = 0

            data.customList
            .forEach(state=>{
                totalConfirmed+= parseInt(state.confirmed);
                totalDeaths+= parseInt(state.deaths);
                totalRecovered+= parseInt(state.recovered);
            })
        
        
            return (
                <TableRow >
                    <TableCell style={{fontWeight: 'bold'}}>Total</TableCell>
                    <TableCell style={{fontWeight: 'bold'}} align="right">{totalConfirmed.toString().replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</TableCell>
                    <TableCell style={{fontWeight: 'bold'}} align="right">{totalDeaths.toString().replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</TableCell>
                    <TableCell style={{fontWeight: 'bold'}} align="right">{totalRecovered.toString().replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</TableCell>
                </TableRow>
            );
        }
    }

    const small = screen.width < 600
    console.log(small)
  
    return (
        <div className={classes.root}>
            {props.data && <TableContainer className={classes.table}>

                {/* <div className={classes.searchBar} style={{flexDirection: small ? 'column': 'row'}}>
    			

                <FormControl id="search-bar" >
                <InputLabel id="demo-simple-select-outlined-label">Select Region</InputLabel>
                    <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={filter}
                    onChange={handleChange}
                    label="Region"
                    >
                        <MenuItem value="">
                            <em>USA</em>
                        </MenuItem>
                        {props.data.customList .sort((a,b)=>{
                            if (a.state > b.state) {
                                return 1;
                            } else if (a.state < b.state) {
                                return -1;
                            } else
                                return 0;
                        })  
                        .map(state=>{
                            return <MenuItem value={state.state}>{state.state}</MenuItem>

                        })
                            
                        }
                        
                    </Select>
              
                    </FormControl>
                </div> */}
            <Table stickyHeader>
                <TableHead>
                    <TableRow role="checkbox">
                        <TableCell
								// data-tip="Sort by team name"
								onClick={() => changeSortBy("state")}
								>State
								
								<TableSortLabel
									active={sortBy === "state" ? true : false}
									direction={sortDirection === 1 ? "asc" : "desc"}
								/>
                        </TableCell>
                        <TableCell align="right" onClick={() => changeSortBy("confirmed")} >
								
								<TableSortLabel
									active={sortBy === "confirmed" ? true : false}
									direction={sortDirection === 1 ? "asc" : "desc"}
								/>Confirmed
                        </TableCell>
                        <TableCell align="right" onClick={() => changeSortBy("deaths")} >
								
								<TableSortLabel
									active={sortBy === "deaths" ? true : false}
									direction={sortDirection === 1 ? "asc" : "desc"}
                            />Deaths
                        </TableCell>
                        <TableCell align="right" onClick={() => changeSortBy("recovered")} >
								
								<TableSortLabel
									active={sortBy === "recovered" ? true : false}
									direction={sortDirection === 1 ? "asc" : "desc"}
                            />Recovered
                        </TableCell>
                    </TableRow>
                </TableHead>
                {!filter ? <TableBody className={classes.body}>
                    {
                        setTotals(props.data)
                    }
                    {props.data && 
                    props.data.customList
                    .sort((a,b)=>{
                        if (isNaN(parseInt(a[sortBy]))) {
                            if (a[sortBy] > b[sortBy]) {
                                return 1 * sortDirection;
                            } else if (a[sortBy] < b[sortBy]) {
                                return -1 * sortDirection;
                            } else
                                return 0;
                        } else {
                            if (parseInt(a[sortBy]) > parseInt(b[sortBy])) {
                                return -1 * sortDirection;
                            } else if (parseInt(a[sortBy]) < parseInt(b[sortBy])) {
                                return 1 * sortDirection;
                            } else
                                return 0;
                        }
                    })  
                    // .filter(arr=>{
                    //     if (arr.region) {
                    //         if (arr.state.toLowerCase().indexOf(filter.toLowerCase()) != -1 ||arr.region.toLowerCase().indexOf(filter.toLowerCase()) != -1 ) {
                    //             return true
                    //         }
                    //     }
                        
                    // })
                    .map(state=>{
                        console.log(state)
                        return <TableRow key={state.id}>
                            <TableCell>{state.state}</TableCell>
                            <TableCell align="right">{state.confirmed.replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</TableCell>
                            <TableCell align="right" >{state.deaths.replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</TableCell>
                            <TableCell align="right">{state.recovered.replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</TableCell>

                        </TableRow>
                    })
                    }
                </TableBody> : 
                <TableBody className={classes.body}>
                    {
                        setTotals(props.countyData)
                    }
                    {props.data && 
                    props.data.customList
                    .sort((a,b)=>{
                        if (isNaN(parseInt(a[sortBy]))) {
                            if (a[sortBy] > b[sortBy]) {
                                return 1 * sortDirection;
                            } else if (a[sortBy] < b[sortBy]) {
                                return -1 * sortDirection;
                            } else
                                return 0;
                        } else {
                            if (parseInt(a[sortBy]) > parseInt(b[sortBy])) {
                                return -1 * sortDirection;
                            } else if (parseInt(a[sortBy]) < parseInt(b[sortBy])) {
                                return 1 * sortDirection;
                            } else
                                return 0;
                        }
                    })  
                    // .filter(arr=>{
                    //     if (arr.region) {
                    //         if (arr.state.toLowerCase().indexOf(filter.toLowerCase()) != -1 ||arr.region.toLowerCase().indexOf(filter.toLowerCase()) != -1 ) {
                    //             return true
                    //         }
                    //     }
                        
                    // })
                    .map(state=>{
                        console.log(state)
                        return <TableRow key={state.id}>
                            <TableCell>{state.state}</TableCell>
                            <TableCell align="right">{state.confirmed.replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</TableCell>
                            <TableCell align="right" >{state.deaths.replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</TableCell>
                            <TableCell align="right">{state.recovered.replace( /\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</TableCell>

                        </TableRow>
                    })
                    }
                </TableBody>}
            </Table>
            </TableContainer>}
        </div>
    );
}

export default TableChart;
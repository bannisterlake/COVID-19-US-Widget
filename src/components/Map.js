import React, { useState, useEffect } from "react";

import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup
  } from "react-simple-maps";
  
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
  
import ReactTooltip from 'react-tooltip'

import { makeStyles } from "@material-ui/styles";

import Tooltip from './Tooltip'

import { geoCentroid } from "d3-geo";

const geoUrl = './data/states-10m.json';
const countyUrl = './data/countymap.json';

const styles=makeStyles({
    map: {

    },
    resetButton: {
        backgroundColor: 'white', 
        padding: 5,
        paddingTop: 6,
        textAlign: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        width: '80px',
        maxWidth: '120px',
        cursor: 'pointer',
        position: 'absolute',
        border: 'none',
        zIndex: 20,
        right: 10,
        bottom: 10
    },
    legend: {
        position: 'absolute',
        zIndex: 100,
        bottom: 10,
        left: 10, 
    },
    legendTitle: {
        fontWeight: 'bold',
        fontSize: '20px',
    },
    legendBox: {
        backgroundColor: 'white',
        padding: 5,
        marginBottom: 10, 
    },
    legendList: {
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
        '& div': {
            display: 'flex',
            alignItems: 'center'

        }
    },
    bullet: {
        height: '8px', 
        width: '8px',
        backgroundColor: 'red', 
        borderRadius: '50%', 
        border: '1px solid slategray',
        marginRight: 10
    },
    legendToggle: {
        backgroundColor: 'white', 
        padding: 5,
        paddingTop: 6,
        textAlign: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        width: '120px',
        maxWidth: '120px',
        cursor: 'pointer'

    },
    legendToggleSm: {
        backgroundColor: 'white', 
        padding: 4,
        paddingTop: 5,
        textAlign: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        width: '80px',
        maxWidth: '80px',
        cursor: 'pointer'


    }
})

// #ede5cf,#e0c2a2,#d39c83,#c1766f,#a65461,#813753,#541f3f

// const scale = ['#94939f', '#ede5cf','#d39c83','#a65461','#813753','#541f3f']
// const scale = ['#94939f','#fef0d9','#fdcc8a','#fc8d59','#e34a33','#b30000']
const scale = ['#94939f', '#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15']

const Map = (props) => {

    const classes = styles()
    const [center, setCenter] = useState([-100,36])
    const [zoom, setZoom] = useState(6.5)
    const [show, toggleShow] = useState((screen.width > 500 && screen.height > 600) ? true: false)
    const [clickedState, setClickedState] = useState(null)
    useEffect(() => {
        setTimeout(() => {
            ReactTooltip.rebuild()
        }, 1000);        
    }, [clickedState])


    const handleReset = () => {
        setZoom(6.5)
        setCenter([-100,36])
        setClickedState(null)
        props.reset()
    }

    const getStateData = (state) => {
        try {

            const covidData =props.data.customList.find(el=>{
                return el.state === state
            })
            return covidData
        } catch(e) {

        }
    }

    const getCountyData = (countyID) => {
        try {

            const covidData = props.countyData.find(el=>{
            return el.fips === parseInt(countyID)
        })
            return covidData
        } catch(e) {

        }
    }

    const getFill = (state) => {
        
        let results = getStateData(state)
        if (results) {
            let color = scale[5]
            if (results.confirmed < 100) {
                color = scale[1];
            } else if (results.confirmed < 1000) {
                color = scale[2]; 

            } else if (results.confirmed < 4999) {
                color = scale[3]
            } else if (results.confirmed < 50000) {
                color =  scale[4];
            }
            return color; 


        } else 
        return scale[0]
        
    }

    const getCountyFill = (countyID) => {
        // console.log(props.countyData)
        const results = props.countyData.find(county=>{
            return county.fips === parseInt(countyID)
        })
        // console.log(results)
        if (results) {
            let color = scale[5]
            if (results.confirmed === 0) {
                color = scale[0]
            } else if (results.confirmed < 100) {
                color = scale[1];
            } else if (results.confirmed < 1000) {
                color = scale[2]; 

            } else if (results.confirmed < 4999) {
                color = scale[3]
            } else if (results.confirmed < 50000) {
                color =  scale[4];
            }
            return color; 



        } else 
        return scale[0]

    }

    const handleClick = (centroid, state) => {
        setCenter(centroid)
        setZoom(15)
        setClickedState(state)
        
    }


    return (
        <>
            <button className={classes.resetButton} onClick={handleReset}>Zoom Out</button>

            <TransformComponent
            >
                <ComposableMap projection="geoAlbersUsa" projectionConfig={{scale: 125}} 
                height={450}

                >
                    <ZoomableGroup disablePanning disableZooming zoom={zoom} center={center}>
                        <Geographies geography={geoUrl}>
                            {({geographies}) =>
                                geographies.map(geo=>{
                                    const centroid = geoCentroid(geo);
                                    // console.log(centroid)
                                    // const cur = allStates.find(s => s.val === geo.id);
                                    const fill = getFill(geo.properties.name)
                                    return <Geography 
                                    key={geo.rsmKey}
                                    geography={geo}
                                    center={centroid}
                                    fill={fill}
                                    stroke="#d9d9d9"
                                    strokeWidth="0.1"
                                    data-for={'stateTip'}
                                    data-tip={`${geo.properties.name}`}
                                    onClick={()=> handleClick(centroid, geo.properties.name)        }
                                    style={{
                                        default:{
                                            outline: 'none'
                                        }, 
                                        hover: {
                                            outline: 'none',
                                            fill: fill,
                                            opacity: 0.8,
                                            strokeWidth: '0.2'

                                        },
                                        pressed: {
                                            outline: 'none',
                                            fill: fill,

                                        }

                                    }}
                                    />
                                })
                            }
                            
                        </Geographies>
                        { clickedState && 
                            <Geographies style={{zIndex: 30}} geography={countyUrl}>
                            {({geographies})=>(
                    geographies.map(geo=>{
                        if (clickedState.toLowerCase() === geo.properties.STATENAME.toLowerCase()) {
                            // console.log(geo)
                            const fill = getCountyFill(geo.properties.GEOID)
                        return (
                            <Geography 
                                key={geo.properties.GEOID}
                                fill={fill}
                                stroke="grey"
                                strokeWidth={0.05}
                                data-tip={`${geo.properties.NAME}|${geo.properties.GEOID}`}
                                data-for={"countyTip"}
                                geography={geo}
                                onClick={e=>getCountyData(geo.properties)}
                                style={{
                                    default: {
                                        outline: 'none'
                                    },
                                    hover: {
                                        opacity: 0.8,
                                        outline: 'none'
                                    },
                                    clicked: {
                                        outline: 'none'
                                    }
                                }}
                                
                            />)
                        }
                    }
                    
                    )
                    )}
                            </Geographies>
                        }
                    </ZoomableGroup>
                </ComposableMap>
                <div className={classes.legend}>
                {show && 
                    <div className={classes.legendBox}>
                        <div style={{fontWeight: 'bold', fontSize: (screen.width > 500 && screen.height > 600) ? '20px' : '16px'}} className={classes.legendTitle}>Reported Cases</div>
                        <div className={classes.legendList}>
                            <div>
                                <div className={classes.bullet} style={{backgroundColor: scale[0]}}/> <div>0 or no data</div>
                            </div>
                            <div>
                                <div className={classes.bullet} style={{backgroundColor: scale[1]}}/> <div>1-99</div>
                            </div>
                            <div>
                                <div className={classes.bullet} style={{backgroundColor: scale[2]}}/> <div>100-999</div>
                            </div><div>
                                <div className={classes.bullet} style={{backgroundColor: scale[3]}}/> <div>1,000-4,999</div>
                            </div><div>
                                <div className={classes.bullet} style={{backgroundColor: scale[4]}}/> <div>5,000-49,999</div>
                            </div><div>
                                <div className={classes.bullet} style={{backgroundColor: scale[5]}}/> <div>50,000+</div>
                            </div>
                        </div>

                    </div>}
                    <div onClick={()=>toggleShow(!show)} className={(screen.width > 500 && screen.height > 600) ?classes.legendToggle: classes.legendToggleSm}>{show ? 'Hide' : 'Show'} Legend</div>
                </div>
            </TransformComponent>
            <ReactTooltip
                id="stateTip" 
                overridePosition={ (
                    { left, top },
                    currentEvent, currentTarget, node) => {
                    const d = document.documentElement;
                    left = Math.min(d.clientWidth - node.clientWidth, left);
                    top = Math.min(d.clientHeight - node.clientHeight, top);
                    left = Math.max(0, left);
                    top = Math.max(20, top);
                    return { top, left }}
                }
                effect="solid" 
                arrowColor='transparent' 
                textColor={'#f2f2f2'} 
                backgroundColor={'#808080'} 
                getContent={(data)=>{
                if (data) {
                    const countryName = data
                    return <Tooltip name={countryName} data={getStateData(countryName)} />

                }
            }}/>
            <ReactTooltip id="countyTip" overridePosition={ (
                    { left, top },
                    currentEvent, currentTarget, node) => {
                    const d = document.documentElement;
                    left = Math.min(d.clientWidth - node.clientWidth, left);
                    top = Math.min(d.clientHeight - node.clientHeight, top);
                    left = Math.max(0, left);
                    top = Math.max(20, top);
                    return { top, left }}
                }
                effect="solid" 
                arrowColor='transparent' 
                textColor={'#f2f2f2'} 
                backgroundColor={'#808080'} 
                getContent={(data)=>{
                if (data) {
                    const countyName = data.split('|')[0]
                    const countyID = data.split('|')[1]
                    return <Tooltip name={`${countyName} County`} data={getCountyData(countyID)} />

                }
            }}/>
</> 
    )
}

export default Map;

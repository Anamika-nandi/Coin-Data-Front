import axios from "axios";
import Alert from '@mui/material/Alert';
import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import styles from './home.module.css';

export default function Home(){
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [coinData, setCoinData] = useState([]);
    const [alertMsg, setAlertMsg] = useState("")

    const getData=()=>{
        axios.get("http://localhost:3001/coin/")
        .then((res)=>{
            setCoinData(res.data.data)
        }).catch((err)=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        getData()
    },[])
    const currDate = new Date()

    const columns =[
    {
        dataField: 'name',
        text:'Coin Name',
        headerStyle:{border: '1px solid black', textAlign:"center"}
    },
    {
        dataField: 'price',
        text:'Price',
        headerStyle:{border: '1px solid black', textAlign:"center"}
    },
    {
        dataField: 'time',
        text:'Time',
        headerStyle:{border: '1px solid black', textAlign:"center"}
    }
    ]

    const postData=()=>{
        let beautifiedPrice = 0.0
        if(price>=1){
            const numPrice = parseFloat(price)
            beautifiedPrice = (Math.round(numPrice * 100) / 100).toFixed(2)
        }else{
            const numPrice = parseFloat(price)
            beautifiedPrice = (numPrice).toFixed(7)
        }
        const body ={
            name,
            price:beautifiedPrice.toString(),
            time: `${currDate.getFullYear()}-${currDate.getMonth()+1}-${currDate.getDate()} ${currDate.getHours()}:${currDate.getMinutes()}:${currDate.getSeconds()}`
        }

        axios.post("http://localhost:3001/coin/",body)
        .then((res)=>{
            getData()
        })
        .catch((err)=>{
            console.log(err.response.data.error)
            if(err.response?.data?.error==="Limit to add 50 coins reached"){
                setAlertMsg("Limit to add 50 coins reached")
            }
        })
    }

    const handleSubmit=(e)=>{
        e.preventDefault()
        setName("");
        setPrice("");
        setAlertMsg("");
        postData()
    }
    return(
        <div className={styles.wrapper}>
             {alertMsg!==""&&<Alert severity="error">{alertMsg}</Alert>}
            <div className={styles.ipWrapper}>
            <input type="text" value = {name} placeholder="Enter coin name" className={styles.input}
            onChange={(e)=>{setName(e.target.value)}}/>
            <input type="number" placeholder="Enter price" className={styles.input} value={price}
            step="0.1"
            onChange={(e)=>{
                const val = e.target.value
                    setPrice(val)}}/>
            <input type="submit" value="Submit" className={styles.btn}
            onClick={handleSubmit}/>
            </div>
            <div className={styles.tebleWrapper}>
            {coinData?.length!=0 && <BootstrapTable
                    bordered={true}
                    rowStyle={{border: '1px solid black'}}
                   keyField="id" columns={columns} data={coinData}/>}
                </div>
    </div>)
}
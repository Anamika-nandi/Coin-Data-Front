import axios from "axios";
import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import styles from './home.module.css';

export default function Home(){
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [coinData, setCoinData] = useState([]);

    const getData=async()=>{
        const res = await axios.get("http://localhost:3001/coin/")
        setCoinData(res.data.data)
    }

    useEffect(()=>{
        getData()
    },[])
    const currDate = new Date()
    const data=[{
        id:1,
        name:"BTC",
        price:"80.23822",
        time: `${currDate.getFullYear()}-${currDate.getMonth()+1}-${currDate.getDate()} ${currDate.getHours()}:${currDate.getMinutes()}:${currDate.getSeconds()}`
    }]
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
        const body ={
            name,
            price,
            time: `${currDate.getFullYear()}-${currDate.getMonth()+1}-${currDate.getDate()} ${currDate.getHours()}:${currDate.getMinutes()}:${currDate.getSeconds()}`
        }

        axios.post("http://localhost:3001/coin/",body)
        .then((res)=>{
            getData()
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const handleSubmit=(e)=>{
        e.preventDefault()
        postData()
    }
    return(
        <div className={styles.wrapper}>
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
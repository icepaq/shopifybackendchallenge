import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'

export default function Home() {
    const [products, setProducts] = useState([]); // Used to displau products as HTML elements
    const [isLoaded, setIsLoaded] = useState(false); // Used to avoid infinite loop in useEffect.
    const [productDataForCSV, setProductDataForCSV] = useState([]); // Used to store product data for CSV export

    let productData = {};

    let newName = '';
    let newPrice = '';

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {

        // Avoid infinite loop
        if(isLoaded) {
            return;
        }

        setIsLoaded(true);

        fetch('/api/GetProducts').then(res => res.json()).
            then(data => {

                let productList = [];
                let tempProductCSV = productDataForCSV;

                for(let i = 0; i < data.length; i++) {

                    let name = data[i].name;
                    let price = data[i].price;

                    // Storing product data updating purposes
                    productData[data[i]._id] = {price: price, name: name};

                    // Storing product data for CSV export
                    tempProductCSV.push([data[i]._id, name, price]);
                    
                    productList.push(
                        <div className={styles.product} key={data[i]._id}>
                            Name <input className={styles.productName} placeholder={name} _id={data[i]._id} onChange={nameChange}/> <br />
                            Price <input className={styles.productPrice} placeholder={price} _id={data[i]._id} onChange={priceChange}/>

                            <div className={styles.button} _id={data[i]._id} name={name} price={price} onClick={editProduct}>
                                Update Product
                            </div>
                            <div className={styles.button} _id={data[i]._id} onClick={deleteProduct}>
                                Delete Product
                            </div>
                        </div>
                    );
                }

                setProductDataForCSV(tempProductCSV);
                setProducts(productList);
            });
    });

    // Store new name in as a state variable
    const nameChange = (e) => {
        let id = e.target.getAttribute('_id');
        let name = e.target.value;

        productData[id].name = name;
    }

    // Store new price in as a state variable
    const priceChange = (e) => {
        let id = e.target.getAttribute('_id');
        let price = e.target.value;

        productData[id].price = price;   
    }

    // Update product in database. Queries id from the attribute and parses the name and price from the state variable.
    const editProduct = async (e) => {
        const _id = e.target.getAttribute('_id');
        const name = productData[_id].name;
        const price = productData[_id].price;
        
        const r = await fetch("/api/EditProduct?id=" + _id + "&name=" + name + "&price=" + price);
        const res = await r.json();
    }

    // Delete product from database. Queries id from the attribute.
    const deleteProduct = async (e) => {
        const _id = e.target.getAttribute('_id');
        const r = await fetch("/api/DeleteProduct?id=" + _id);
        const res = await r.json();
        
        location.reload();
    }

    const newNameChange = (e) => {
        newName = e.target.value;
    }

    const newPriceChange = (e) => {
        newPrice = e.target.value;
    }

    const newProduct = async () => {
        const r = await fetch("/api/NewProduct?name=" + newName + "&price=" + newPrice);
        const res = await r.json();
        location.reload();
    }

    const exportCSV = () => {

        let csvContent = "data:text/csv;charset=utf-8,"; // CSV header

        productDataForCSV.forEach(rowArray => { // Loop through each product
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });

        let encodedUri = encodeURI(csvContent); // Encode CSV content as a URI
        window.open(encodedUri); // Download CSV file
    }

    return (
        <>
            {products}
            <h1>New Product</h1>
            
            <div className={styles.newProduct}>
                <input className={styles.newProductName} placeholder="Name" onChange={newNameChange}/> <br />
                <input className={styles.newProductPrice} placeholder="Price" onChange={newPriceChange}/>

                <div className={styles.button} onClick={newProduct}>Add Product</div>
            </div>

            <h1>Export CSV</h1>
            <div className={styles.button} onClick={exportCSV}>Export CSV</div>
        </>
    )
}

import React, { useState, useEffect } from 'react';
import Dropdown from './dropdownName';
import { getCollections } from './common';

export const DownloadFromFirebase = () => {
    // 獲得collection的名稱
    // 預設值為test
    const [collectionName, setCollectionName] = useState("test");
    // 將input的value綁定到state
    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setCollectionName(event.target.value);
    // };

    //  變數collections 方法setCollections
    const [collections, setCollections] = useState<Array<{ data: any; id: string }>>([]);

    useEffect(() => {
        getCollections(setCollections, collectionName);
    }, [collectionName]);

    const collectionsJSON = JSON.stringify(collections);
    const blob = new Blob([collectionsJSON], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = collectionName + ".json";

    return (
        <div className='padding'>
            <h1>下載json (從Firebase)</h1>
            {/* <label htmlFor="downloadCollectionName" >輸入collection名稱</label>
            <input type="text" id='downloadCollectionName' onChange={handleChange} /> */}


            <Dropdown onSelect={(collectionName) => setCollectionName(collectionName)} />

            <button onClick={() => link.click()}>Download</button>
        </div>
    );
};

// Upload Json to Firestore
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/init-firebase";
import React from "react";
import Dropdown from "./dropdownName";

// 嘗試獲得collection的名稱 (失敗 Web端無法 只能在node.js端)
// const admin = require("firebase-admin");
// admin.initializeApp();
// const test = admin.firestore();
// console.log(test.listCollections());


// 上傳json檔案
async function updateArticle(collectionName: string, article: any) {
    console.log(collectionName, article)
    // 上傳一個一個的文章 所以要走訪每一個文章
    console.log(article.length)
    for (let i = 0; i < article.length; i++) {
        // 取得文章的id
        const articleId = article[i].id;
        console.log(articleId)
        // 取得文章的資訊
        const article_content = article[i].data;
        console.log(article_content)

        const docInfo = doc(db, collectionName, articleId);
        // 將文章資訊更新到Firestore
        await updateDoc(docInfo, article_content);
    }
}

export const UploadJsonWithArticleId = () => {
    // 要上傳的文章
    const [article, setArticleExample] = useState();
    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = (evt) => {
                setArticleExample(JSON.parse(evt.target?.result as string));
                console.log(JSON.parse(evt.target?.result as string))
            };
        }
    };

    // 預設值為test
    const [collectionName, setCollectionName] = useState("test");
    // 將input的value綁定到state
    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setCollectionName(event.target.value);
    // };

    return (
        <div className="uploadContainer">
            <h1>上傳json (從Firebase)</h1>
            <div className="padding">
                <label htmlFor="chooseJsonFile" >選擇上傳的Json檔案</label>
                <input type="file" id="chooseJsonFile" onChange={handleFileInput} />
            </div>
            <div className="padding">
                {/* <label htmlFor="uploadCollectionName" >輸入要上傳到的collection名稱</label>
                <input type="text" id="uploadCollectionName" onChange={handleChange} /> */}

                <Dropdown onSelect={(selectedCollectionName) => setCollectionName(selectedCollectionName)} />
                <button onClick={() => updateArticle(collectionName, article)}>Upload</button>
            </div>
        </div>
    );
};
import React, { useState, useEffect } from "react";
import uuid from "react-uuid";

const DropdownFirestoreCollectionName = (props: { onSelect: (collectionName: string) => void }) => {
    const [collections, setCollections] = useState([]);

    const [selectedOption, setSelectedOption] = useState("");

    useEffect(() => {
        fetch("http://localhost:3001/collections")
            .then((res) => res.json())
            .then((data) => {
                setCollections(data);
            });
        // console.log("update")
    }, []);

    return (
        <>
            <h1>現有的CollectionName</h1>
            <select title="Select Collection" value={selectedOption} onChange={(event) => {
                setSelectedOption(event.target.value);
                props.onSelect(event.target.value);
            }}>
                {collections.map((collection) => (
                    <option key={uuid()} value={collection["id"]}>
                        {collection["id"]}
                    </option>
                ))}
            </select>
        </>
    );
};


export default DropdownFirestoreCollectionName;

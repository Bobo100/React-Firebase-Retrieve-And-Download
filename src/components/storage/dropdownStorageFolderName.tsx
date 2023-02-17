import React, { useState, useEffect, useCallback } from "react";
import { getStorage, ref, listAll, StorageReference } from "firebase/storage";
import uuid from "react-uuid";

export const DropdownStorageFolderName = (props: { onSelect: (collectionName: string) => void }) => {
    const [selectedOption, setSelectedOption] = useState("");

    // const [folderName, setFolderName] = useState<StorageReference[]>([]);
    const [folderName, setFolderName] = useState<string[]>([]);


    const fetchFolderName = useCallback(() => {
        const storage = getStorage();
        const storageRef = ref(storage);

        listAll(storageRef)
            .then((res) => {
                const folderNames = res.prefixes.map((folderRef) => folderRef.name);
                setFolderName(folderNames);
            })
            .catch((error) => {
                console.log("Error listing folders:", error);
            });
    }, []);

    useEffect(() => {
        fetchFolderName();
    }, [fetchFolderName]);

    // 下面會執行兩次，但是上面只會執行一次 (下面的是錯誤的)
    // useEffect(() => {
    //     const storage = getStorage();
    //     const storageRef = ref(storage);
    //     console.log("test")
    //     listAll(storageRef)
    //         .then((res) => {
    //             console.log(res.prefixes.length)
    //             res.prefixes.forEach((folderRef) => {
    //                 setFolderName((prev) => [...prev, folderRef.name]);
    //                 console.log("Folder name:", folderRef.name);
    //             });
    //         }).catch((error) => {
    //             console.log("Error listing folders:", error);
    //         });        
    // }, []);

    // const [folderName, setFolderName] = useState<string[]>([]);
    //     useEffect(() => {
    //         const storage = getStorage();
    //         const storageRef = ref(storage);
    //         listAll(storageRef)
    //             .then((res) => {
    //                 const folderNames = new Set<string>();
    //                 res.prefixes.forEach((folderRef) => {
    //                     folderNames.add(folderRef.name);
    //                 });
    //                 setFolderName(Array.from(folderNames));
    //             })
    //             .catch((error) => {
    //                 console.log("Error listing folders:", error);
    //             });
    //     }, []);

    // render dropdown component with "folderName"
    return (
        <>
            <select title="Select Collection" value={selectedOption} onChange={(event) => {
                setSelectedOption(event.target.value);
                props.onSelect(event.target.value);
            }}>
                <option value=""></option>

                {folderName.map((name) => (
                    <option key={uuid()} value={name}>
                        {name}
                    </option>
                ))}
            </select>
        </>
    );
}

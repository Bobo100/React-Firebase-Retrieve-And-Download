// 兩層下拉選單，選擇資料夾
import React, { useState, useEffect } from "react";
import { getStorage, ref, listAll, StorageReference, getMetadata } from "firebase/storage";
import uuid from "react-uuid";

type FolderList = {
    [key: string]: string[];
};

const storage = getStorage();
const storageRef = ref(storage);

const getAllSubfolderNames = async (currentRef: StorageReference): Promise<string[]> => {
    const { prefixes } = await listAll(currentRef);
    if (prefixes.length === 0) {
        return [];
    }
    const folderNames = await Promise.all(
        prefixes.map(async (folderRef) => {
            const folderName = folderRef.name;
            const subfolderNames = await getAllSubfolderNames(folderRef);
            return [folderName, ...subfolderNames];
        })
    );
    return folderNames.flat();
};

const getFolders = async () => {
    const { prefixes } = await listAll(storageRef);
    const folderList: FolderList = {};
    const promises = prefixes.map(async (folderRef) => {
        const folderName = folderRef.name;
        const subfolderNames = await getAllSubfolderNames(folderRef);
        folderList[folderName] = subfolderNames;
    });
    await Promise.all(promises);
    return folderList;
};

export const DoubleDropDown = () => {
    const [folderList, setFolderList] = useState<FolderList>({});
    const [selectedFolder, setSelectedFolder] = useState<string>("");
    const [subFolderList, setSubFolderList] = useState<string[]>([]);

    useEffect(() => {
        const fetchFolderList = async () => {
            const folders = await getFolders();
            setFolderList(folders);
        };
        fetchFolderList();
    }, []);

    const handleSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const folderName = event.target.value;
        setSelectedFolder(folderName);
        setSubFolderList(folderList[folderName] ?? []);
    };

    return (
        <div>
            <select onChange={handleSelect}>
                <option value="">Select a folder</option>
                {Object.keys(folderList).map((folderName) => (
                    <option key={folderName} value={folderName}>
                        {folderName}
                    </option>
                ))}
            </select>
            {selectedFolder && (
                <select title="Select Collection">
                    {subFolderList.map((subFolderName) => (
                        <option key={uuid()} value={subFolderName}>
                            {subFolderName}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

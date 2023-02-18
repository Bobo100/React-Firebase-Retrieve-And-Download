// 兩層下拉選單，選擇資料夾
import React, { useState, useEffect, useCallback } from "react";
import { getStorage, ref, listAll, StorageReference, getMetadata } from "firebase/storage";
import { Dropdowns } from "./component/dropdowns";
import uuid from "react-uuid";

type FolderList = Record<string, FolderInfo[]>;

interface FolderInfo {
    name: string;
    level: number;
    subfolders: FolderInfo[];
}

const storage = getStorage();
const storageRef = ref(storage);

const getAllSubfolderNames = async (currentRef: StorageReference, level: number = 0): Promise<FolderInfo[]> => {
    const { prefixes } = await listAll(currentRef);
    if (prefixes.length === 0) {
        return [];
    }
    const subfolderNames = await Promise.all(
        prefixes.map(async (folderRef) => {
            const folderName = folderRef.name;
            const subfolders = await getAllSubfolderNames(folderRef, level + 1);
            return { name: folderName, level: level + 1, subfolders };
        })
    );
    return subfolderNames;
};

const getFolders = async () => {
    const { prefixes } = await listAll(storageRef);
    const folderList: FolderList = {};
    const promises = prefixes.map(async (folderRef) => {
        const folderName = folderRef.name;
        const subfolders = await getAllSubfolderNames(folderRef);
        folderList[folderName] = subfolders;
    });
    await Promise.all(promises);
    return folderList;
};

export const LoopDoubleDropDown = () => {
    const [folderList, setFolderList] = useState<FolderList>({});
    const [selectedFolderName, setSelectedFolderName] = useState<string[]>([]);

    const fetchFolderList = useCallback(async () => {
        const folders = await getFolders();
        setFolderList(folders);
    }, [setFolderList]);

    useEffect(() => {
        fetchFolderList();
    }, [fetchFolderList]);

    const handleSelect = (
        event: React.ChangeEvent<HTMLSelectElement>,
        level: number
    ) => {
        const { value } = event.target;
        setSelectedFolderName((prevSelectedFolderName) => {
            const newSelectedFolderName = [...prevSelectedFolderName];
            newSelectedFolderName[level] = value;
            return newSelectedFolderName.slice(0, level + 1);
        });
    };

    const renderSubfolders = (subfolders: FolderInfo[], level: number): JSX.Element => {
        const currentFolderName = selectedFolderName[level];
        if (!currentFolderName) {
            return <></>;
        }

        const renderSelectedSubfolders = (subfolders: FolderInfo[]): JSX.Element => {
            const currentFolderName = selectedFolderName[level];
            let currentFolder = folderList[selectedFolderName[0]];
            let selectedFolder = folderList[currentFolderName]
            for (let i = 1; i < selectedFolderName.length; i++) {
                currentFolder = subfolders.find((folder) => folder.name === selectedFolderName[i])?.subfolders || selectedFolder;
                selectedFolder = currentFolder
            }

            if (selectedFolder) {
                return renderSubfolders(selectedFolder, level + 1);
            }
            return <></>;
        };

        return (
            <>
                {subfolders.length > 0 &&
                    <select title={currentFolderName || "-- Please choose a subfolder --"} onChange={(e) => handleSelect(e, level + 1)}>
                        <option value="">-- Please choose a subfolder --</option>
                        {subfolders.map((folder) => {
                            return (
                                <option key={folder.name} value={folder.name}>
                                    {folder.level}{"-".repeat(folder.level)} {folder.name}
                                </option>
                            );
                        })}
                    </select>
                }
                {renderSelectedSubfolders(subfolders)}
            </>
        );

    };

    return (
        <div>
            <select title="root" onChange={(e) => handleSelect(e, 0)}>
                <option value="">-- Please choose an option --</option>
                {Object.keys(folderList).map((folderName) => {
                    return (
                        <option key={folderName} value={folderName}>
                            {folderName}
                        </option>
                    );
                })}
            </select>

            {selectedFolderName && (
                renderSubfolders(folderList[selectedFolderName[0]], 0)
            )}
        </div>
    );
};
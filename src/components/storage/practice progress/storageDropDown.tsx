// 兩個版本也都不正確
import React, { useState, useEffect, useCallback } from "react";
import { getStorage, ref, listAll, StorageReference, getMetadata } from "firebase/storage";

import { Dropdown } from "./component/dropdown_version1";

type Folder = {
    name: string;
    ref: StorageReference;
};

export const StorageDropdown = () => {
    const [rootFolder, setRootFolder] = useState<Folder>({ name: "", ref: ref(getStorage()) });
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
    const [folders, setFolders] = useState<Folder[]>([]);
    const getSubfolders = async (currentRef: StorageReference): Promise<Folder[]> => {
        const { prefixes } = await listAll(currentRef);
        if (prefixes.length === 0) {
            return [];
        }
        const subfolders = await Promise.all(
            prefixes.map(async (folderRef) => {
                const folderName = folderRef.name;
                return { name: folderName, ref: folderRef };
            })
        );
        return subfolders;
    };

    const fetchRootFolder = useCallback(async () => {
        const storage = getStorage();
        const storageRef = ref(storage);
        console.log("storageRef: ", storageRef)
        setRootFolder({ name: "root", ref: storageRef });
    }, []);

    const fetchSubfolders = useCallback(async (currentFolder: Folder) => {
        const subfolders = await getSubfolders(currentFolder.ref);
        setFolders(subfolders);
    }, []);

    // const fetchSubfolders = async (currentFolder: Folder) => {
    //     const subfolders = await getSubfolders(currentFolder.ref);
    //     setFolders(subfolders);
    // };

    useEffect(() => {
        fetchRootFolder();
    }, [fetchRootFolder]);

    useEffect(() => {
        fetchSubfolders(rootFolder);
    }, [rootFolder, fetchSubfolders]);

    const handleSelectFolder = useCallback((folder: Folder) => {
        setSelectedFolder(folder);
        fetchSubfolders(folder);
    }, [fetchSubfolders]);

    return (
        <div>
            {selectedFolder && (
                <Dropdown
                    label="Subfolders"
                    options={folders}
                    selectedOption={null}
                    onSelectOption={handleSelectFolder}
                />
            )}
            <Dropdown
                label="Root"
                options={[rootFolder]}
                selectedOption={selectedFolder}
                onSelectOption={handleSelectFolder}
            />
        </div>
    );
};



export const StorageDropdown2 = () => {
    const [rootFolder, setRootFolder] = useState<Folder>({ name: "", ref: ref(getStorage()) });
    // const [folders, setFolders] = useState<Record<string, Folder[]>>({});
    const [folders, setFolders] = useState<Record<string, Folder[]>>({ 0: [] });
    const [selectedFolder, setSelectedFolder] = useState<Record<string, Folder | null>>({});


    const handleSelectFolder = useCallback(
        async (folder: Folder, level: number) => {
            setSelectedFolder((prevState) => ({
                ...prevState,
                [level]: folder,
            }));
            const subfolders = await getSubfolders(folder.ref);
            setFolders((prevState) => ({
                ...prevState,
                [level + 1]: subfolders,
            }));
        },
        []
    );

    const getSubfolders = async (currentRef: StorageReference): Promise<Folder[]> => {
        const { prefixes } = await listAll(currentRef);
        if (prefixes.length === 0) {
            return [];
        }
        const subfolders = await Promise.all(
            prefixes.map(async (folderRef) => {
                const folderName = folderRef.name;
                return { name: folderName, ref: folderRef };
            })
        );
        return subfolders;
    };

    const fetchRootFolder = useCallback(async (): Promise<Folder[]> => {
        const storage = getStorage();
        const storageRef = ref(storage);
        const subfolders = await getSubfolders(storageRef);
        setRootFolder({ name: "root", ref: storageRef });
        return subfolders;
    }, []);


    useEffect(() => {
        if (Object.keys(folders).length === 0) {


            fetchRootFolder().then((folder) => {
                setFolders((prevState) => {
                    return {
                        ...prevState,
                        0: [folder] as unknown as Folder[],
                    };
                });
                setSelectedFolder((prevState) => {
                    return {
                        ...prevState,
                        0: folder as unknown as Folder,
                    };
                });
            });
        }
    }, [fetchRootFolder, folders, setSelectedFolder]);



    return (
        <div>
            {Object.keys(selectedFolder).map((level) => (
                <Dropdown
                    key={level}
                    label={`Level ${level}`}
                    options={folders[level] || []}
                    selectedOption={selectedFolder[level]}
                    onSelectOption={(folder: Folder) => handleSelectFolder(folder, parseInt(level))}
                />
            ))}
        </div>
    );
};

import React, { useState } from "react";

interface FolderInfo {
    name: string;
    level: number;
    subfolders: FolderInfo[];
}

interface Props {
    folderList: Record<string, FolderInfo[]>;
}

export const Dropdowns: React.FC<Props> = ({ folderList }) => {
    console.log("folderList", folderList)
    const [selectedFolders, setSelectedFolders] = useState<string[]>([]);

    const handleSelect = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedFolders((prevSelectedFolders) => {
            const newSelectedFolders = [...prevSelectedFolders.slice(0, index), value];
            return newSelectedFolders;
        });
    };

    const renderDropdowns = (level: number, subfolders: FolderInfo[] = [], currentIndex = 0) => {
        if (level >= selectedFolders.length) {
            // setSelectedFolders((prevSelectedFolders) => {
            //     const newSelectedFolders = [...prevSelectedFolders];
            //     newSelectedFolders[level] = subfolders.length > 0 ? subfolders[0].name : "";
            //     return newSelectedFolders;
            // });
            setSelectedFolders((prevSelectedFolders) => {
                const newSelectedFolders = [...prevSelectedFolders];
                const firstFolder = Object.keys(folderList)[0];
                newSelectedFolders[level] = firstFolder;
                return newSelectedFolders;
            });
        }

        if (level >= Object.keys(folderList).length) {
            return null;
        }

        const currentFolderName = Object.keys(folderList)[level];
        const currentSubfolders = folderList[currentFolderName];

        // console.log("currentFolderName", currentFolderName, "currentSubfolders", currentSubfolders)

        if (currentIndex >= selectedFolders.length) {
            setSelectedFolders((prevSelectedFolders) => {
                const newSelectedFolders = [...prevSelectedFolders];
                newSelectedFolders[currentIndex] =
                    currentSubfolders.length > 0 ? currentSubfolders[0].name : "";
                return newSelectedFolders;
            });
        }

        return (
            <select title="root"
                key={currentIndex}
                value={selectedFolders[currentIndex]}
                onChange={(event) => handleSelect(currentIndex, event)}
            >
                <option value="">{currentFolderName}</option>
                {subfolders.map((subfolder, i) => (
                    <option key={i} value={subfolder.name}>
                        {subfolder.name}
                    </option>
                ))}
            </select>
        );
    };

    return (
        <div>
            {renderDropdowns(0, undefined)}
            {/* {selectedFolders.slice(1).map((selectedFolder, i) => {
                const parentFolderName = selectedFolders[i];
                const parentFolder = folderList[parentFolderName];
                const subfolders = parentFolder.find((folder) => folder.name === selectedFolder)?.subfolders;
                return renderDropdowns(i + 1, subfolders, i + 1);
            })} */}
        </div>
    );
};

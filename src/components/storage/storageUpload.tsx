import React, { Fragment, useEffect, useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, UploadTask, listAll } from "firebase/storage";
import uuid from "react-uuid";
import "./css/storageUpload.css"
import { DropdownStorageFolderName } from "./dropdownStorageFolderName";

// 傳送單個檔案
// const storage = getStorage();
// export const StorageUpload = () => {

//     const [file, setFile] = useState<File | null>(null);
//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files[0]) {
//             setFile(event.target.files[0]);
//         }
//     };

//     const handleUpload = async () => {
//         if (file) {
//             const storageRef = ref(storage, 'images/' + file.name);
//             await uploadBytes(storageRef, file);
//             console.log('File uploaded successfully.');
//         }
//     };

//     return (
//         <div className="uploadContainer">
//             <div className="padding">
//                 <label htmlFor="chooseFiles" >選擇上傳的Json檔案</label>
//                 <input type="file" id="chooseFiles" onChange={handleFileChange} />
//             </div>
//             <div className="padding">
//                 <button onClick={handleUpload}>Upload</button>

//             </div>
//         </div>
//     );
// };


const storage = getStorage();


async function listFiles() {
    // List all files in the bucket
    const storageRef = ref(storage);
    listAll(storageRef).then((res) => {
        res.prefixes.forEach((folderRef) => {
            console.log("Folder name:", folderRef.name);
        });
    }).catch((error) => {
        console.log("Error listing folders:", error);
    });
}

export function StorageUpload() {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [progress, setProgress] = useState<number[]>([]);
    const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);
    const [folderName, setFolderName] = useState<string>("");
    const [storageFolderName, setStorageFolderName] = useState<string>("image");


    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(e.target.files);
            const newProgress = Array.from(e.target.files).map(() => 0);
            setProgress(newProgress);
        }
    };

    const handleFolderName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFolderName(e.target.value);
    };

    const handleUpload = async () => {
        if (!selectedFiles)
            return;

        try {
            const newUploadTasks: UploadTask[] = [];
            const uploadPromises = Array.from(selectedFiles).map(async (file, i) => {
                const storageRef = ref(storage, `${storageFolderName}${folderName}/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
                newUploadTasks.push(uploadTask);


                // Register three observers:
                // 1. 'state_changed' observer, called any time the state changes
                // 2. Error observer, called on failure
                // 3. Completion observer, called on successful completion
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress((prevProgress) => {
                            // Create a new array to avoid mutating the state directly
                            const newProgress = [...prevProgress];
                            // Update the corresponding element in the array
                            newProgress[i] = progress;
                            return newProgress;
                        });
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            console.log('File available at', downloadURL);
                        });
                    }
                );

                return uploadTask;
            });

            setUploadTasks(newUploadTasks); // 保存所有上傳任務，以便取消

            await Promise.all(uploadPromises);
            alert("All files uploaded successfully");
            setSelectedFiles(null);
            setUploadTasks([]); // 清空上傳任務數組

        } catch (error) {
            console.error(error);
        }
    };
    const handleCancel = (index: number) => {
        if (!selectedFiles) return;

        // 取消相應的上傳任務
        const uploadTask = uploadTasks[index];
        if (uploadTask) {
            uploadTask.cancel();
        }

        // 從上傳隊列中刪除檔案和進度
        const newSelectedFiles = Array.from(selectedFiles || []).filter((_, i) => i !== index);
        setSelectedFiles(newSelectedFiles.length ? newSelectedFiles as unknown as FileList : null);

        setProgress((prevProgress) => {
            const newProgress = [...prevProgress];
            newProgress.splice(index, 1);
            return newProgress;
        });
    }

    return (
        <div className="uploadContainer">
            <div className="padding">
                <label htmlFor="chooseFiles">選擇上傳的Json檔案</label>
                <input type="file" id="chooseFiles" multiple onChange={handleFileInput} />
                <DropdownStorageFolderName onSelect={(selectedStorageFolderName) => setStorageFolderName(selectedStorageFolderName)}></DropdownStorageFolderName>
                <label htmlFor="chooseFolderName">上傳的資料夾名稱</label>
                <input type="text" id="chooseFolderName" onChange={handleFolderName} />
            </div>
            <div className="padding">
                <ul>
                    {selectedFiles && Array.from(selectedFiles).map((file, i) => (
                        <Fragment key={uuid()}>
                            <li key={uuid()}>
                                {file.name}: {progress[i]}% 上傳進度
                                <button onClick={() => handleCancel(i)}>取消</button>
                            </li>
                        </Fragment>
                    ))}
                </ul>
            </div>
            <div className="padding">
                <button onClick={handleUpload}>Upload</button>
            </div>
        </div>
    );
}

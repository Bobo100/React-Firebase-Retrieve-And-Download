import "./App.css";
import { DownloadFromFirebase } from './components/firestore database/firestoreToJson';
import { UploadJsonWithArticleId } from "./components/firestore database/jsonTofirestore";
import "./components/firestore database/css/common.css"
import { StorageUpload } from "./components/storage/storageUpload";
// import { LoopDoubleDropDown } from "./components/storage/LoopDropDown";
import uuid from "react-uuid";
import { LoopDoubleDropDown } from "./components/storage/LoopDropDown";


function App() {
  return (
    <div className="App">
      <h1>Firestore Database (Cloud Firestore) 使用</h1>
      <DownloadFromFirebase />
      <UploadJsonWithArticleId />
      <h1>Storage (Cloud Firestore) 使用</h1>
      <StorageUpload />
      <LoopDoubleDropDown />
    </div>
  );
}

export default App;
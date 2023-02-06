import "./App.css";
import { DownloadFromFirebase } from './components/firestoreToJson';
import { UploadJsonWithArticleId } from "./components/jsonTofirestore";
import "./components/css/common.css"

function App() {
  return (
    <div className="App">
      <DownloadFromFirebase />
      <UploadJsonWithArticleId />
    </div>
  );
}

export default App;

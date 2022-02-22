import { getRegionWiseData, readExcel } from './data/input';

function App() {

  const handleFile = async (e) => {
    const data = await readExcel(e.target.previousElementSibling.files[0]);
    const regionData = getRegionWiseData(data);
  }

  return (
    <div className="App">
      <input
        type="file"
        id='excelInput'
      />
      <input type="button" value="submit" onClick={(e) => handleFile(e)} />
    </div>
  );
}

export default App;

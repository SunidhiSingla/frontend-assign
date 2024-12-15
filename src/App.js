import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setData] = useState([]);
  const [page, setPage] = useState(1)
  const totalPages= Math.floor(products.length/5)+(products.length%5);
  const first='<<';
  const last='>>';

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const pageHandler = (selectedPage) => {
    if (selectedPage >= 1 && selectedPage <= totalPages) {
      setPage(selectedPage);
    }
  }
  const onOptionChangeHandler = (event) => {
    setPage(parseInt(event.target.value));
};

  return (
    <div className="container">
      <select
          name="page-number"
          onChange={onOptionChangeHandler}
          value={page}
          className="select_input"
      >
        {[...Array(totalPages)].map((_, i) => {
          return <option key={i} className="options">{i + 1}</option>
        })}
      </select>
       <table className="table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Percentage funded</th>
              <th>Amount pledged</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(page * 5 - 5, page * 5).map((item) => (
              <tr>
                <td>{item["s.no"]}</td>
                <td>{item["percentage.funded"]}</td>
                <td>{item["amt.pledged"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pageNumber">{page} of {totalPages}</div>
      {products.length > 0 && <div className="pagination">
        <span onClick={() => pageHandler(1)} className={page > 1 ? "" : "pagination_disable"}>{first}</span>
        <span onClick={() => pageHandler(page - 1)} className={page > 1 ? "" : "pagination_disable"}>Back</span>
        <span onClick={() => pageHandler(page + 1)} className={page < totalPages ? "" : "pagination_disable"}>Next</span>
        <span onClick={() => pageHandler(totalPages)} className={page < totalPages ? "" : "pagination_disable"}>{last}</span>
      </div>}

    </div>
    
  );
}

export default App;

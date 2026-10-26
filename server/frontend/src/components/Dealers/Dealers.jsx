import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // let [state, setState] = useState("")
  let [states, setStates] = useState([])

  // let root_url = window.location.origin
  const dealer_url ="/djangoapp/get_dealers/";
  
  const dealer_url_by_state = "/djangoapp/get_dealers/";
 
  const filterDealers = async (state) => {
    if (state === "All") {
      await get_dealers();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${dealer_url_by_state}${encodeURIComponent(state)}`);
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const retobj = await res.json();
      if (retobj.status !== 200 || !Array.isArray(retobj.dealers)) {
        throw new Error("The dealership API returned an invalid response.");
      }
      setDealersList(retobj.dealers);
    } catch (err) {
      console.error("Unable to load dealerships for the selected state.", err);
      setError("Unable to load dealerships. Check the dealership service and try again.");
    } finally {
      setLoading(false);
    }
  }

  const get_dealers = async ()=>{
    setLoading(true);
    setError("");
    try {
      const res = await fetch(dealer_url);
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const retobj = await res.json();
      if (retobj.status !== 200 || !Array.isArray(retobj.dealers)) {
        throw new Error("The dealership API returned an invalid response.");
      }
      setStates(Array.from(new Set(retobj.dealers.map((dealer) => dealer.state))));
      setDealersList(retobj.dealers);
    } catch (err) {
      console.error("Unable to load dealerships.", err);
      setError("Unable to load dealerships. Check the dealership service and try again.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    get_dealers();
  },[]);  


let isLoggedIn = sessionStorage.getItem("username") != null ? true : false;
return(
  <div>
      <Header/>

     {error && <p role="alert">{error}</p>}
     <table className='table'>
      <thead>
      <tr>
      <th>ID</th>
      <th>Dealer Name</th>
      <th>City</th>
      <th>Address</th>
      <th>Zip</th>
      <th>
      <select name="state" id="state" onChange={(e) => filterDealers(e.target.value)}>
      <option value="" disabled hidden>State</option>
      <option value="All">All States</option>
      {states.map(state => (
          <option key={state} value={state}>{state}</option>
      ))}
      </select>        

      </th>
      {isLoggedIn ? (
          <th>Review Dealer</th>
         ):<></>
      }
      </tr>
         </thead>
         <tbody>
         {loading && <tr><td colSpan={isLoggedIn ? 7 : 6}>Loading dealerships...</td></tr>}
     {dealersList.map(dealer => (
           <tr key={dealer.id}>
             <td>{dealer['id']}</td>
             <td><a href={'/dealer/'+dealer['id']}>{dealer['full_name']}</a></td>
          <td>{dealer['city']}</td>
          <td>{dealer['address']}</td>
          <td>{dealer['zip']}</td>
          <td>{dealer['state']}</td>
          {isLoggedIn ? (
            <td><a href={`/postreview/${dealer['id']}`}><img src={review_icon} className="review_icon" alt="Post Review"/></a></td>
           ):<></>
          }
        </tr>
      ))}
      {!loading && !error && dealersList.length === 0 && (
        <tr><td colSpan={isLoggedIn ? 7 : 6}>No dealerships found.</td></tr>
      )}
      </tbody>
     </table>
  </div>
)
}

export default Dealers

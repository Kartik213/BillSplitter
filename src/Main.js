import { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './friends.css'
import { auth , db} from "./Firebase";
import { addDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { query, where } from "firebase/firestore";

function Main() {
  const [formFields1, names] = useState([{ Names: 'Kartik'},])
  const [formFields, setFormFields] = useState([{ from: '', to: '' , amt: ''},])
  const navigate = useNavigate();
  let from = [];
  let to = [];
  let amt = [];
  let name1 = [];
  let debt = [];
  let transCount = [];
  let result_from = [];
  let result_to = [];
  let result_amt = [];

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  }
  const submit = (e) => {
    e.preventDefault();
  }
  const helper = formFields.map((formFields)=>{
    from.push(formFields.from);
    to.push(formFields.to);
    amt.push(parseInt(formFields.amt));
  }
  )
  const helper2 = formFields1.map((formFields1)=>{
    name1.push(formFields1.Names);
  }
  )
  const optimize = () => {
    console.log(formFields);
    console.log(formFields1);
    console.log(from);
    console.log(to);
    console.log(amt);
    let f = formFields1.length;
    let trans = from.length;
    console.log(f);
    console.log(trans);
    for(let i=0;i<f;i++){
      debt[i] = 0;
      transCount[i] = 0;
    }
    for(let i=0;i<f;i++){
      for(let j=0;j<trans;j++){
        if(from[j] === name1[i]){
          debt[i] = debt[i] - amt[j];
        }
        if(to[j] === name1[i]){
          debt[i] = debt[i] + amt[j];
        }
      }
    }
    console.log(debt);
    function getMin(arr){
      var minInd = 0;
      for (let i = 1; i < f; i++)
          if (arr[i] < arr[minInd])
              minInd = i;
      return minInd;
    }
    function getMax(arr){
      var maxInd = 0;
      for (let i = 1; i < f; i++)
        if (arr[i] > arr[maxInd])
          maxInd = i;
      return maxInd;
    }
    function checkZero(amount){
      for(let i = 0;i<f;i++){
        if(amount !== 0)
          return false;
      }
      return true;
    }
    function settleup(min, max, residue){
      transCount[min]++;
      result_from.push(name1[min]);
      result_to.push(name1[max]);
      //Transaction Limit
      if (transCount[min] === 1){
          residue[min] = Math.abs(residue[min]);
          residue[max] = residue[max] - residue[min];
          result_amt.push(residue[min]);
          residue[min] = 0;
      }
      else{
          if (residue[max] > Math.abs(residue[min])){
              residue[max] += residue[min];
              result_amt.push(Math.abs(residue[min]));
              residue[min] = 0;
          }
          else if (residue[max] < Math.abs(residue[min])){
              residue[min] += residue[max];
              result_amt.push(Math.abs(residue[max]));
              residue[max] = 0;
          }
          else{
              residue[min] = 0;
              result_amt.push(residue[max]);
              residue[max] = 0;
          }
      }
    }
    if (!checkZero(debt)){
      for(let i = 0; i < f; i++){
            let min = getMin(debt);
            let max = getMax(debt);
           settleup(min, max, debt);
            if (checkZero(debt)){
                break;
            }
        }
    }
      console.log(result_from);
      console.log(result_to);
      console.log(result_amt);
      let text = "<h1>Optimized Transactions</h1> <br/>"
      text += "<table>";
      for (let i = 0; i <f; i++) {
        if(result_amt[i] !== 0){
          text += "<tr>"
          text += "<td>" + result_from[i] + "</td>";
          text += "<td>" + result_to[i] + "</td>";
          text += "<td>" + result_amt[i] + "</td>";
          text += "</tr>";
        }
      }
      text += "</table>";
      sendData();
      document.getElementsByClassName("result")[0].innerHTML = text;
    }
  const addFields = () => {
    let object = {
      from: '',
      to: '',
      amt: ''
    }
    setFormFields([...formFields, object])
  }
  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1)
    setFormFields(data)
  }
  /*Names column*/
  const removeFields1 = (index) => {
    let data = [...formFields1];
    data.splice(index, 1)
    names(data)
  }
  const handleNameChange = (event, index) => {
    let data = [...formFields1];
    data[index][event.target.name] = event.target.value;
    names(data);
  }
  const addFields1 = () => {
    let object = {
      Names: '',
    }
    names([...formFields1, object])
  }
  const logout = () => {
    navigate("/")
    alert('Logged out successfully')
  }

  const sendData = async () => {
    const data = new Object();
    data.group = name1;
    await addDoc(collection(db, "groups"), data);
  }
  const [dataRecieved,setUsers] = useState([]);
  const getData = () => {
    const usersCollectionRef = collection(db, "groups")
    const getUsers = async () => {
        const data = await getDocs(usersCollectionRef);
        const dataRecieved = [];
        // let userData;
        for(var i=0;i<data.docs.length;i++){
          if(data.docs[i].id === "a2OfJYRHaEsj4Xx75eJ8"){
            const userData = data.docs[i].data();
            dataRecieved.push(userData.group);
          }
        }
        console.log(dataRecieved[0]);
      }

    getUsers();
  }
  return (
    <>
    <header className='header'>
      <span><h1>Bill</h1><h1 className='bl'>Splitter</h1></span>
      <button className="logout" onClick={logout}>LogOut</button>
      {/* <button className="logout" onClick={getData}>Saved Group</button> */}
    </header>
  <div className='main'>
    <div className="group-expenses">
    <div className="group-members-container ">
      <h1>Group Members</h1>
      <form onSubmit={submit}>
        {formFields1.map((form, index) => {
          return (
            <div key={index} className="group">
              <input
                className='inputfields'
                name='Names'
                placeholder='Name'
                onChange={event => handleNameChange(event, index)}
                value={formFields1.Name}
              />
              <button onClick={() => removeFields1(index)} className='rem-button'>Remove</button>
            </div>
          )
        })}
      </form>
      <button onClick={submit} className='subButton'>Submit</button>
      <button onClick={addFields1} className='add' >Add More</button>
    </div>
    <div className="addexpenses">
      <h1>Expenses</h1>
      <form onSubmit={submit}>
        {formFields.map((form, index) => {
          return (
            <div key={index}>
              <input
                className='inputfields'
                name='from'
                placeholder='From'
                type='text'
                onChange={event => handleFormChange(event, index)}
                value={form.from}
              />
              <input
                className='inputfields'
                name='to'
                placeholder='To'
                type='text'
                onChange={event => handleFormChange(event, index)}
                value={form.to}
              />
              <input
                className='inputfields'
                name='amt'
                placeholder='₹'
                type='number'
                onChange={event => handleFormChange(event, index)}
                value={form.amt}
              />
              <button onClick={() => removeFields(index)} className='rem-button'>Remove</button>
            </div>
          )
        })}
      </form>
      <button onClick={optimize} className='subButton'>Submit</button>
      <button onClick={addFields} className='add'>Add More</button>
    </div>
    </div>
    <div className="result" >
      <h1>Optimized Transactions</h1> <br/>
    </div>
    </div>
    </>
  );
}

export default Main;
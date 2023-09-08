import { useEffect, useState } from 'react'
import './App.css'
import samples from './expenseSample';
import Record from './reusableComponents/record';
import NavPage from './reusableComponents/navPage';
import calculateBalance from './helper/calculateBalance';

function App() {
  const [transactions, setTransactions] = useState(samples);
  const [showModal, setShowModal] = useState(false);

  function handleAddRecord(e, title, value, category) {
    e.preventDefault();
    const today = new Date();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const date = today.getDate().toString().padStart(2, '0');
    const month = months[today.getMonth()];
    const day = `${date} ${month}`

    const newRecord = {
      category : category,
      title : title,
      balance : category === 'Salary' ? Number(value) : -value
    }

    setTransactions((prev) => {
      // Replace new array at day
      // The previous value of current transaction

      // If the day exists in the array
      if (prev.hasOwnProperty(day)){
        const previousCurrentTransaction = prev[day]
        return {...prev, [day] : [...previousCurrentTransaction, newRecord]}
      } else {
        // Create a shallow copy of the previous value
        const prevCopy = prev;
        // Initialize Empty array
        prevCopy[day] = []

        return {...prevCopy, [day] : [...previousCurrentTransaction, newRecord]}
      }
    });
    
  };

  function handleShowModal() {
    setShowModal(true);
  }

  function handleCloseModal (){
    setShowModal(false);
  }
  return (
    <div className="app flex flex-col items-center w-screen">
      {showModal && <FormAddRecord onAddRecord={handleAddRecord} onCloseModal={handleCloseModal}/>}
      {showModal && <Modal onClick={()=>{
        setShowModal(false);
      }}/>}
      <div className="container px-5">
        <Nav />
        <BalanceCard transactions={transactions}/>
        <Transactions transactions={transactions}/>
      </div>
      <BottomNav onShowModal={handleShowModal}/>
    </div>
  )
};

const FormAddRecord = ({onCloseModal, onAddRecord}) => {
  const [title, setTitle]= useState("");
  const [value, setValue] = useState(0);
  const [category, setCategory] = useState('Clothing');

  return (
    <div className="form-add-record flex flex-col absolute bottom-0 bg-white w-screen h-5/6">
      <nav className="flex flex-row m-3 w-auto text-3xl">
        <div className="cursor-pointer" onClick={onCloseModal}>
          <ion-icon name="close-outline"></ion-icon>
        </div>
      </nav>
      <form className="flex flex-col mt-8 gap-y-5 w-full px-14">
        <div className="flex flex-col gap-y-2">
          <label className="font-semibold">Title</label>
          <input className="bg-gray-100 px-5 w-full rounded-full h-14" type="text" value={title} onChange={e => setTitle(e.target.value)}/>
        </div>
        <div className="flex flex-col gap-y-2">
          <label className="font-semibold">Amount of money</label>
          <input className="bg-gray-100 px-5 w-full rounded-full h-14" type="number" value={value} onChange={e => setValue(e.target.value)}/>
        </div>
        <label className="font-semibold">Type of this transaction</label>
        <select value={category} onChange={e => setCategory(e.target.value)} className="px-10 h-14 w-full rounded-full">
          <option value="Clothing">Clothing</option>
          <option value="Food">Food</option>
          <option value="Shopping">Shopping</option>
          <option value="Transportation">Transportation</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Groceries">Groceries</option>
          <option value="Utilities">Utilities</option>
          <option value="Dining">Dining</option>
          <option value="Salary">Salary</option>
        </select>
        <button onClick={(e) => {
          onAddRecord(e, title, value, category)
          setValue(0);
          setTitle("");
          setCategory("Clothing");
          onCloseModal();
          }
        } className="mt-5 w-full h-14 text-white font-semibold bg-primary rounded-full">Add</button>
      </form>
    </div>
  )
};

const Nav = () => {
  return (
    <nav className="navbar w-full flex flex-row items-center justify-between">
      <div className="navbar_left">
       <h1 className="text-4xl">Hello,</h1>
       <h1 className="font-semibold text-4xl">Sanphet</h1>
      </div>
      <div className="navbar_right">
       <div className="navbar_right__icon-search flex flex-col justify-center items-center">
         <ion-icon name="search-outline"></ion-icon>
       </div>
      </div>
    </nav>
  )
};

const BalanceCard = ({transactions}) => {
  const [balance, setBalance] = useState(null);

  useEffect(()=>{
    setBalance(calculateBalance(transactions));
  }, [transactions])
  return (
    <div className="balance-card flex flex-col px-10 mt-8 w-full h-52 mb-6">
      <div className="my-auto">
        <h2 className="text-white text-xl">Balance</h2>
        <div className="flex flex-row items-end gap-x-2">
          <p className="text-white text-xl">฿</p>
          <p className="text-white font-semibold text-3xl mt-2">{balance}</p>
        </div>
        <h2 className="text-white text-2xl mt-3">Sanphet Songjindasak</h2>
      </div>
    </div>
  )
};

const Transactions = ({transactions}) => {
  const [sortedTransactions, setSortedTransactions] = useState({});

  useEffect(()=>{
    // Sort all transactions
    const today = new Date();
    const sortedEntries = Object.entries(transactions).sort(([a], [b]) =>
      new Date(b) - new Date(a)
    );
    const sortedData = Object.fromEntries(sortedEntries);
    setSortedTransactions(sortedData);
  }, [transactions])

  return (
    Object.keys(sortedTransactions).map((transaction, index) => {
      return <div key={index}>
        <h3 className="font-semibold text-gray-300 mb-4">{transaction}</h3>
        {
          sortedTransactions[transaction].map(record => <Record title={record.title} category={record.category} balance={record.balance} type={record.type}/>)
        }
      </div>
    }
    )
  )
};

const BottomNav = ({onShowModal}) => {
  return (
    <div className="bottom-nav flex flex-row items-center justify-between px-10 fixed bottom-0 w-screen bg-white">
      <NavPage iconName="settings-outline">Settings</NavPage>
      <div onClick={onShowModal} className="bottom-nav_add-button cursor-pointer flex flex-col items-center justify-center">
        <p className="bottom-nav_add-button__icon text-white text-3xl">+</p>
      </div>
      <NavPage iconName="person-outline">Sign In</NavPage>
    </div>
  )
};

const Modal = ({onClick}) => {
  return (
    <div onClick={onClick} className="modal absolute w-screen h-screen bg-black"></div>
  )
};


export default App
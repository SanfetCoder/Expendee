import React , {useState, useEffect} from "react";
import samples from './expenseSample';
import Record from './reusableComponents/record';
import NavPage from './reusableComponents/navPage';
import calculateBalance from './helper/calculateBalance';

const Home = ({onChangeCurrentPage}) => {
  const [transactions, setTransactions] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFormAddRecord, setShowFormAddRecord] = useState(false);
  const [showFormEditRecord, setShowFormEditRecord] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const categories = ["Clothing","Food","Shopping","Transportation","Entertainment","Groceries","Utilities","Dining","Salary","Taxi","Pet"]

  // Load the transactions from local storage when mounts
  useEffect(()=>{
    const storedTransactions = localStorage.getItem("transactions");
    // If the stored transactions are empty, create an empty object
    if (!storedTransactions) localStorage.setItem("transactions", JSON.stringify({}));
    const parsedTransactions = JSON.parse(localStorage.getItem("transactions"))
    // Update the current transactions with the storedc Transactions
    setTransactions(parsedTransactions);
    
  }, [])

  function handleSelectRecord(transaction, index) {
    setSelectedRecord((prev)=>{
      return ({
        [transaction] : index
      })
    })
  }

  function handleShowFormAddRecord() {
    setShowFormAddRecord(true);
  }

  function handleShowFormEditRecord() {
    setShowFormEditRecord(true);
  }

  function handleCloseFormEditRecord() {
    setShowFormEditRecord(false);
  }

  function handleCloseFormAddRecord() {
    setShowFormAddRecord(false);
  }

  function handleEditRecord(index, transaction, title, category, balance){
    
    try {
      // Get the new information
      setTransactions((prev)=>{
        // Create a deep copy of the previous transaction
        const deepPrev = {...prev};
        // Update the information inside the record
        const updatedRecord = {
          category : category,
          title : title,
          balance : category === 'Salary' ? balance : -balance
        }
        // Update date the transaction with the new record
        deepPrev[transaction][index] = updatedRecord

        // Update this to transactions in local storage
        localStorage.setItem("transactions", JSON.stringify(deepPrev));
        // Set this as a new transactions
        return deepPrev
      })
    } catch(error){
      console.log(error)
    }
  }

  function handleDeleteRecord(index, transaction){
    setTransactions((prev)=>{
      const previousTransactions = {...prev};
      // Delete a record from the transaction
      // return previousTransactions[transaction].splice(index, 1);
      previousTransactions[transaction].splice(index, 1)
      // Update this to local storage
      localStorage.setItem('transactions', JSON.stringify(previousTransactions));
      return previousTransactions;
    });

  }

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
      if (prev) {
        if (prev.hasOwnProperty(day)){
          const previousCurrentTransaction = prev[day]
          const updatedTransaction = {...prev, [day] : [...previousCurrentTransaction, newRecord]};
          // Update the data to local storage
          localStorage.setItem("transactions", JSON.stringify(updatedTransaction))
          return updatedTransaction
        } else {
          // Create a shallow copy of the previous value
          const prevCopy = prev;
          // Initialize Empty array
          prevCopy[day] = []
          const updatedTransaction = {...prevCopy, [day] : [...previousCurrentTransaction, newRecord]};
            // Update the data to local storage
          localStorage.setItem("transactions", JSON.stringify(updatedTransaction))
          return updatedTransaction
        }
      } else {
        const updatedTransaction = {[day] : [newRecord]}
        return updatedTransaction
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
      {showFormEditRecord && <FormEditRecord categories={categories} selectedRecord={selectedRecord} onEditRecord={handleEditRecord} onCloseModal={handleCloseModal} onCloseFormEditRecord={handleCloseFormEditRecord}/>}
      {showFormAddRecord && <FormAddRecord categories={categories} onCloseFormAddRecord={handleCloseFormAddRecord} onAddRecord={handleAddRecord} onCloseModal={handleCloseModal}/>}
      {showModal && <Modal onClick={()=>{
        setShowModal(false);
      }}/>}
      <div className="container px-5">
        <Nav />
        <BalanceCard transactions={transactions}/>
        {transactions && <Transactions onSelectRecord={handleSelectRecord} onShowModal={handleShowModal} onShowFormEditRecord={handleShowFormEditRecord} onEditRecord={handleEditRecord} onDeleteRecord={handleDeleteRecord} transactions={transactions}/>}
      </div>
      <BottomNav onChangeCurrentPage={onChangeCurrentPage} onShowFormAddRecord={handleShowFormAddRecord} onShowModal={handleShowModal}/>
    </div>
  )
}

const FormEditRecord = ({onCloseModal, onCloseFormEditRecord, onEditRecord, selectedRecord, categories}) => {
  const [category, setCategory] = useState('Clothing')
  const [value, setValue] = useState(0);
  const [title, setTitle] = useState("");

  return (
    <div className="form-add-record flex flex-col absolute bottom-0 bg-white w-screen h-5/6">
      <nav className="flex flex-row m-3 w-auto text-3xl">
        <div className="cursor-pointer" onClick={()=>{
          onCloseModal();
          onCloseFormEditRecord();
        }}>
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
          {
            categories.map((category)=>{
              return (
                <option value={category}>{category}</option>
              )
            })
          }
        </select>
        <button onClick={() => {
          // edit the record
          // Need the index of the record ()
          const index = Object.values(selectedRecord)[0];
          // Need the transaction of the record ()
          const transaction = Object.keys(selectedRecord)[0];
          onEditRecord(index, transaction, title, category, value)
          setValue(0);
          setTitle("");
          setCategory("Clothing");
          onCloseModal();
          onCloseFormEditRecord();
          }
        } className="mt-5 w-full h-14 text-white font-semibold bg-primary rounded-full">Update</button>
      </form>
    </div>
  )
};


const FormAddRecord = ({onCloseModal, onAddRecord, onCloseFormAddRecord, categories}) => {
  const [title, setTitle]= useState("");
  const [value, setValue] = useState(0);
  const [category, setCategory] = useState('Clothing');

  return (
    <div className="form-add-record flex flex-col absolute bottom-0 bg-white w-screen h-5/6">
      <nav className="flex flex-row m-3 w-auto text-3xl">
        <div className="cursor-pointer" onClick={()=>{
          onCloseModal();
          onCloseFormAddRecord();
        }}>
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
          {
            categories.map((category)=>{
              return (
                <option value={category}>{category}</option>
              )
            })
          }
        </select>
        <button onClick={(e) => {
          onAddRecord(e, title, value, category)
          setValue(0);
          setTitle("");
          setCategory("Clothing");
          onCloseModal();
          onCloseFormAddRecord();
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

const Transactions = ({transactions, onDeleteRecord, onShowModal, onEditRecord, onShowFormEditRecord, onSelectRecord}) => {
  const [sortedTransactions, setSortedTransactions] = useState({});

  useEffect(()=>{
    // Sort all transactions
    const today = new Date();
    const sortedEntries = Object.entries(transactions).sort(([a], [b]) =>
      Math.abs(new Date(b) - today) - Math.abs(new Date(a) - today)
    );
    const sortedData = Object.fromEntries(sortedEntries);
    setSortedTransactions(sortedData)
  }, [transactions])

  return (
    Object.keys(sortedTransactions).map((transaction, index) => {
      return <div key={index}>
        <div className="flex flex-row justify-between">
          <h3 className="font-semibold text-gray-300 mb-4">{transaction}</h3>
          <TransactionTotal transaction={transactions[transaction]} />
        </div>
        {
          sortedTransactions[transaction].map((record, index) =>{ 
            return <Record onSelectRecord={onSelectRecord} onShowModal={onShowModal} onShowFormEditRecord={onShowFormEditRecord} onEditRecord={onEditRecord} onDeleteRecord={onDeleteRecord} index={index} transaction={transaction} title={record.title} category={record.category} balance={record.balance} type={record.type}/>
            })
        }
      </div>
    }
    )
  )
};

const TransactionTotal = ({transaction}) => {
  const totalBalance = transaction.reduce((accu,val)=>{return accu + val.balance},0);
  return(
  <p className={`font-semibold ${totalBalance < 0 ? "text-red-600" : "text-green-600"}`}>{totalBalance}</p>
  )
};

const BottomNav = ({onShowModal, onShowFormAddRecord, onChangeCurrentPage}) => {
  return (
    <div className="bottom-nav flex flex-row items-center justify-between px-10 fixed bottom-0 w-screen bg-white">
      <NavPage 
      onClick={()=>{
        onChangeCurrentPage('summary')
      }}
      iconName="stats-chart-outline">Summary</NavPage>
      <div onClick={()=>{
        onShowModal();
        onShowFormAddRecord();
        }} className="bottom-nav_add-button cursor-pointer flex flex-col items-center justify-center">
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

export default Home;
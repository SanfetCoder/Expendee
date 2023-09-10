import { useState } from "react";
import { CSSTransition } from 'react-transition-group';

const Record = ({title, category, balance, transaction, index, onDeleteRecord}) => {
  const categories = {
    "Clothing" : "🥼",
    "Food" : "🍖",
    "Shopping" : "👜",
    "Transportation" : "🚃",
    "Entertainment" : "🍿",
    "Groceries" : "🛒",
    "Utilities" : "⚡️",
    "Dining" : "🍛",
    "Salary" : "💰"
  }

  const [displayDelete, setDisplayDelete] = useState(false);

  const handleClick = () => {
    setDisplayDelete(prev => !prev);
  };

  const handleAfterDelete = () => {
    setDisplayDelete(false);
  }

  return (
    <div className="flex flex-row items-center mb-3 gap-x-4 justify-between">
      <div 
        onClick={handleClick}
        className="flex flex-row cursor-pointer w-full items-center gap-x-4"
      >
        <div className="category-card rounded-2xl p-3 bg-gray-100">
          <h1 className="text-3xl">{categories[category]}</h1>
        </div>
        <div className="flex flex-col items-start mr-auto">
          <p className="font-semibold">{title}</p>
          <p className="text-sm font-semibold text-gray-300">{category}</p>
        </div>
        <p className="font-semibold">
          {balance < 0 ? `-฿${Math.abs(balance)}` : `฿${Math.abs(balance)}`}
        </p>
      </div>
      <CSSTransition
        in={displayDelete}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <DeleteButton onAfterDelete={handleAfterDelete} onDeleteRecord={onDeleteRecord} transaction={transaction} index={index} />
      </CSSTransition>
    </div>
  )
};

const DeleteButton = ({onDeleteRecord, transaction, index, onAfterDelete}) =>{
  return (
    <div
      onClick={()=>{
        onDeleteRecord(index, transaction)
        onAfterDelete();
      }} 
      className="flex flex-col w-10 h-9 items-center justify-center bg-primary text-white rounded-full">
      <ion-icon name="trash"></ion-icon>
    </div>
  )
}

export default Record;
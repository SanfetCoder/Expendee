import { useState } from "react";
import { CSSTransition } from 'react-transition-group';

const Record = ({title, category, balance, transaction, index, onDeleteRecord, onEditRecord}) => {
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
    <div className="flex flex-row items-center mb-3 justify-between">
      <div 
        onClick={handleClick}
        style={{
          transform: `translateX(${displayDelete ? '-7%' : '0'})`,
          transition: '0.4s all ease-in-out'
        }}
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
        timeout={200}
        classNames="fade"
        unmountOnExit
      >
        <EditButton onEditRecord={onEditRecord} className="mr-3" transaction={transaction} index={index}/>
      </CSSTransition>
      <CSSTransition
        in={displayDelete}
        timeout={200}
        classNames="fade"
        unmountOnExit
      >
        <DeleteButton onAfterDelete={handleAfterDelete} onDeleteRecord={onDeleteRecord} transaction={transaction} index={index} />
      </CSSTransition>
    </div>
  )
};

const EditButton = ({className, onEditRecord, index, transaction}) =>{

  return (
    <div
      className={`flex flex-col items-center justify-center bg-orange-400 text-white rounded-full ${className}`}>
      <div className="w-10 h-10 cursor-pointer flex flex-col items-center justify-center">
        <ion-icon name="pencil"></ion-icon>
      </div>
    </div>
  )
}

const DeleteButton = ({onDeleteRecord, transaction, index, onAfterDelete, className}) =>{
  return (
    <div
      onClick={()=>{
        onDeleteRecord(index, transaction)
        onAfterDelete();
      }} 
      className="flex flex-col items-center justify-center bg-primary text-white rounded-full">
      <div className="w-10 h-10 cursor-pointer flex flex-col items-center justify-center">
        <ion-icon name="trash"></ion-icon>
      </div>
    </div>
  )
}

export default Record;
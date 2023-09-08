const Record = ({title, category, balance, type}) => {
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

  return (
    <div className="flex flex-row items-center gap-x-4 mb-3">
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
  )
};

export default Record;
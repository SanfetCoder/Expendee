const calculateBalance = (transactions) => {
  let totalBalance = 0;

  if (transactions){
    Object.keys(transactions).forEach((transaction)=>{
      transactions[transaction].forEach((record)=>{
        totalBalance += record.balance;
      })
    })
  }

  return totalBalance;
};


export default calculateBalance;
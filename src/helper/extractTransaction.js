const extractTransaction = (transactions) => {
  // dataset
  var dataset = {}
  // Loop through each transaction
  Object.keys(transactions).map((transaction)=>{
    const currentRecords = transactions[transaction];
    // Loop through each record
    currentRecords.map((record)=>{
      // Add the current category to the dataset for the first time
      if (!dataset.hasOwnProperty(record.category) && record.category !== 'Salary') dataset[record.category] = 0
      // Add the balance of the current record to the current cateogry
      if (record.category !== 'Salary') dataset[record.category] += Math.abs(record.balance)
    })
  })
  return [Object.keys(dataset), Object.values(dataset)]
};

export default extractTransaction;
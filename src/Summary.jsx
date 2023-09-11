import React , {useEffect, useState}  from "react";
import { motion } from "framer-motion"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import extractTransaction from "./helper/extractTransaction";
import { Doughnut } from "react-chartjs-2";

// Register the chart
ChartJS.register(ArcElement, Tooltip, Legend);

const Summary = ({currentPage, onChangeCurrentPage}) =>{
  const [transactions, setTransactions] = useState(null);
  const [dataset, setDataset] = useState(null);

  useEffect(()=>{
    // Get the stored transactions
    const storedTransactions = JSON.parse(localStorage.getItem("transactions"));
    setTransactions(storedTransactions);
    // Get the value for dataset
    const [labels, datas] = extractTransaction(storedTransactions);
    setDataset({
      labels : labels,
      datasets : [
        {
          label : "Expense Summary",
          data : datas,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1
        }
      ]
    });
    // Clear up function
    return ()=>{
      setTransactions(_ => null);
      setDataset(null);
    }
  },[])

  return (
    <motion.div
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex flex-col items-center w-screen h-screen">
        <nav className="flex flex-row px-3 items-end m-0 w-full h-14">
          <div
            onClick={()=>{
              onChangeCurrentPage('home')
            }}
            className="text-2xl cursor-pointer"
          >
            <ion-icon name="chevron-back-outline"></ion-icon>
          </div>
        </nav>

        {transactions && <Chart dataset={dataset} transactions={transactions} />}
      </div>
    </motion.div>
  )
}

const Chart = ({dataset}) => {
  return (
    <div className="mt-10">
      <Doughnut data={dataset} />
    </div>
  )
};

export default Summary;
import { useEffect, useState } from 'react'
import './App.css'
import samples from './expenseSample';
import Home from './Home';
import Summary from './Summary';
import { motion } from "framer-motion";

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  function handleChangeCurrentPage(page){
    setCurrentPage(()=>{
      return page
    })
  }

  return(
    <div>
      {currentPage === 'home' && <Home currentPage={currentPage} onChangeCurrentPage={handleChangeCurrentPage} />}
      {currentPage === 'summary' && <Summary onChangeCurrentPage={handleChangeCurrentPage} currentPage={currentPage}/>}
    </div>
  )

};


export default App
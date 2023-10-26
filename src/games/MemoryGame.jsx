import '../stylesheets/memoryGame.css'
import React, { useState, useEffect, useRef } from 'react';
import Square from '@mui/icons-material/CropSquareSharp';
import Circle from '@mui/icons-material/CircleOutlined';
import Triangle from '@mui/icons-material/ChangeHistoryOutlined';
import Cross from '@mui/icons-material/ClearSharp';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const MemoryGame = () => {
  const symbols = [<Triangle/>, <Square/>,  <Circle/>, <Cross/>]
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [level, setLevel] = useState(1);
  const [isBtnDisabled, setBtnDisabled] = useState(true);
  const [isDisplaying, setDisplaying] = useState(false);
  const overlay = useRef()
  const instructions = useRef();
  const startButton = useRef();
  const levelDisplay = useRef();
  const bigLevelDisplay = useRef();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const timeoutRef = useRef(null);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);


  function startButtonClick(){
    setLoading(false);
    setError(false);
    setSuccess(false);
    startButton.current.style.display = 'none';
    bigLevelDisplay.current.textContent = ''
    generateSequence();
  }

  const generateSequence = () => {
    levelDisplay.current.textContent = `level: ${level}`
    instructions.current.textContent = 'Memorize this sequence'

    let displayTime;
    let seqLength;
    if (level < 6){
      seqLength = 4;
      displayTime = 2100 - level * 300; //1800 to 600
    } else if(level < 10) {
      seqLength = 5;
      displayTime = 2100 - (level - 5) * 300 //1800 to 900
    } else if(level < 13){
      seqLength = 6;
      displayTime = 2100 - (level - 9) * 300 // 1800 to 1200
    } else if(level < 21){
      seqLength = 7;
      displayTime = 2100 - (level - 15) * 300
    } else if(level < 26){
      seqLength = 8;
      displayTime = 2100 - (level - 20) * 300
    } else{
      endGame();
    }

    const newSequence = [];
    for (let i = 0; i < seqLength; i++) {
      let ranNum = Math.floor(Math.random() * 4)
      newSequence.push(ranNum);      
      setDisplaying(true);
    }

    setSequence(newSequence);
    setBtnDisabled(true);

    timeoutRef.current = setTimeout( ()=>{
      instructions.current.textContent = 'Type in the sequence';
      setBtnDisabled(false)
      setDisplaying(false)
    }, displayTime);
  };

  function handleButtonClick(number) {
    const index = userSequence.length;
    if (sequence[index] === number) {
      setUserSequence([...userSequence, number]);
      if (userSequence.length === sequence.length - 1) {
        setLevel(prev=>prev+1)
        setUserSequence([])
        setSequence([]);
        generateSequence();
      }
    } else {
      endGame();
    }
  };
  

  function endGame(){
    setBtnDisabled(true);
    setLevel(1);
    setSequence([]);
    setUserSequence([]);
    levelDisplay.current.textContent = ''
    instructions.current.textContent = 'Game over. You reached'
    bigLevelDisplay.current.textContent = 'Level ' + level;
    //upload result then show restart button
    uploadResult(level);
  }
  function uploadResult(result) {
    setLoading('Uploading your result...')
    setError(false)
    setSuccess(false)
    fetch('http://localhost:2500/gameResult', {
        method: "POST",
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify({result, game: 'memory game'}),
        credentials: 'include'
    }).then(res => {
        if(!res.ok){
            setLoading(false)
            throw Error("couldn't upload result. Please play again")
        }
        return res.json()
    }).then(res => {
        setLoading(false)
        if(res.success){
            startButton.current.style.display = 'unset'
            startButton.current.textContent = 'Restart Game'
            setSuccess(true)
        }else{
            throw Error(res.message)
        }
    }).catch(err => {
        setError(err.message)
        setLoading(false)
        setSuccess(false)
        startButton.current.style.display = 'unset'
        startButton.current.textContent = 'Restart Game'
    })
}

  let userInfo = useUser()
  let navigate = useNavigate();

  return (<>
    {userInfo.auth === false && navigate('../login', {replace: true})}
    <header data-bs-theme="dark">
    <div className="navbar navbar-dark bg-dark shadow-sm" style={{position: 'fixed', zIndex: '100', top: '0', width: '100%', height: '60px', justifyContent: 'center'}}>
      <div >
        <Link to="../" className="navbar-brand d-flex align-items-center m-0">
          <strong>App Name</strong>
        </Link>
      </div>
    </div>
  </header>
          
    <div className='d-flex flex-column  align-items-center py-4 bg-body-tertiary' style={{minHeight: "100vh"}}>

    {error && 
        <div id='popup'>
        <p style={{margin: '0', padding: '10px 20px'}}>{error}</p>
        <button className='btn btn-close p-3' onClick={()=>setError(false)} />
        </div>
    }
    {loading && 
        <div id='popup' className='loadingPopup'>
        <p style={{margin: '0', padding: '10px 20px'}}>{loading}</p>
        </div>
    }
    {success && 
        <div id='popup' className='successPopup'>
        <p style={{margin: '0', padding: '10px 20px'}}>Result uploaded successfully!</p>
        <button className='btn btn-close p-3' onClick={()=>setSuccess(false)} />
        </div>
    }

    <div className='overlay' ref={overlay}/>
{/*     <button className='btn btn-link' onClick={()=>{navigate('/', {relative: false})}}>back</button> */}
    <h2>Memory Game</h2>
    <p ref={levelDisplay}></p>

    <div id="game-container">
      <div className="game-area">
          <p className="instructions-display" ref={instructions}></p>
          <p className="number-display" ref={bigLevelDisplay}></p>
          <div id='symbols-display'>
            {isDisplaying && sequence.map(sym => symbols[sym])}
            {userSequence.map(sym => symbols[sym])}
          </div>
          <button className="btn btn-primary start-button" type="button" ref={startButton} onClick={startButtonClick}>Start Game</button>
      </div>

      <div className="keypad">
        {symbols.map((symbol, i) => {
          return (isBtnDisabled ? 

            <button className='btn btn-outline-secondary'  
            type='button' key={i}
            disabled>{symbol}</button> :

            <button 
            className='btn btn-outline-secondary' 
            onClick={()=>{handleButtonClick(i)}} 
            type='button' key={i}>{symbol}</button>
          )
        })}
        
      </div>  
    </div>
    
  </div></>);
};



export default MemoryGame;

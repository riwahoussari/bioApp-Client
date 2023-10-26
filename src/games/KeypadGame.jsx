import '../stylesheets/keypadGame.css'
import { useRef, useState, useEffect } from 'react'
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
export default function KeypadGame(){
    const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
    const digits = [1,2,3,4,5,6,7,8,9];
    const [rounds, setRounds] = useState(5);
    const [totalReactionTime, setTotalReactionTime] = useState(0)
    const [correctClicks, setCorrectClicks] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [ranNum, setRanNum] = useState();
    const [isBtnDisabled, setBtnDisabled] = useState(true)
    const instructions = useRef();
    const numberDisplay = useRef();
    const startButton = useRef();
    const overlay = useRef();
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
        setError(false)
        setLoading(false)
        setSuccess(false)
        //hide start button and text
        startButton.current.style.display = 'none';
        numberDisplay.current.textContent = '';
        instructions.current.textContent = '';

        //countdown then start game
        overlay.current.style.display = 'flex';
        overlay.current.textContent = '3';
        timeoutRef.current = setTimeout(() => {
            overlay.current.textContent = '2'
            timeoutRef.current = setTimeout(() => {
                overlay.current.textContent = '1'
                timeoutRef.current = setTimeout(()=>{
                    overlay.current.textContent = ''
                    playRound()
                }, 1000); 
            }, 1000);
        }, 1000);
    }

    function playRound() {
        if (rounds > 0) {
            //hide overlay
            overlay.current.style.display = 'none';
            //display text
            numberDisplay.current.textContent = '??';
            instructions.current.textContent = 'Wait...';
    
            //generate random number
            let random = Math.ceil(Math.random() * 9)
            setRanNum(random)
            //after random time
            timeoutRef.current = setTimeout(() => {
                //display random number
                numberDisplay.current.textContent = numbers[random-1];
                instructions.current.textContent = 'Click!'

                //undisable buttons
                setBtnDisabled(false)

                //start counter
                setStartTime(new Date().getTime())
                
            }, Math.random() * 2000 + 1000); 
    
            setRounds(prev=> prev - 1);
        }
    }

    function numClick(num){
        //disable button
        setBtnDisabled(true);
        //if user clicked correct button
        if(num === ranNum){

            //if game didn't end
            if (rounds > 0){
                //calculate and display reaction time
                const endTime = new Date().getTime();
                const reactionTime = (endTime - startTime);
                setTotalReactionTime(prev=>prev+reactionTime)
                instructions.current.textContent = 'Reaction Time:'
                numberDisplay.current.textContent = `${reactionTime} ms`;

                //countdown then start game
                overlay.current.style.display = 'flex';
                overlay.current.textContent = '3';
                timeoutRef.current = setTimeout(() => {
                    overlay.current.textContent = '2'
                    timeoutRef.current = setTimeout(() => {
                        overlay.current.textContent = '1'
                        timeoutRef.current = setTimeout(()=>{
                            overlay.current.textContent = ''
                            playRound()
                        }, 1000); 
                    }, 1000);
                }, 1000);

            } else {
                endGame(true);
            }
            setCorrectClicks(prev=>prev + 1)
        } else { //if user clicked wrong button
            //if game didn't end
            if (rounds > 0){
                //display text
                numberDisplay.current.textContent = 'Wrong!!';
                instructions.current.textContent = '';

                //countdown then start game
                overlay.current.style.display = 'flex';
                overlay.current.textContent = '3';
                timeoutRef.current = setTimeout(() => {
                    overlay.current.textContent = '2'
                    timeoutRef.current = setTimeout(() => {
                        overlay.current.textContent = '1'
                        timeoutRef.current = setTimeout(()=>{
                            overlay.current.textContent = ''
                            playRound()
                        }, 1000); 
                    }, 1000);
                }, 1000);

            } else {
                endGame(false);
            }

        }
        
    }

    function endGame(correctClick) { 

        //calculate result
        let result;
        //if user clicked correct button in the last round
        if(correctClick){
            let lastRound = new Date().getTime() - startTime;
            result = (totalReactionTime + lastRound) / (correctClicks+1)
        } 
        //if user clicked wrong button
        else {
            result = totalReactionTime / (correctClicks === 0 ? 1 : correctClicks)
        }
        result = Math.ceil(result);
        //display text
        instructions.current.textContent = `Average Reaction Time: `;
        numberDisplay.current.textContent = `${result} ms`
    
    
        //reset variables
        setRounds(5);
        setTotalReactionTime(0);
        setCorrectClicks(0);

        //upload results then show restart button
        uploadResult(result);
    }

    function uploadResult(result) {
        setLoading('Uploading your result...')
        setError(false)
        setSuccess(false)
        fetch('http://localhost:2500/gameResult', {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify({result, game: 'keypad game'}),
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
            startButton.current.style.display = 'unset'
            startButton.current.textContent = 'Restart Game'
        })
    }

    let userInfo = useUser()
    let navigate = useNavigate();
    return (<>
        <header data-bs-theme="dark">
            <div className="navbar navbar-dark bg-dark shadow-sm" style={{position: 'fixed', zIndex: '100', top: '0', width: '100%', height: '60px', justifyContent: 'center'}}>
              <div >
                <Link to="../" className="navbar-brand d-flex align-items-center">
                  <strong>App Name</strong>
                </Link>
              </div>
            </div>
          </header>
    <div className='d-flex flex-column  align-items-center py-4 bg-body-tertiary' style={{minHeight: "100vh"}}>

        {userInfo.auth === false && navigate('../login', {replace: true})}
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
        
{/*         <button className='btn btn-outline-dark' onClick={()=>{navigate('/', {relative: false})}}>back</button> */}
        <h2>Reaction Test Game</h2>
        <div id="game-container">
            <div className="game-area">
                <p className="instructions-display" ref={instructions}></p>
                <p className="number-display" ref={numberDisplay}></p>
                <button className="btn btn-primary start-button btn-lg" type="button" ref={startButton} onClick={startButtonClick}>Start Game</button>
            </div>

            <div id="keypad">
                {digits.sort(()=> Math.random() - 0.5).map((digit) => {
                    return (isBtnDisabled ? 
                    <button 
                    className='btn btn-outline-secondary' 
                    onClick={()=>{numClick(digit)}} 
                    type='button' key={digit}
                    disabled>??</button> :
                    <button 
                    className='btn btn-outline-secondary' 
                    onClick={()=>{numClick(digit)}} 
                    type='button' key={digit}>{digit}</button>)
                })}
            </div>
    </div>
    </div></>)
}

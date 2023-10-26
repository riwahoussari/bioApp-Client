import '../stylesheets/keypadGame.css'
import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
export default function MathGame(){
    const [currentQuestion, setCurrentQuestion] = useState({})
    const [rounds, setRounds] = useState(5);
    const [totalReactionTime, setTotalReactionTime] = useState(0)
    const [correctClicks, setCorrectClicks] = useState(0);
    const [startTime, setStartTime] = useState(0);
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

    function generateQuestion(format, opNum){
        function generateChoices(num1, num2, answer){
            let choices = []
            //choice 1 (correct choice)
            choices.push(answer)
            //choice 2 (difference of the two displayed numbers)
            let b = Math.abs(num1 - num2)
            if(b!==answer){choices.push(b)}
            else{choices.push(b+1)}
            //choice 3 (random number within 3 of the answer)
            let c = answer + Math.ceil(Math.random() * 3)
            while(choices.includes(c)){c = answer + Math.ceil(Math.random() * 3)}
            choices.push(c)
            //choice 4 (random number between 1 and 20)
            let a = Math.ceil(Math.random() * 20)
            while(choices.includes(a)){a = Math.ceil(Math.random() * 20)}
            choices.push(a)
            
            //shuffle choices so that the correct answer isn't always in the same place
            choices.sort(()=> Math.random() -0.5)
            
            return choices
        }
      // 2 Random numbers between 1 and 9
      const num1 = Math.floor(Math.random() * 9) + 1; 
      const num2 = Math.floor(Math.random() * 9) + 1;
      const operation = ['+', '-', '*', '/'][opNum]
    
      let answer, question, correctChoice, choices = [];
    
      //generate equation base on the operator
      switch (operation) {
        case '+':
          answer = num1 + num2;
          break;
        case '-':
          answer = num1 - num2;
          break;
        case '*':
          answer = num1 * num2;
          break;
        case '/':
          answer = num1 / num2;
          break;
        default: 
            break;
      }
    
        //format question, choices, correct choice according to missing part
        if(format === 0){
            question = `... ${operation} ${num2} = ${answer}`
            choices = generateChoices(num2, answer, num1)
            correctChoice = num1
        }else if(format === 1){
            question = `${num1} ... ${num2} = ${answer}`
            choices = ['+', '*', '/', '-'].sort(()=>Math.random()-0.5)
            correctChoice = operation
        }else if(format === 2){
            question = `${num1} ${operation} ... = ${answer}`
            choices = generateChoices(num1, answer, num2)
            correctChoice = num2
        }else if(format === 3){
            question = `${num1} ${operation} ${num2} = ...`
            choices = generateChoices(num1, num2, answer)
            correctChoice = answer
        }
    
        
        
        //if equation is unaccepted regenerate with same format and operator
        if( (num1===2 && num2===2 && (operation==='*'||operation==='+')) ||
            (num2===1 && (operation==='/'||operation==='*')) ||
            !Number.isInteger(answer)) {return generateQuestion(format, opNum)}
        else{
            const equation = {
                q: question,
                a: choices,
                correct: correctChoice
            }
            //return generated equation
            return equation;
        }
        
    }

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
    
            //generate random question
            let format = Math.floor(Math.random()*4);
            let opNum = Math.floor(Math.random()*4)
            let newQuestion = generateQuestion(format, opNum)
            setCurrentQuestion(newQuestion)
            //after random time
            timeoutRef.current = setTimeout(() => {
                console.log('timeout code did execute')
                //display random number
                numberDisplay.current.textContent = newQuestion.q;
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
        if(num === currentQuestion.correct){

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
                endGame(true)
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
                endGame(false)
            }
        }
    }

    function endGame(correctClick) {

        //calculate result
        let result;
        //if user clicked correct button in the last round
        if(correctClick){
            //calculate results
            let lastRound = new Date().getTime() - startTime;
            result = (totalReactionTime + lastRound) / (correctClicks+1)
            
        } 
        //if user clicked wrong button
        else {
            //calculate results
            result = totalReactionTime / (correctClicks === 0 ? 1 : correctClicks)
        }
        result = Math.ceil(result);

        //display final results
        instructions.current.textContent = `Average Reaction Time: `;
        numberDisplay.current.textContent = `${result} ms`
        
        //reset variables
        setRounds(5);
        setTotalReactionTime(0);
        setCorrectClicks(0);

        //upload results then show restart game button
        uploadResult(result)
    }

    function uploadResult(result) {
        setLoading('Uploading your result...')
        setError(false)
        setSuccess(false)
        fetch('http://localhost:2500/gameResult', {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify({result, game: 'math game'}),
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
{/*         <button className='btn btn-link' onClick={()=>{navigate('/', {relative: false})}}>back</button> */}
        <h2>Reaction Test Game</h2>
        <div id="game-container">
            <div className="game-area">
                <p className="instructions-display" ref={instructions}></p>
                <p className="number-display" ref={numberDisplay}></p>
                <button className="btn btn-primary start-button" type="button" ref={startButton} onClick={startButtonClick}>Start Game</button>
            </div>

            <div id="keypad" style={{gridTemplateColumns: '1fr 1fr'}}>
                {isBtnDisabled ? 
                    ['1','2','3','4'].map(i=>{
                        return <button style={{fontSize: '24px'}}
                        className='btn btn-outline-secondary'  
                        type='button' key={i}
                        disabled>??</button>
                    }) 
                    :
                    (currentQuestion.a && currentQuestion.a.map((answer, i)=>{
                        return <button style={{fontSize: '24px'}}
                        className='btn btn-outline-secondary' 
                        onClick={()=>{numClick(answer)}} 
                        type='button' key={i}>{answer}</button>
                    }))
                }
            </div>
    </div>
    </div></>)
}

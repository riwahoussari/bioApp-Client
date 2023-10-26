import { Link, useNavigate } from 'react-router-dom'
import {useUser} from '../hooks/useUser'
export default function HomePage(){
  const navigate = useNavigate()
  const path = new URL(window.location.href).pathname
  navigate(`.${path}`, {replace: true})
  
  let userInfo = useUser();
  return (<>
  <header data-bs-theme="dark">
  
    <div className="navbar navbar-dark bg-dark shadow-sm" style={{position: 'fixed', zIndex: '100', top: '0', width: '100%', height: '60px', justifyContent: 'start', display: 'flex'}}>
      <div className="text-center" >
        <Link to="./" className="navbar-brand d-flex align-items-start">
          <strong>App Name</strong>
        </Link>
      </div>
    </div>
    {!userInfo.auth && <div
      style={{
      position: 'fixed',
      top: '15px',
      right: '60px',
      zIndex: '101'
    }}>
  
      <Link to='./signup' className='btn btn-outline-light btn-sm' >Sign Up</Link>
      <Link to='./login' className='btn btn-light btn-sm ms-3'>Login</Link>
    </div>}
</header>

<main>


<div className="album py-6 bg-body-tertiary" style={{minHeight: '100vh', position: 'relative'}}>
  <div className="container">

    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
    <div className="col">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4>Red light green light</h4>
            <p className="card-text">Tap the box as soon as it turn green.</p>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Link to={'../RedLightGreenLight'}><button type="button" className="btn btn-sm btn-primary">Play Game</button></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4>Keypad Game</h4>
            <p className="card-text">Wait for a word to appear then click the corresponding number asap.</p>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Link to='../KeypadGame'><button type="button" className="btn btn-sm btn-primary">Play Game</button></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4>Quick Math</h4>
            <p className="card-text">Complete the simple math equation.</p>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Link to='../MathGame'><button type="button" className="btn btn-sm btn-primary">Play Game</button></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4>Memory Game</h4>
            <p className="card-text">Memorize the sequence of symbols then try to click it in order after it's dissapeared. </p>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Link to='../MemoryGame'><button type="button" className="btn btn-sm btn-primary">Play Game</button></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
<p style={{
  position: 'absolute',
  bottom: '0px',
  left: '50%',
  opacity: '0.5',
  transform: 'translateX(-50%)'
}}>created by Riwa Houssari</p>
</div>
</main>

    </>)
}

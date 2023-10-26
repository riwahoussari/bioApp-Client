import { Link, useNavigate } from 'react-router-dom'
import '../stylesheets/loginPage.css'
import { useState } from 'react'
export default function SignupPage (){
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

async function handleSubmit(e){
  e.preventDefault();
  setError(false)
  const form = e.target;
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key)=>{
    data[key] = value;
  })
  if(data.password !== data.password2){
    setError('Passwords must match');
    return
  }
  setLoading(true)

  // fetch('http://localhost:2500/auth/register', {
  fetch('https://bioclock.onrender.com/auth/register', {
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify(data),
      credentials: 'include'
  }).then(res => {
      if(!res.ok){
        setLoading(false)
        throw Error("couldn't create user")
      }
      return res.json()
  }).then(res => {
      setLoading(false)
      if(res.success){
        sessionStorage.setItem('userInfo', JSON.stringify({auth: true, user: res.user}))
        navigate('../', {replace: true})
      }else{
        throw Error(res.message)
      }
  }).catch(err => setError(err.message))
}
  return (<>
  {error && 
    <div id='popup'>
      <p style={{margin: '0', padding: '10px 20px'}}>{error}</p>
      <button className='btn btn-close p-3' onClick={()=>setError(null)} />
    </div>
  }
  {loading && 
    <div id='popup' className='loadingPopup'>
      <p style={{margin: '0', padding: '10px 20px'}}>Creating account...</p>
    </div>
  }
    <header data-bs-theme="dark">
      <div className="navbar navbar-dark bg-dark shadow-sm" style={{position: 'fixed', zIndex: '100', top: '0', width: '100%', height: '60px', justifyContent: 'center'}}>
        <div >
          <Link to="../" className="navbar-brand d-flex align-items-center m-0">
            <strong>App Name</strong>
          </Link>
        </div>
      </div>
    </header>
    

  <div className='d-flex align-items-center bg-body-tertiary'>
  <main className="form-signin m-auto p-0">
    
    <form onSubmit={(e)=>handleSubmit(e)}>
    
    <div className="row">
    <h1 className="h3 mb-3 fw-normal ps-1">Registration</h1>
    </div>
    <div className="row">
        <div className="col-md-6 mb-2 px-1">

          <div className="form-floating">
            <input name='username' type="text" id="username" className="form-control form-control-lg" placeholder='Username'required/>
            <label htmlFor="username">Username</label>
          </div>

        </div>
        <div className="col-md-6 mb-2 px-1 d-flex align-items-center">

          <div className="form-floating datepicker w-100">
            <input name='age' type="number" min={'12'} max={'70'} className="form-control form-control-lg" id="birthdayDate" placeholder='Birthday' required/>
            <label htmlFor="birthdayDate">Age</label>
          </div>

        </div>
    </div>

    <div className="row">
      <div className="col-md-6 mb-2 px-1">

        <div className="form-floating">
          <input name="password" type="password" id="firstName" className="form-control form-control-lg" placeholder='Create Password' required/>
          <label htmlFor="firstName">Create Password</label>
        </div>

      </div>
      <div className="col-md-6 mb-3 px-1">

        <div className="form-floating">
          <input name='password2' type="password" id="lastName" className="form-control form-control-lg" placeholder='Repeat Password' required/>
          <label htmlFor="lastName" required>Repeat Password</label>
        </div>

      </div>
      </div>

    <div className="row">           
      <div className="col-md-6 ps-2">
        <h6 className="mb-2 pb-1">Gender: </h6>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="gender" id="maleGender"
            value="male" checked/>
          <label className="form-check-label" htmlFor="maleGender">Male</label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="gender" id="femaleGender"
            value="female" />
          <label className="form-check-label" htmlFor="femaleGender">Female</label>
        </div>

      </div>
    </div>

    <div className="mt-4 p-2 row">
        <button className="btn btn-primary btn-lg" type="submit" value="Submit">Create account</button>
        <p className='mt-2 ps-1'>Already have an account? <Link to='../login'>Log in</Link> </p>
    </div>

    </form>

  </main>
  </div>
</>)
}

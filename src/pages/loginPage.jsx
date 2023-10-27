import { Link, useNavigate } from 'react-router-dom'
import '../stylesheets/loginPage.css'
import { useState } from 'react';
export default function LoginPage (){
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  async function handleSubmit(e){
    e.preventDefault();
    setError(false)
    setLoading(true)
    const form = e.target;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key)=>{
      data[key] = value;
    })
      // fetch('http://localhost:2500/auth/login', {
      fetch('https://bioclock.onrender.com/auth/login', {
          method: "POST",
          headers: {"Content-Type": 'application/json'},
          credentials: "include",
          body: JSON.stringify(data)
      }).then(res => {
        if(!res.ok && res.status === 401){
          setLoading(false)
          throw Error("username or password is incorrect")
        }else if(!res.ok){
          setLoading(false)
          throw Error("Server response no ok. Please try again")
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
      <p style={{margin: '0', padding: '10px 20px'}}>Logging in...</p>
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

  <main className="form-signin m-auto p-0" style={{maxWidth: '330px'}}>
  <form onSubmit={(e)=>{handleSubmit(e)}}>
    
    <h1 className="h3 mb-3 fw-normal">Please log in</h1>

    <div className="form-floating mb-2">
      <input name='username' type="text" className="form-control" id="floatingInput" placeholder='Username' required/>
      <label htmlFor="floatingInput">Username</label>
    </div>
    <div className="form-floating mb-2">
      <input name='password' type="password" className="form-control" id="floatingPassword" placeholder="Password" required/>
      <label htmlFor="floatingPassword">Password</label>
    </div>

    <button className="btn btn-primary btn-lg w-100 py-2 mt-3" type="submit">Log in</button>
    <p className='mt-2'>Don't have an account? <Link to='../signup'>Sign up</Link> </p>
</form>
</main>
</div>
</>)
}

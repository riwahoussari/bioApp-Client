import {createBrowserRouter, Route, createRoutesFromElements, RouterProvider} from 'react-router-dom'
import LoginPage from './pages/loginPage'
import SignupPage from './pages/signupPage'
import HomePage from './pages/homePage'
import  RedLightGreenLight from './games/RedLightGreenLight'
import  KeypadGame from './games/KeypadGame'
import  MemoryGame from './games/MemoryGame'
import MathGame from './games/MathGame'
import Page404 from './pages/404'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<HomePage/>}/>

      <Route path='login' element={<LoginPage/>}></Route>
      <Route path='signup' element={<SignupPage/>}></Route>


      <Route path='RedLightGreenLight' element={<RedLightGreenLight/>}></Route>
      <Route path='KeypadGame' element={<KeypadGame/>}></Route>
      <Route path='MemoryGame' element={<MemoryGame/>}></Route>
      <Route path='MathGame' element={<MathGame/>}></Route>

      <Route path='*' element={<Page404/>}/>
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

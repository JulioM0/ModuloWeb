import './estilos/App.css'
import Navbar from './utilidades/navbar'
import Table from './utilidades/table'

function App() {
  return (
    <>
      <h1>Lista de Activos</h1>
      <div>
          <Navbar/>
          <div className='main-content'>
          <Table/>
          </div>
      </div>
   </>
  )
}
export default App

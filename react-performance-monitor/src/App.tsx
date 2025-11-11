import './App.css'
import { Header } from '@/components/Header'
import { Stats } from '@/components/Stats'
import { Sidebar } from '@/components/Sidebar'
import { ComponentTable } from '@/components/ComponentTable'


function App() {


  return (
    <>

      <Header />

      <Stats />

      <div className='flex h-full'>

        <div className='w-40 border-r border-[#cccccc1f] text-left'>
          <Sidebar />
        </div>

        <div className='flex-1'>
          <ComponentTable />
        </div>

      </div>
     
    </>
  )
}

export default App

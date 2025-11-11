import './App.css'
import { Header } from '@/components/Header'
import { Stats } from '@/components/Stats'
import { Sidebar } from '@/components/Sidebar'
import { ComponentTable } from '@/components/ComponentTable'


function App() {


  return (
    <>

      <div className='fixed top-0 left-0 w-full z-10 bg-background'>
        <Header />
      </div>

      <div className='mt-9'>

        <Stats />

        <div className='flex h-full'>

          <div className='w-40 border-r border-[#cccccc1f] text-left'>
            <Sidebar />
          </div>

          <div className='flex-1'>
            <ComponentTable />
          </div>

        </div>

      </div>

    </>
  )
}

export default App

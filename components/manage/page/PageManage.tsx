import ContextProvider from 'store/ContextProvider'
import OutLines from './Outline'
import { PageList } from './PageList'
import PageDetail from './PageDetail'

export default function PageManage() {
  return (
    <ContextProvider>
      <div className="flex h-screen">
        <div className={'h-full w-[15%]'}>
          <OutLines />
        </div>
        <div className={'h-full w-[25%] border border-r border-gray-500'}>
          <PageList />
        </div>
        <div className={'h-full w-3/5'}>
          <PageDetail />
        </div>
      </div>
    </ContextProvider>
  )
}

import ContextProvider from 'store/ContextProvider'
import OutLines from './Outline'
import { PageList } from './PageList'
import PageDetail from './PageDetail'
import Space,{ Fill,Fixed, Right, Left, LeftResizable, RightResizable, ViewPort, BottomResizable, TopResizable, } from 'react-spaces'
import { useEffect, useState } from 'react'


export default function PageManage() {
  function description(value:string){
    return value
  }

  const [show,setShow] = useState(false);

  useEffect(function(){
    setShow(true)
  },[])

  if(!show){
    return null;
  }
  return (
    <ContextProvider>
     <ViewPort allowOverflow={false}>
          <LeftResizable size="40%" minimumSize={400} maximumSize={800} allowOverflow={false} trackSize={false} className='border border-right border-gray-500'>
              <LeftResizable size={'40%'} maximumSize={150}>
                <OutLines />
              </LeftResizable>
              
              <Fill>
                <PageList />
              </Fill>
            </LeftResizable>
            <Fill allowOverflow={false}>
              <PageDetail />
            </Fill>
            {/* <RightResizable size={'60%'} minimumSize={300} allowOverflow={false} trackSize={false}>
              
            </RightResizable> */}
     </ViewPort>
    </ContextProvider>
  )
}
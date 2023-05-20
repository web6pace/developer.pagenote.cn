import { createContext } from 'use-context-selector'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { WebPage } from '@pagenote/shared/lib/@types/data'
import { Query } from '@pagenote/shared/lib/@types/database'

type State = {
  // 分组方式
  groupType?: keyof WebPage
  // 过滤器名称（用户可见）
  groupFilterName?: string
  // 过滤器（API请求）
  webpageFilter?: Query<WebPage>
  // 当前选中页面
  selectedPageKey?: string

  // 批量选中页面
  batchSelected?: Set<string>
}

const initState: Required<State> = {
  groupType: 'categories',
  webpageFilter:{},
  groupFilterName: '',
  selectedPageKey: '',
  batchSelected: new Set()
}

export const context = createContext<[State, Dispatch<SetStateAction<State>>]>(
  null as any
)

const ContextProvider = (props: { children: React.ReactElement }) => {
  const [innerState, setInnerState] = useState(initState)

  useEffect(function(){
    // todo 存入 indexed db 或插件持久化
    const object = JSON.parse(
      localStorage.getItem('pageManageState') || JSON.stringify(initState)
    )
    const state = {
      ...initState,
      ...object
    }
    delete state.batchSelected
    console.log(state,'init state')
    setInnerState(state)
  },[])

  useEffect(function(){
    localStorage.setItem('pageManageState', JSON.stringify(innerState))
  },[innerState])

  // @ts-ignore
  const updateState: Dispatch<SetStateAction<State>> = useCallback(
    function (state: State) {
      const data = {
        ...innerState,
        ...state,
      }
      setInnerState(data)
    },
    [innerState]
  )

  return (
    <context.Provider value={[innerState, updateState]}>
      {props.children}
    </context.Provider>
  )
}
export default ContextProvider

import usePageGroup, { PageGroup } from 'hooks/store/usePageGroup'
import { useContextSelector } from 'use-context-selector'
import { context } from 'store/ContextProvider'
import { useCallback, useEffect, useMemo, useRef } from 'react'

export default function OutLines() {
  const [groups = []] = usePageGroup()
  const { groupFilterName } = useContextSelector(context, (v) => v[0])
  const setState = useContextSelector(context, (v) => v[1])
  const outlineRef = useRef<HTMLDivElement>(null)

  function setGroup(group: PageGroup) {
    const { groupName, query } = group
    setState({
      groupFilterName: groupName,
      webpageFilter: query,
    })
  }

  const setPreOrNext = useCallback(
    (num: number) => {
      const index = groups.findIndex(
        (item) => item.groupName === groupFilterName
      )
      if (index === -1) {
        return
      }
      const nextIndex = index + num
      if (nextIndex >= 0 && nextIndex < groups.length) {
        setGroup(groups[nextIndex])
      }
    },
    [groupFilterName, groups]
  )

  useEffect(
    function () {
      const listener = function (e: KeyboardEvent) {
        if (e.key === 'ArrowDown') {
          setPreOrNext(1)
        }
        if (e.key === 'ArrowUp') {
          setPreOrNext(-1)
        }
      }
      // 监听键盘事件
      const EVENT_NAME = 'keydown'
      const ROOT_ELEMENT = outlineRef.current || document.documentElement
      ROOT_ELEMENT?.addEventListener(EVENT_NAME, listener)
      return function () {
        ROOT_ELEMENT?.removeEventListener(EVENT_NAME, listener)
      }
    },
    [setPreOrNext]
  )

  function scrollToView() {
    const item = document.querySelector('.active-group-item')
    if (item) {
      item.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
    } else {
      console.log('没有选中的页面')
    }
  }

  // 保证选中的item在视图中
  useEffect(
    function () {
      const timer = setTimeout(scrollToView, 2000)
      return function () {
        clearTimeout(timer)
      }
    },
    [groupFilterName]
  )

  // const groupTypes: { label: string, value: keyof WebPage }[] = [
  //     {
  //         label: "标签分组",
  //         value: "categories"
  //     },
  //     {
  //         label: "域名分组",
  //         value: "domain"
  //     },
  //     {
  //         label: "时间分组",
  //         value: "updateAtDay"
  //     }
  // ]

  return (
    <div
      ref={outlineRef}
      tabIndex={0}
      className={'p-2 max-h-full overflow-auto select-none'}
    >
      {/*<ul className="grid grid-flow-col text-center text-gray-500 bg-gray-100 rounded-full p-1">*/}
      {/*    {*/}
      {/*        groupTypes.map((item) => (*/}
      {/*            <li key={item.label} onClick={() => {*/}
      {/*                setState({*/}
      {/*                    groupType: item.value,*/}
      {/*                })*/}
      {/*            }}>*/}
      {/*                <div*/}
      {/*                    className={`flex justify-center  py-1 ${item.value === groupType ? " bg-white rounded-full shadow text-indigo-900" : ""}`}>*/}
      {/*                    {item.label}*/}
      {/*                </div>*/}
      {/*            </li>*/}
      {/*        ))*/}
      {/*    }*/}
      {/*</ul>*/}
      {useMemo(
        () => (
          <ul>
            {groups.map((item, index) => {
              return (
                <li
                  onClick={() => {
                    setGroup(item)
                  }}
                  className={`py-1 px-2 text-sm flex justify-between cursor-pointer ${
                    groupFilterName === item.groupName
                      ? 'active-group-item bg-amber-400 text-white'
                      : ''
                  }`}
                  key={index}
                >
                  <span>{item.groupName} </span>
                  <span> {item.groupCnt}</span>
                </li>
              )
            })}
          </ul>
        ),
        [groups, groupFilterName]
      )}
    </div>
  )
}

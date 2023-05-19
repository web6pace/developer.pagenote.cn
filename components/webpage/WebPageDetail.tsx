import { WebPage } from '@pagenote/shared/lib/@types/data'
import dayjs from 'dayjs'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import extApi from '@pagenote/shared/lib/pagenote-api'
import PlainInputArea from '../form/PlainInputArea'
import ImgFallback from '../image/ImgFallback'
import { debounce, throttle } from 'lodash'
import useWebpage from '../../hooks/useWebpage'
import SlateEditor from './SlateEditor'
import ErrorBoundary from 'components/debug/ErrorBound'
import ErrorTip from 'components/debug/ErrorTip'
import LightsEditor from 'components/editor/LightsEditor'
import PageHead from './PageHead'
import { CgChevronDoubleDown, CgMaximize, CgTrashEmpty } from 'react-icons/cg' //css.gg/icons/svg/chevron-double-down.svg
import { basePath, isExt } from 'const/env'
import Head from 'next/head'

interface WebPageDetailProps {
  initWebpage?: WebPage | null
  pageKey?: string
}

function AsideActionBars(props: { pageKey: string; refresh?: () => void }) {
  const { pageKey } = props
  const ACTIONS = [
    {
      icon: <CgMaximize />,
      onclick: function () {
        const url = isExt ? `${basePath}/ext/page.html` : '/ext/page'
        window.open(url + '?id=' + pageKey)

        // extApi.commonAction
        //   .openTab({
        //     tab: {},
        //     url: url,
        //     reUse: true,
        //   })
        //   .then(function (res) {
        //     if (!res.success) {
        //       window.open(url + '?id=' + pageKey)
        //     }
        //   })
      },
      name: '新标签打开',
      shortcut: '', //'cmd+t',
    },
    // {
    //   icon: <TbDatabaseExport />,
    //   onclick: function () {},
    //   name: '导出',
    // },
    // {
    //   icon: <CgTrashEmpty />,
    //   onclick: function () {},
    //   name: '删除',
    // },
  ]
  return (
    <div
      className={
        'flex items-center border-l-[eeeeee] border-l border-1 text-sm text-color-150 select-none'
      }
    >
      <div className="dropdown dropdown-bottom dropdown-end ">
        <label
          tabIndex={0}
          className={'block cursor-pointer rounded text-[24px]'}
        >
          <CgChevronDoubleDown />
        </label>
        <div
          tabIndex={0}
          className="dropdown-content menu shadow w-[220px] bg-color-0 rounded mt-1 p-1"
        >
          {ACTIONS.map((item, index) => (
            <div
              key={index}
              tabIndex={0}
              className={
                'flex justify-between items-center p-1 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-gray-800'
              }
              onClick={item.onclick}
            >
              <div className={'flex items-center'}>
                <span className={'text-[20px]'}>{item.icon}</span>
                <span className={'ml-2'}>{item.name}</span>
              </div>
              {item.shortcut && (
                <span className="text-xs text-color-500">{item.shortcut}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function WebPageDetail(props: WebPageDetailProps) {
  const { initWebpage, pageKey = '' } = props
  const {
    data: webpage = initWebpage,
    isLoading: loading,
    mutate,
  } = useWebpage(pageKey)
  const [showContext, setShowContext] = useState(false)
  const { plainData } = webpage || {}
  const { snapshots = [] } = plainData || {}

  const savePage = useCallback(
    debounce(function (data: Partial<WebPage>) {
      if (!webpage?.key && !webpage?.url) {
        return
      }
      extApi.page
        .update({
          data: data,
          query: {
            $or: [{ key: webpage?.key }, { url: webpage?.url }],
          },
        })
        .then(function (res) {
          console.log('savePage', res)
          mutate()
        })
    }, 400),
    [webpage]
  )

  function onChangeDescription(value: string) {
    // 对输入内容清空换行符
    savePage({
      description: value,
    })
  }

  function onTitleChange(value: string) {
    savePage({
      title: value,
    })
  }

  function fetchAbstract(e: React.FocusEvent<HTMLButtonElement>) {
    console.log('fetchAbstract')
    e.stopPropagation()
    e.preventDefault()
  }

  // if (!webpage) {
  //     return (
  //         <div></div>
  //     )
  // }

  const { cover, icon, url, title } = webpage || {}
  const pageCover = []
  if (cover) {
    pageCover.push(cover)
  }
  console.log(snapshots)
  if (snapshots.length) {
    pageCover.push(...snapshots)
  }
  if (pageCover.length === 0) {
    pageCover.push(
      'https://images.unsplash.com/photo-1570393080660-de4e4a15a247?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=3600'
    )
  }

  const thumbs = pageCover.map((img) => {
    return {
      img: img,
    }
  })

  const loadingClass = loading ? 'loading-block' : ''

  return (
    <ErrorBoundary fallback={ErrorTip}>
      <Head>{title && <title>{title}</title>}</Head>
      <div className="font-sans h-full flex flex-col	overflow-auto">
        <div className="shrink-0">
          <PageHead thumbs={thumbs}>
            <div className="absolute bottom-0 right-6 mb-2 flex bg-color-150 text-color-100 rounded">
              <label className="flex items-center  text-xs p-1 select-none">
                <span>显示上下文</span>
                <input
                  type="checkbox"
                  className="toggle toggle-sm toggle-success"
                  checked={showContext}
                  onChange={(e) => setShowContext(e.target.checked)}
                />
              </label>
              <AsideActionBars pageKey={pageKey} />
            </div>
          </PageHead>
        </div>

        <main className="relative m-auto flex-grow w-full max-w-7xl px-6">
          <div className={'relative flex justify-end w-full pt-2'}>
            <div className="absolute -top-8 left-0 z-10">
              <a href={url} target={'_blank'}>
                <ImgFallback
                  key={icon}
                  title={'点击前往：' + url}
                  className="w-16 h-16"
                  src={icon}
                  alt=""
                />
              </a>
            </div>
          </div>
          <div className="h-full m-auto py-12 ">
            <article className="relative h-full m-auto flex flex-col">
              <h1 className={`shrink-0 font-bold text-3xl ${loadingClass}`}>
                <PlainInputArea
                  maxLength={80}
                  innerState={true}
                  singleLine={true}
                  readonly={true}
                  tabIndex={0}
                  placeholder={'设置一个标题'}
                  value={webpage?.title || ''}
                  onInputChange={onTitleChange}
                >
                  <div
                    className={
                      'max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis'
                    }
                  >
                    {webpage?.title || webpage?.url || '无标题'}
                  </div>
                </PlainInputArea>
              </h1>
              {/*href={`/ext/page?id=${webpage?.key}`}*/}
              <div
                className={`shrink-0 text-color-600 text-sm my-2 ${loadingClass}`}
              >
                <PlainInputArea
                  maxLength={240}
                  tabIndex={0}
                  placeholder={'输入一段摘要'}
                  readonly={true}
                  value={webpage?.description || ''}
                  innerState={true}
                  onInputChange={onChangeDescription}
                >
                  {webpage?.description || (
                    <span>{webpage?.url || '无摘要'}</span>
                  )}
                  {/*TODO 基于内容自动生成摘要*/}
                  {/*<button onFocus={fetchAbstract} className={'btn btn-outline btn-xs'}>抓取摘要</button>*/}
                </PlainInputArea>
              </div>
              <nav
                className={`shrink-0  flex mt-1 items-center text-color-500 dark:text-color-400 ${loadingClass}`}
              >
                <time className="mr-2 text-xs md:ml-0">
                  {webpage?.updateAt && dayjs(webpage?.updateAt).format('YYYY-MM-DD HH:mm')}
                </time>
                <div className="flex flex-nowrap max-w-full overflow-x-auto article-tags gap-2 min-w-[80px]">
                  {webpage?.categories?.map((item, index) => (
                    <button
                      key={index}
                      className="text-xs text-color-500 font-normal rounded-full bg-gray-200 px-2 py-1 cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </nav>

              <div className="h-full mt-4 p-0 leading-7 my-1 editor-container">
                <LightsEditor
                  pageKey={webpage?.key || ''}
                  showContext={showContext}
                />
                {/* <SlateEditor key={webpage?.key} steps={webpage?.plainData?.steps || []}/> */}
              </div>
            </article>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}

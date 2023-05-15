import { Step } from '@pagenote/shared/lib/@types/data'
import BasicEditor from './BasicEditor'
import extApi from '@pagenote/shared/lib/pagenote-api'
import useLightDetail from 'hooks/useLightDetail'
import { useMemo, useRef, useState } from 'react'
import { ReactEditor } from 'slate-react'
import { Editor, Span } from 'slate'
import focusEditor from './utils/focusEditor'

interface Props {
  lightid: string
  showContext?: boolean
  // 初始值
  initialLight?: Partial<Step>
  // 删除回调
  // eslint-disable-next-line no-unused-vars
  onDelete?: (lightId: string) => void
  // 更新回调
  // eslint-disable-next-line no-unused-vars
  onUpdate?: (lightId: string) => void
}

export default function LightItemEditor(props: Props) {
  const { lightid, initialLight, showContext } = props
  const { data, isLoading } = useLightDetail(lightid)
  const [focus, setFocus] = useState(false)
  const editorRef = useRef<ReactEditor>(null)

  function updateLight(lightId: string, step: Partial<Step>) {
    if (!lightId) {
      return
    }

    extApi.light
      .update({
        query: {
          lightId,
        },
        data: {
          ...step,
          updateAt: Date.now(),
        },
      })
      .then(function (res) {
        console.log(res)
        // mutate()
      })
  }

  function onFocus(focus: boolean) {
    setFocus(focus)
  }

  function focusLightEditor() {
    console.log('focusEditor')
    if (editorRef.current !== null) {
      focusEditor(editorRef.current)
    }
  }

  const light = data || initialLight
  // const loading = !light && isLoading
  return (
    <div
      className={`p-1 ${focus ? 'bg-color-100' : ''}`}
      tabIndex={0}
      onMouseEnter={() => {
        onFocus(true)
      }}
      onMouseLeave={() => {
        onFocus(false)
      }}
    >
      <div
        className={'border-l-4 pl-2 border-solid font-medium'}
        onClick={focusLightEditor}
        style={{ borderColor: light?.bg }}
      >
        {showContext && <span className="text-color-600">{light?.pre}</span>}
        <span>
          {light?.text}
          {/* TODO 图片没法显示 */}
        </span>
        {showContext && <span className="text-color-600">{light?.suffix}</span>}
      </div>
      <div className={'ml-3 text-color-300'} style={{ caretColor: light?.bg }}>
        {useMemo(
          () => (
            // TODO 优化，不监听 focus, 内部监听
            <BasicEditor
              readonly={focus ? false : true}
              ref={editorRef}
              html={light?.tip}
              placeholder="请输入批注"
              onchange={(value, html) => {
                updateLight(light?.lightId || '', {
                  ...light,
                  tip: html,
                })
              }}
            />
          ),
          [light?.tip, light?.lightId, focus]
        )}
      </div>
    </div>
  )
}

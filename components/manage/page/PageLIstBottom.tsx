import { type ReactNode, useEffect, useRef } from 'react'
import { useContextSelector } from 'use-context-selector'
import { context } from '../../../store/ContextProvider'
import usePageList from '../../../hooks/store/usePageList'

interface Props {
  children?: ReactNode
}

export default function PageLIstBottom(props: Props) {
  const { children } = props
  const allCheckRef = useRef<HTMLInputElement>(null)
  const { batchSelected } = useContextSelector(context, (v) => v[0])
  const setState = useContextSelector(context, (v) => v[1])

  const selectedCnt = batchSelected?.size || 0
  const [pageList = []] = usePageList()

  function toggleAll() {
    if (batchSelected?.size) {
      setState({
        batchSelected: new Set(),
      })
    } else {
      const newSet: Set<string> = new Set()
      pageList.forEach(function (page) {
        if (page.key) {
          newSet.add(page.key)
        }
      })
      setState({
        batchSelected: newSet,
      })
    }
  }

  useEffect(
    function () {
      if (!allCheckRef.current) {
        return
      }
      if (selectedCnt > 0 && selectedCnt !== pageList.length) {
        allCheckRef.current.indeterminate = true
      } else {
        // @ts-ignore
        allCheckRef.current.indeterminate = undefined
      }
    },
    [selectedCnt]
  )

  return (
    <div className="w-full text-sm text-color-300 px-4 flex items-center justify-between">
      <label className="flex items-center">
        <input
          onChange={toggleAll}
          ref={allCheckRef}
          checked={selectedCnt > 0}
          type="checkbox"
          className="checkbox mx-1"
        />
        {selectedCnt > 0 && <span>{selectedCnt} / </span>}
        <span>{pageList.length} pages</span>
      </label>
      <button className="btn btn-ghost btn-xs" disabled={selectedCnt < 1}>
        批量操作
      </button>
    </div>
  )
}

PageLIstBottom.defaultProps = {}

import { ReactComponentElement, type ReactNode } from 'react'
import QuestionSvg from '../assets/svg/question.svg'
import RateSvg from '../assets/svg/pingfen.svg'
import useWhoAmi from '../hooks/useWhoAmi'
import { useRouter } from 'next/router'
import HelpSvg from '../assets/svg/bangzhu.svg'
import SettingSvg from '../assets/svg/setting.svg'
import ShortCutInfo from './ShortCutInfo'

interface Props {
  children?: ReactNode
}

export default function HelpAside(props: Props) {
  const { children } = props
  const [whoAmi] = useWhoAmi()
  const { pathname } = useRouter()

  const asideList: {
    label: string
    link: string
    icon: ReactComponentElement<any>
    target?: '_self' | '_blank'
  }[] = [
    {
      label: '帮助',
      link: 'https://developer.pagenote.cn/question',
      icon: <HelpSvg className={'fill-current inline'} />,
    },
  ]
  if (pathname.includes('/ext')) {
    asideList.push({
      label: '设置',
      link: '/ext/setting.html',
      icon: <SettingSvg className={'fill-current inline'} />,
      target: '_blank',
    })
  } else {
    asideList.push({
      label: '设置',
      link: 'https://developer.pagenote.cn//setting',
      icon: <SettingSvg className={'fill-current inline'} />,
      target: '_self',
    })
  }
  if (!whoAmi?.isTest) {
    asideList.push({
      label: '评分',
      link: 'https://pagenote.cn/rate',
      icon: <RateSvg className={'fill-current inline'} />,
    })
  }
  return (
    <div className="">
      {children}
      <aside className={'fixed right-4 bottom-6 pb-2'}>
        <div className="dropdown dropdown-top dropdown-end">
          <label tabIndex={0}>
            <button className={'rounded-full bg-neutral text-neutral-content'}>
              <QuestionSvg className={'fill-current'} width={20} height={20} />
            </button>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content w-32 rounded right-4 mb-2 py-2 overflow-hidden bottom-full bg-neutral text-base-100 text-sm"
          >
            {asideList.map((item, index) => (
              <li key={index} className={'hover:bg-accent py-1 px-4'}>
                <a
                  className={' flex items-center w-full text-base-100'}
                  href={item.link}
                  target={item.target || '_blank'}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
            <li className={'hover:bg-accent py-1 px-4'}>
              <label htmlFor="shortcut-modal">
                <a className={' flex items-center w-full text-base-100'}>
                  <RateSvg className={'fill-current inline'} />
                  <span>快捷键</span>
                </a>
              </label>
            </li>
          </ul>
        </div>
      </aside>
      <input type="checkbox" id="shortcut-modal" className="modal-toggle" />
      <label htmlFor="shortcut-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <ShortCutInfo />
        </label>
      </label>
    </div>
  )
}

HelpAside.defaultProps = {}

import { type ReactNode } from 'react'
import useWhoAmi from '../../../hooks/useWhoAmi'
import useUserInfo from '../../../hooks/useUserInfo'
import DeviceInfo from '../../account/DeviceInfo'
import UserName from '../../account/UserName'

interface Props {}

export default function OutLineBottom(props: Props) {
  return (
    <div className={'px-4 w-full flex justify-between'}>
      <UserName />
      <DeviceInfo />
    </div>
  )
}

OutLineBottom.defaultProps = {}

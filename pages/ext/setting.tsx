import SettingCom from 'components/setting/Setting'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import BasicLayout from 'layouts/BasicLayout'

export default function Setting() {
  const [clientLoad, setClientLoad] = useState(false)

  useEffect(function () {
    setClientLoad(true)
  }, [])

  if (!clientLoad) {
    return null
  }

  return (
    <BasicLayout nav={false} footer={true} title={'设置'} full={true}>
      <div className={'p-4'}>
        <Router>
          <Routes>
            <Route path="/" element={<SettingCom />} />
            <Route path="/setting/*" element={<SettingCom />} />
          </Routes>
        </Router>
      </div>
    </BasicLayout>
  )
}

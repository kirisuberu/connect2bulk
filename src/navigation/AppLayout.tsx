import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import Sidebar from './Sidebar'

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <Wrapper>
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
      <Main $collapsed={collapsed}>
        <Outlet />
      </Main>
    </Wrapper>
  )
}

export default AppLayout

// styled-components (kept below the component at module scope per project rules)
const sidebarWidth = '264px'
const breakpoint = '768px' // mobile < 768, tablet/desktop >= 768
const collapsedWidth = '72px'

const Wrapper = styled.div<{ $collapsed: boolean }>`
  display: block;
  min-height: 100dvh;
  width: 100dvw;
`

const Main = styled.main<{ $collapsed: boolean }>`
  box-sizing: border-box;
  min-width: calc(100vw - ${(p) => (p.$collapsed ? sidebarWidth : collapsedWidth)}); /* avoid extra width beyond viewport when padding-left is applied */
  min-height: 100dvh;
  padding: 0; /* mobile: no left padding (sidebar is hidden) */
  position: relative; /* create a local stacking context below the tab */
  z-index: 0;
  
  @media (min-width: ${breakpoint}) {
    padding-left: ${(p) => (p.$collapsed ? collapsedWidth : sidebarWidth)}; /* desktop: make room for fixed sidebar */
  }

  /* Keep page from introducing horizontal scroll while allowing the fixed tab to overlay */
  overflow-x: hidden;
`

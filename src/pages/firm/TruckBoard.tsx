import React from 'react';
import styled from 'styled-components';
import FolderTabs from '../../components/FolderTabs';

const TruckBoard: React.FC = () => {
  return (
    <Page>
      <Content>
        <FolderTabs
          ariaLabel="Truckboard Sections"
          idPrefix="truckboard"
          tabs={[
            {
              id: 'posted',
              label: 'Posted Trucks',
              content: (
                <>
                  <PanelTitle>Posted Trucks</PanelTitle>
                  <PanelText>
                    Listing of all posted trucks will appear here.
                  </PanelText>
                </>
              ),
            },
            {
              id: 'search',
              label: 'Search Trucks',
              content: (
                <>
                  <PanelTitle>Search Trucks</PanelTitle>
                  <PanelText>
                    Search interface and results for trucks will appear here.
                  </PanelText>
                </>
              ),
            },
            {
              id: 'my',
              label: 'My Trucks',
              content: (
                <>
                  <PanelTitle>My Trucks</PanelTitle>
                  <PanelText>
                    Your saved and managed trucks will appear here.
                  </PanelText>
                </>
              ),
            },
          ]}
          brand={
            <Brand>
              <PageName>Truckboard</PageName>
              <Logo src="/logo128.png" alt="Connect2Bulk" />
            </Brand>
          }
        />
      </Content>
    </Page>
  );
};

// styled-components placed below the component (per preference)
const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #f7f8fb;
  padding: clamp(16px, 2vw, 32px);
  box-sizing: border-box;
`;

const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: auto;
`;

const Logo = styled.img`
  width: clamp(20px, 3vw, 28px);
  height: clamp(20px, 3vw, 28px);
  border-radius: 6px;
`;

const PageName = styled.span`
  font-weight: 700;
  color: #2a2f45;
  font-size: clamp(14px, 2vw, 18px);
`;

const Content = styled.main`
  background: #ffffff;
  border: 1px solid rgba(40, 44, 69, 0.06);
  border-radius: 12px;
  padding: clamp(16px, 2.5vw, 24px);
`;

const PanelTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #2a2f45;
  font-size: clamp(16px, 2.2vw, 18px);
`;

const PanelText = styled.p`
  margin: 0;
  color: #6c757d;
  font-size: clamp(12px, 1.8vw, 14px);
`;

export default TruckBoard;

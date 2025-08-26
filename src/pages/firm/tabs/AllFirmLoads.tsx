import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify-icon/react';
 

type Props = { onAddNewLoad: () => void };

const AllFirmLoads: React.FC<Props> = ({ onAddNewLoad }) => {
  // Search state
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const clearSearch = () => {
    setSearchText('');
    searchInputRef.current?.focus();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Wire up to data listing once implemented
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      clearSearch();
    }
  };

  // Global shortcut: Ctrl/Cmd+K focuses the search box
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      const isMetaK = (ev.ctrlKey || ev.metaKey) && (ev.key === 'k' || ev.key === 'K');
      if (isMetaK) {
        ev.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <Toolbar>
        <SearchForm onSubmit={handleSearchSubmit} role="search" aria-label="Search loads">
          <SearchInput
            ref={searchInputRef}
            type="text"
            placeholder="Search loads by any field"
            aria-label="Search loads by any field"
            value={searchText}
            onChange={handleSearchChange}
            onKeyDown={onSearchKeyDown}
            inputMode="search"
          />
          {searchText && (
            <ClearBtn type="button" onClick={clearSearch} aria-label="Clear search">
              <Icon icon="mdi:close" />
            </ClearBtn>
          )}
          <SearchBtn type="submit" aria-label="Search">
            <Icon icon="mdi:magnify" />
          </SearchBtn>
        </SearchForm>

        {/* Removed datalist to allow unrestricted free-text search */}

        <UserFilter aria-label="Filter by users">
          <option value="">Filter by users</option>
          <option value="all">All users</option>
        </UserFilter>

        <AddBtn type="button" onClick={onAddNewLoad} aria-label="Add new load">
          Add New Load
        </AddBtn>
      </Toolbar>

      <TableWrap>
        <StyledTable>
          <thead>
            <tr>
              <th>Age</th>
              <th>Load Number</th>
              <th>Pickup Date</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Trailer Type</th>
              <th>Equipment Requirement</th>
              <th>Miles</th>
              <th>Rate</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>{/* Data rows will render here */}</tbody>
        </StyledTable>

        <PaginationRow>
          <RowsPerPage>
            <span>Rows per page:</span>
            <RppSelect defaultValue={15} aria-label="Rows per page">
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </RppSelect>
          </RowsPerPage>
          <PageInfo>0-0 of 0</PageInfo>
          <Pager>
            <PageNavBtn aria-label="Previous page" disabled>
              <Icon icon="mdi:chevron-left" />
            </PageNavBtn>
            <PageNavBtn aria-label="Next page" disabled>
              <Icon icon="mdi:chevron-right" />
            </PageNavBtn>
          </Pager>
        </PaginationRow>
      </TableWrap>
    </>
  );
};

/* styled-components below the component (per preference) */
const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  background: #ffffff;
  border: 1px solid rgba(40, 44, 69, 0.08);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 12px;
`;

const SearchForm = styled.form`
  display: inline-flex;
  align-items: stretch;
  border: 1px solid rgba(40, 44, 69, 0.16);
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  max-width: 100%;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  padding: 10px 12px;
  width: min(380px, 70vw);
  font-size: 14px;
  font-family: inherit;
  background-color: #fff;
  color: #1f2937;

  &::placeholder { color: #9aa3b2; }
`;

const ClearBtn = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  color: #6b7280; /* gray-500 */
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:hover { color: #111827; background: #f3f4f6; }
  svg { width: 16px; height: 16px; }
`;

const SearchBtn = styled.button`
  appearance: none;
  border: none;
  background: #111827;
  color: #fff;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg { width: 18px; height: 18px; }
`;

const UserFilter = styled.select`
  appearance: none;
  border: 1px solid rgba(40, 44, 69, 0.16);
  border-radius: 8px;
  padding: 10px 12px;
  background: #fff;
  color: #1f2937;
  font-size: 14px;
  font-family: inherit;
  min-width: 180px;
`;

const AddBtn = styled.button`
  appearance: none;
  border: none;
  border-radius: 8px;
  padding: 10px 12px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  color: #ffffff;
  background: #1f2640;
  box-shadow: 0 4px 10px rgba(31, 38, 64, 0.25);
  transition: transform 80ms ease, background 160ms ease;
  margin-left: auto; /* push to the right on wide screens */

  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`;

/* Table */
const TableWrap = styled.div`
  border: 1px solid rgba(40, 44, 69, 0.06);
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  thead th {
    text-align: left;
    background: #f3f5f9;
    color: #2a2f45;
    font-weight: 700;
    font-size: 13px;
    padding: 12px;
    border-bottom: 1px solid rgba(40, 44, 69, 0.08);
  }

  tbody td {
    padding: 12px;
    font-size: 13px;
    color: #394260;
    border-top: 1px solid rgba(40, 44, 69, 0.04);
  }
`;

/* Pagination */
const PaginationRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-top: 1px solid rgba(40, 44, 69, 0.06);
`;

const RowsPerPage = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6c757d;
  font-size: 13px;
`;

const RppSelect = styled.select`
  border: 1px solid rgba(40, 44, 69, 0.16);
  border-radius: 6px;
  padding: 6px 8px;
  background: #fff;
  color: #1f2937;
`;

const PageInfo = styled.div`
  font-size: 13px;
  color: #6c757d;
`;

const Pager = styled.div`
  display: inline-flex;
  gap: 6px;
`;

const PageNavBtn = styled.button`
  appearance: none;
  border: 1px solid rgba(40, 44, 69, 0.16);
  background: #fff;
  color: #1f2937;
  width: 32px;
  height: 28px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg { width: 18px; height: 18px; }
`;

export default AllFirmLoads;
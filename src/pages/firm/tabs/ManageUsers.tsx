import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../../amplify/data/resource';
import { signUp } from 'aws-amplify/auth';
import { useAlert } from '../../../components/AlertProvider';

type Role = 'Admin' | 'Regular';

interface NewUserForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
}

const DEFAULT_FORM: NewUserForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'Regular',
};

const ManageUsers: React.FC = () => {
  // Force User Pool auth mode to avoid NotAuthorized errors when default outputs use IAM
  const client = useMemo(() => generateClient<Schema>({ authMode: 'userPool' } as any), []);
  const alertApi = useAlert();

  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<Array<Schema['User']['type'] & { id: string }>>([]);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState<NewUserForm>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [page, setPage] = useState(0);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Try User Pool first
      try {
        const { data, errors } = await client.models.User.list({ authMode: 'userPool' } as any);
        if (errors?.length) throw new Error(errors.map(e => e.message).join(', '));
        setUsers(data as any);
      } catch (err: any) {
        // Fallback to Identity Pool (IAM) if userPool fails due to auth
        const msg = String(err?.message ?? err);
        if (/Not Authorized/i.test(msg) || /Unauthorized/i.test(msg)) {
          const { data, errors } = await client.models.User.list({ authMode: 'identityPool' } as any);
          if (errors?.length) throw new Error(errors.map(e => e.message).join(', '));
          setUsers(data as any);
        } else {
          throw err;
        }
      }
    } catch (e: any) {
      console.error('Failed to load users:', e);
      alertApi.error({ title: 'Failed to load users', message: e?.message ?? 'Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const set = (key: keyof NewUserForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = (e.currentTarget as HTMLInputElement).value;
      setForm(prev => ({ ...prev, [key]: value }));
    };

  const sanitizeE164 = (input: string): string | undefined => {
    if (!input) return undefined;
    const only = input.replace(/[^0-9+]/g, '');
    const digits = only.replace(/[^0-9]/g, '');
    if (!digits) return undefined;
    return only.startsWith('+') ? `+${digits}` : `+${digits}`;
  };

  const generateTempPassword = () => `Tmp!${Math.random().toString(36).slice(-8)}A1`;

  const onAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const first = form.firstName.trim();
      const last = form.lastName.trim();
      const email = form.email.trim().toLowerCase();
      const phoneE164 = sanitizeE164(form.phone);
      if (!first || !last || !email) {
        setError('First name, last name, and email are required.');
        setSubmitting(false);
        return;
      }

      const tempPwd = generateTempPassword();

      // 1) Create Cognito account via signUp so user can log in later
      await signUp({
        username: email,
        password: tempPwd,
        options: { userAttributes: { email, given_name: first, family_name: last, ...(phoneE164 ? { phone_number: phoneE164 } : {}) } },
      });

      // 2) Persist to Amplify Data User model
      let created: any | null = null;
      try {
        const res = await client.models.User.create({
          first_name: first,
          last_name: last,
          email,
          phone: form.phone.trim(),
          role: form.role,
        }, { authMode: 'userPool' } as any);
        if (res.errors?.length) throw new Error(res.errors.map((e: any) => e.message).join(', '));
        created = res.data as any;
      } catch (err: any) {
        const msg = String(err?.message ?? err);
        if (/Not Authorized/i.test(msg) || /Unauthorized/i.test(msg)) {
          const res2 = await client.models.User.create({
            first_name: first,
            last_name: last,
            email,
            phone: form.phone.trim(),
            role: form.role,
          }, { authMode: 'identityPool' } as any);
          if (res2.errors?.length) throw new Error(res2.errors.map((e: any) => e.message).join(', '));
          created = res2.data as any;
        } else {
          throw err;
        }
      }

      // 3) Update local state and notify admin with temp password
      setUsers(prev => [created as any, ...prev]);
      setOpenModal(false);
      setForm(DEFAULT_FORM);

      const id = `invite-${Date.now()}`;
      const onCopy = async () => {
        try {
          await navigator.clipboard.writeText(`Email: ${email}\nTemp Password: ${tempPwd}`);
          alertApi.success({ title: 'Copied', message: 'Credentials copied to clipboard.' });
        } catch {}
      };
      alertApi.success({
        id,
        title: 'User invited',
        message: (
          <div>
            <div>
              We sent a confirmation email to {email}. Ask them to click the confirmation link to verify their account.
              On first sign-in, they will use the temporary password below and will be prompted to set a new password.
            </div>
            <pre style={{ margin: '8px 0', background: '#f8f9fa', padding: 8, borderRadius: 8 }}>
{`Email: ${email}
Temp Password: ${tempPwd}`}
            </pre>
            <div style={{ display: 'flex', gap: 8 }}>
              <SecondaryButton type="button" onClick={() => alertApi.close(id)}>Close</SecondaryButton>
              <PrimaryButton type="button" onClick={onCopy}>Copy</PrimaryButton>
            </div>
          </div>
        ),
      });
    } catch (err: any) {
      console.error('Add user failed:', err);
      setError(err?.message ?? 'Failed to add user');
    } finally {
      setSubmitting(false);
    }
  };

  const total = users.length;
  const start = page * rowsPerPage;
  const end = Math.min(start + rowsPerPage, total);
  const pageItems = users.slice(start, end);

  const nextPage = () => setPage(p => (end >= total ? p : p + 1));
  const prevPage = () => setPage(p => (p <= 0 ? 0 : p - 1));

  return (
    <Page>
      <HeaderRow>
        <Title>User List</Title>
        <PrimaryButton type="button" onClick={() => setOpenModal(true)}>Add New User</PrimaryButton>
      </HeaderRow>

      <Card>
        <TableWrap>
          <Table role="table" aria-label="User list">
            <thead>
              <tr>
                <Th scope="col">First Name</Th>
                <Th scope="col">Last Name</Th>
                <Th scope="col">Email</Th>
                <Th scope="col">Phone Number</Th>
                <Th scope="col">Role</Th>
                <Th scope="col" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><Td colSpan={6}>Loading...</Td></tr>
              ) : pageItems.length === 0 ? (
                <tr><Td colSpan={6}>No users found.</Td></tr>
              ) : (
                pageItems.map((u: any) => {
                  const letter = (u.first_name || u.last_name || u.email || '?').trim().charAt(0).toUpperCase();
                  return (
                    <tr key={u.id}>
                      <Td>
                        <CellWithAvatar>
                          <Avatar>{letter || '?'}</Avatar>
                          <span>{u.first_name || '—'}</span>
                        </CellWithAvatar>
                      </Td>
                      <Td>{u.last_name || '—'}</Td>
                      <Td>{u.email || '—'}</Td>
                      <Td>{u.phone || '—'}</Td>
                      <Td>{u.role || 'Regular'}</Td>
                      <Td style={{ textAlign: 'right' }}>
                        <IconButton aria-label="More actions" title="More actions">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
                          </svg>
                        </IconButton>
                      </Td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </TableWrap>
        <TableFooter>
          <RowsPerPage>
            <span>Rows per page:</span>
            <Select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}>
              {[5, 10, 15, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </Select>
          </RowsPerPage>
          <PageInfo>{total === 0 ? '0-0 of 0' : `${start + 1}-${end} of ${total}`}</PageInfo>
          <Pager>
            <IconButton onClick={prevPage} aria-label="Previous page" disabled={page === 0}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </IconButton>
            <IconButton onClick={nextPage} aria-label="Next page" disabled={end >= total}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </IconButton>
          </Pager>
        </TableFooter>
      </Card>

      {openModal && (
        <DialogBackdrop role="dialog" aria-modal="true">
          <Dialog>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <IconButton aria-label="Close" onClick={() => setOpenModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </IconButton>
            </DialogHeader>
            <form onSubmit={onAddUser}>
              {error && <ErrorBanner role="alert">{error}</ErrorBanner>}
              <Grid>
                <FormField>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={form.firstName} onChange={set('firstName')} required />
                </FormField>
                <FormField>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={form.lastName} onChange={set('lastName')} required />
                </FormField>
                <FormField $span2>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={set('email')} placeholder="user@company.com" required />
                </FormField>
                <FormField>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+1 555 123 4567" />
                </FormField>
                <FormField>
                  <Label htmlFor="role">Role</Label>
                  <Select id="role" value={form.role} onChange={set('role') as any}>
                    <option value="Admin">Admin</option>
                    <option value="Regular">Regular</option>
                  </Select>
                </FormField>
              </Grid>
              <DialogActions>
                <SecondaryButton type="button" onClick={() => setOpenModal(false)}>Cancel</SecondaryButton>
                <PrimaryButton type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add User'}</PrimaryButton>
              </DialogActions>
            </form>
          </Dialog>
        </DialogBackdrop>
      )}
    </Page>
  );
};

export default ManageUsers;

// styled-components (below component per project rules)
const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  color: #2a2f45;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  border: 1px solid rgba(40,44,69,0.08);
  padding: 0;
`;

const PrimaryButton = styled.button`
  background-color: #0d6efd;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(13,110,253,0.28);
  &:hover { background-color: #0b5ed7; }
  &:active { background-color: #0a58ca; box-shadow: 0 2px 8px rgba(13,110,253,0.35); }
  &:focus-visible { outline: 3px solid rgba(13,110,253,0.35); outline-offset: 2px; }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: #2a2f45;
  border: 1px solid rgba(40,44,69,0.2);
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: rgba(40,44,69,0.06); }
`;

const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  color: #475569;
  font-weight: 700;
  padding: 12px 16px;
  background: #f1f5f9; /* slate-100 */
  border-bottom: 1px solid #e2e8f0; /* slate-200 */
`;

const Td = styled.td<{ colSpan?: number }>`
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #2a2f45;
`;

const CellWithAvatar = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #a63e1f; /* warm reddish like screenshot */
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

const IconButton = styled.button<{ disabled?: boolean }>`
  background: transparent;
  border: none;
  color: #2a2f45;
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  opacity: ${(p) => (p.disabled ? 0.4 : 1)};
  pointer-events: ${(p) => (p.disabled ? 'none' : 'auto')};
  &:hover { background: rgba(40,44,69,0.06); }
`;

const TableFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 10px 12px;
`;

const RowsPerPage = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const PageInfo = styled.div`
  color: #475569;
`;

const Pager = styled.div`
  display: inline-flex;
  gap: 6px;
`;

const Select = styled.select`
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 6px 8px;
  background: #fff;
`;

/* Dialog */
const DialogBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(16, 18, 27, 0.36);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 50;
`;

const Dialog = styled.div`
  width: min(720px, 100%);
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(40,44,69,0.08);
  box-shadow: 0 12px 30px rgba(0,0,0,0.12);
  padding: 12px;
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 6px 6px 12px;
`;

const DialogTitle = styled.h4`
  margin: 0;
  color: #2a2f45;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding: 8px 8px 0 8px;

  @media (min-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FormField = styled.div<{ $span2?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  grid-column: ${(p) => (p.$span2 ? '1 / -1' : 'auto')};
`;

const Label = styled.label`
  font-size: 13px;
  color: #475569;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font: inherit;
  outline: none;
  &:focus { border-color: #282c45; box-shadow: 0 0 0 3px rgba(40,44,69,0.12); }
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 8px 8px 8px;
`;

const ErrorBanner = styled.div`
  background: #ffe3e3;
  color: #b00020;
  border: 1px solid #ffb3b3;
  padding: 10px 12px;
  border-radius: 8px;
  margin: 0 8px 8px;
`;
import React, { useState } from 'react';
import styled from 'styled-components';
import { TRAILER_TYPES, toAllCaps } from '../constants';

const BusinessProfile: React.FC = () => {
  const [form, setForm] = useState({
    legalName: '',
    dba: '',
    dot: '',
    mc: '',
    ein: '',
    phone: '',
    email: '',
    website: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    insuranceProvider: '',
    policyNumber: '',
    policyExpiry: '',
    w9OnFile: false,
    brandColor: '#0d6efd',
    defaultTrailerType: '',
    notes: '',
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.currentTarget.type === 'checkbox'
      ? (e.currentTarget as HTMLInputElement).checked
      : e.currentTarget.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate save with backend; for now, log
    // eslint-disable-next-line no-console
    console.log('BusinessProfile save', form);
  };

  const onCancel = () => {
    // reset to initial (simple cancel)
    setForm({
      legalName: '', dba: '', dot: '', mc: '', ein: '', phone: '', email: '', website: '',
      street: '', city: '', state: '', zip: '', country: 'USA',
      insuranceProvider: '', policyNumber: '', policyExpiry: '', w9OnFile: false,
      brandColor: '#0d6efd', defaultTrailerType: '', notes: '',
    });
  };

  return (
    <Form onSubmit={onSubmit}>
      <Section>
        <SectionTitle>Company</SectionTitle>
        <Grid>
          <Field>
            <Label htmlFor="legalName">Legal Name</Label>
            <Input id="legalName" value={form.legalName} onChange={set('legalName')} required />
          </Field>
          <Field>
            <Label htmlFor="dba">DBA</Label>
            <Input id="dba" value={form.dba} onChange={set('dba')} />
          </Field>
          <Field>
            <Label htmlFor="dot">DOT #</Label>
            <Input id="dot" value={form.dot} onChange={set('dot')} />
          </Field>
          <Field>
            <Label htmlFor="mc">MC #</Label>
            <Input id="mc" value={form.mc} onChange={set('mc')} />
          </Field>
          <Field>
            <Label htmlFor="ein">EIN / Tax ID</Label>
            <Input id="ein" value={form.ein} onChange={set('ein')} />
          </Field>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Contact</SectionTitle>
        <Grid>
          <Field>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={form.phone} onChange={set('phone')} />
          </Field>
          <Field>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={set('email')} />
          </Field>
          <Field $span2>
            <Label htmlFor="website">Website</Label>
            <Input id="website" type="url" placeholder="https://" value={form.website} onChange={set('website')} />
          </Field>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Address</SectionTitle>
        <Grid>
          <Field $span2>
            <Label htmlFor="street">Street</Label>
            <Input id="street" value={form.street} onChange={set('street')} />
          </Field>
          <Field>
            <Label htmlFor="city">City</Label>
            <Input id="city" value={form.city} onChange={set('city')} />
          </Field>
          <Field>
            <Label htmlFor="state">State</Label>
            <Input id="state" value={form.state} onChange={set('state')} />
          </Field>
          <Field>
            <Label htmlFor="zip">Zip</Label>
            <Input id="zip" value={form.zip} onChange={set('zip')} />
          </Field>
          <Field>
            <Label htmlFor="country">Country</Label>
            <Input id="country" value={form.country} onChange={set('country')} />
          </Field>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Compliance & Insurance</SectionTitle>
        <Grid>
          <Field>
            <Label htmlFor="insuranceProvider">Provider</Label>
            <Input id="insuranceProvider" value={form.insuranceProvider} onChange={set('insuranceProvider')} />
          </Field>
          <Field>
            <Label htmlFor="policyNumber">Policy #</Label>
            <Input id="policyNumber" value={form.policyNumber} onChange={set('policyNumber')} />
          </Field>
          <Field>
            <Label htmlFor="policyExpiry">Expiration</Label>
            <Input id="policyExpiry" type="date" value={form.policyExpiry} onChange={set('policyExpiry')} />
          </Field>
          <CheckboxField>
            <input id="w9" type="checkbox" checked={form.w9OnFile} onChange={set('w9OnFile') as any} />
            <span>W-9 on file</span>
          </CheckboxField>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Branding & Preferences</SectionTitle>
        <Grid>
          <Field>
            <Label htmlFor="brandColor">Brand Color</Label>
            <Input id="brandColor" type="color" value={form.brandColor} onChange={set('brandColor')} />
          </Field>
          <Field>
            <Label htmlFor="defaultTrailerType">Default Trailer Type</Label>
            <Input
              id="defaultTrailerType"
              list="trailer-types"
              value={form.defaultTrailerType}
              onChange={(e) => setForm((p) => ({ ...p, defaultTrailerType: toAllCaps(e.target.value) }))}
              placeholder="VAN, REEFER, ..."
            />
            <datalist id="trailer-types">
              {TRAILER_TYPES.map((t) => (
                <option key={t} value={toAllCaps(t)} />
              ))}
            </datalist>
          </Field>
          <Field $span2>
            <Label htmlFor="notes">Notes</Label>
            <TextArea id="notes" rows={4} value={form.notes} onChange={set('notes') as any} />
          </Field>
        </Grid>
      </Section>

      <Actions>
        <Secondary type="button" onClick={onCancel}>Cancel</Secondary>
        <Primary type="submit">Save</Primary>
      </Actions>
    </Form>
  );
};

export default BusinessProfile;

// styled-components below the component (per project rules)
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2.2vw, 24px);
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: #2a2f45;
  font-size: clamp(16px, 2.2vw, 18px);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Field = styled.label<{ $span2?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  grid-column: ${(p) => (p.$span2 ? '1 / -1' : 'auto')};
`;

const Label = styled.span`
  font-size: 13px;
  color: #475569;
`;

const sharedInput = `
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid rgba(40, 44, 69, 0.12);
  border-radius: 10px;
  background: #ffffff;
  color: #2a2f45;
  font: inherit;
  outline: none;
  transition: border-color 160ms ease, box-shadow 160ms ease;

  &:focus-visible {
    border-color: #0d6efd;
    box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.2);
  }
`;

const Input = styled.input`
  ${sharedInput}
`;

const TextArea = styled.textarea`
  ${sharedInput}
  resize: vertical;
`;

const CheckboxField = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const Button = styled.button`
  appearance: none;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
`;

const Primary = styled(Button)`
  background: #0d6efd;
  color: #ffffff;
  box-shadow: 0 6px 18px rgba(13, 110, 253, 0.28);

  &:hover { background: #0b5ed7; }
  &:active { background: #0a58ca; }
  &:focus-visible { outline: 2px solid #0d6efd; outline-offset: 2px; }
`;

const Secondary = styled(Button)`
  background: transparent;
  color: #2a2f45;
  border-color: rgba(42, 47, 69, 0.3);

  &:hover { background: rgba(42, 47, 69, 0.06); }
  &:active { background: rgba(42, 47, 69, 0.12); }
  &:focus-visible { outline: 2px solid #2a2f45; outline-offset: 2px; }
`;
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// Define enum for firm_type
const FirmType = a.enum(['Carrier', 'Shipper', 'Broker', 'Other']);

// Define schema for Firm registration
const schema = a.schema({
  Firm: a
    .model({
      firm_name: a.string(),
      address: a.string(),
      administrator_email: a.string(),
      state: a.string(),
      zip: a.string(),
      firm_type: FirmType,
      load_posts: a.integer(),
      truck_posts: a.integer(),
    })
    .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});

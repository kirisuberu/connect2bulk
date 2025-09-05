import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// Define enum for firm_type
const FirmType = a.enum(['Carrier', 'Shipper', 'Broker', 'Other']);
// Define enum for application user roles
const Role = a.enum(['Admin', 'Regular']);

// Define schema for Firm registration
const schema = a.schema({
  Firm: a
    .model({
      firm_name: a.string(),
      address: a.string(),
      city: a.string(),
      country: a.string(),
      administrator_email: a.string(),
      administrator_first_name: a.string(),
      administrator_last_name: a.string(),
      state: a.string(),
      zip: a.string(),
      firm_type: FirmType,
      // Business details
      dba: a.string(),
      dot: a.string(),
      mc: a.string(),
      ein: a.string(),
      phone: a.string(),
      website: a.string(),
      insurance_provider: a.string(),
      policy_number: a.string(),
      policy_expiry: a.string(),
      w9_on_file: a.boolean(),
      brand_color: a.string(),
      notes: a.string(),
      load_posts: a.integer(),
      truck_posts: a.integer(),
    })
    .authorization((allow) => [allow.guest()]),

  // App user directory for firms (lightweight metadata, separate from Cognito)
  User: a
    .model({
      first_name: a.string(),
      last_name: a.string(),
      email: a.string(),
      phone: a.string(),
      role: Role,
      // Optional associations to Firm could be added later
    })
    .authorization((allow) => [allow.authenticated(), allow.guest()]),

  Load: a
    .model({
      load_number: a.string(),
      pickup_date: a.string(),
      delivery_date: a.string(),
      origin: a.string(),
      destination: a.string(),
      trailer_type: a.string(),
      equipment_requirement: a.string(),
      miles: a.integer(),
      rate: a.float(),
      frequency: a.string(),
      comment: a.string(),
      created_at: a.datetime(),
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


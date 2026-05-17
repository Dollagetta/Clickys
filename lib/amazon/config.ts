export const amazonConfig = {
  credentialId: process.env.AMAZON_CREDENTIAL_ID || '',
  credentialSecret: process.env.AMAZON_CREDENTIAL_SECRET || '',
  credentialVersion: process.env.AMAZON_CREDENTIAL_VERSION || '3.2',
  partnerTag: process.env.AMAZON_PARTNER_TAG || 'dollagetta-21',
  marketplace: process.env.AMAZON_MARKETPLACE || 'www.amazon.in',
  basePath: 'https://creatorsapi.amazon',
};

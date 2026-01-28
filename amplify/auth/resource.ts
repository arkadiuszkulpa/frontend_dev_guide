import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  senders: {
    email: {
      fromEmail: 'verification@arkadiuszkulpa.co.uk',
      fromName: 'Arkadiusz Kulpa - Web Development',
    },
  },
  userAttributes: {
    email: {
      required: true,
      mutable: true,
    },
  },
});

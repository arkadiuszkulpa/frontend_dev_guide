import { defineAuth } from '@aws-amplify/backend';
import { postConfirmation } from './post-confirmation/resource';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ['Admins', 'Users'],
  triggers: {
    postConfirmation,
  },
  access: (allow) => [
    allow.resource(postConfirmation).to(['addUserToGroup']),
  ],
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

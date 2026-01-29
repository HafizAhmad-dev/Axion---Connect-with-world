import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Contact } from '../../Types/Contact.type';

interface ContactsState {
  contacts: Contact[];
}

const initialState: ContactsState = {
  contacts: [],
};

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setContacts: (state, action: PayloadAction<Contact[]>) => {
      state.contacts = action.payload; // overwrite all contacts
    },
    updateContact: (state, action: PayloadAction<Contact>) => {
      const index = state.contacts.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload; // update existing
      } else {
        state.contacts.push(action.payload); // add if not found
      }
    },
    removeContact: (state, action: PayloadAction<string>) => {
      state.contacts = state.contacts.filter(c => c.id !== action.payload);
    },
  },
});

export const { setContacts, updateContact, removeContact } = contactsSlice.actions;

export default contactsSlice.reducer;

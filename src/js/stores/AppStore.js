var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppAPI = require('../utils/appAPI.js');

var CHANGE_EVENT = 'change';

var _contacts = [];
var _contactToEdit = '';

var AppStore = assign({}, EventEmitter.prototype, {

   saveContact: function(contact){
        _contacts.push(contact);
   },

   setContacts: function(contacts){
       _contacts = contacts;
   },
   removeContact: function(contactId){
       var index = _contacts.findIndex(x => x.id === contactId);
       _contacts.splice(index, 1);
   },

   setContactToEdit: function(contact){
       _contactToEdit = contact;
   },

   getContactToEdit: function(){
    return _contactToEdit;
    },

    updateContactToEdit: function(contact){

        for(var i=0; i< _contacts.length; i++){
            if(_contacts[i].id == contact.id){
                _contacts.splice(i, 1);
                _contacts.push(contact);
            }
        }
    },

   getContacts: function() {
       return _contacts;
   },
    emitChange: function() {
        this.emitChange(CHANGE_EVENT);
    },
    addChangeListener: function(callback){
        this.on('change', callback);
    },
    removeChangeListener: function(callback){
        this.removeListener('change', callback);
    }
});

AppDispatcher.register(function(payload){
    var action = payload.action;

    switch(action.actionType){
        case AppConstants.SAVE_CONTACT:
            console.log('saving contact', action);

            //Store save contact
            AppStore.saveContact(action.contact);

            //API Save 
            AppAPI.saveContact(action.contact);
            AppStore.emit(CHANGE_EVENT);
            break;
        case AppConstants.RECEIVE_CONTACTS:
            console.log('receiving contacts');

            //Store save contact
            AppStore.setContacts(action.contacts);

            
            AppStore.emit(CHANGE_EVENT);
            break;
        case AppConstants.REMOVE_CONTACT:
            console.log('REMOVING contact');

            //Store save contact
            AppStore.removeContact(action.contactId);


            AppAPI.removeContact(action.contactId);


            
            AppStore.emit(CHANGE_EVENT);
            break;
        case AppConstants.EDIT_CONTACT:
            console.log('editing contact');

            //Store save contact
            AppStore.setContactToEdit(action.contact);


            AppStore.emit(CHANGE_EVENT);
            break;

        case AppConstants.UPDATE_CONTACT:
            console.log('update contact');

            //Store update contact
            AppStore.updateContactToEdit(action.contact);

            AppAPI.updateContact(action.contact);
            AppStore.emit(CHANGE_EVENT);
            break;

    }
    return true;
});

module.exports = AppStore;
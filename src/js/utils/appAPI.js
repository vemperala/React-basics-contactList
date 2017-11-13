var Firebase = require('firebase');
var AppActions = require('../actions/AppActions');


module.exports = {

    saveContact: function(contact){
        
        this.firebaseRef = new Firebase('https://contactlist-ak.firebaseio.com/contacts');
        console.log('in firebase call');
        this.firebaseRef.push({
            contact: contact
        });
        
    },

    getContacts: function(){
        this.firebaseRef = new Firebase('https://contactlist-ak.firebaseio.com/contacts'); 
        this.firebaseRef.once("value", function(snapshot){
            var contacts = [];
            snapshot.forEach(function(childsnapshot) {
                var contact = {
                    id: childsnapshot.key(),
                    name: childsnapshot.val().contact.name,
                    phone: childsnapshot.val().contact.phone,
                    email: childsnapshot.val().contact.email,
                }
                contacts.push(contact);
                AppActions.receiveContacts(contacts);
            });
        });
    },
    removeContact: function(contactId){
        this.firebaseRef = new Firebase('https://contactlist-ak.firebaseio.com/contacts/'+contactId);
        this.firebaseRef.remove(); 
    },
    updateContact: function(contact){
        var id = contact.id;
        var updatedContact = {
            name: contact.name,
            phone: contact.phone,
            email: contact.email
        }

        this.firebaseRef = new Firebase('https://contactlist-ak.firebaseio.com/contacts/'+contact.id+'/contact');
        this.firebaseRef.update(updatedContact); 
    }
    
}
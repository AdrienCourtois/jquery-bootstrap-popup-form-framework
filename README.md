# jquery-bootstrap-popup-form-framework
Contains a light-weighted framework to easily create forms using jQuery and Bootstrap, that'll display in a popup. Compatible with Ajax.

## Usage
**Beginners**
```JavaScript
var form = FormHandler({
    type: 'create',                         // The type of the form, can be "create" or "edit". Default "create"
    name: 'hello-world',                    // The name used to reference the form, can't be empty
    title: "My first form",                 // The name that'll be displayed in the popup containing the form.
    fields: [                               // The fields in the form
        { title: 'Firstname', name: 'firstname', type: 'text', validator: 'NOTEMPTY' },
        { title: 'Money', name: 'cash', type: 'price', validator: ['NOTEMPTY', 'NUMBER'] }
    ],
    button: 'Send',                         // The content of the button to be pressed.
    processFunction(data){ alert(data); },   // The function called with the data entered by the user when sending the form
    defaultData: { 'cash': 20 }
});

$('button').click(function(){ form.showForm(); });
```

**Advanced**
```Javascript
var editPartyForm = new Form({
    type: 'edit',
    name: 'editParty',
    title: 'Modify a party',
    fields: [
        { title: 'Name', name: 'name', type: 'text', validator: 'NOTEMPTY' },
        { title: 'Description', name: 'description', type: 'textarea-jqte', validator: 'NOTEMPTY' },
        { title: 'Illustration', name: 'img', type: 'upload' },
        { title: 'Date of beginning', name: 'date_start', type: 'text', validator: 'DATE', info: 'Format : dd/mm/yyyy xxhxx' },
        { title: 'Hour of end', name: 'hour_end', type: 'text', validator: 'HOUR', info: 'Format : xxhxx' },
        { title: 'Online price', name: 'price_online', type: 'price', validator: ['NUMBER', 'NOTEMPTY'] },
        { title: 'Maximum amount', name: 'max_tickets', type: 'text', validator: ['NUMBER', 'NOTEMPTY'], info: '-1 if unlimited' }
    ],
    button: 'Modify',
    ajaxUrl: 'ajaxEditParty'
});

$('.editPartyButton').click(function(){
    var self = this;

    editPartyForm.setFillFunction(function(name){
        var elt = $(self).closest('tr').find('td[data-type="' + name + '"]');

        if (elt.find('.d-none').length != 0)
            return elt.find('.d-none').html();
        if (typeof(elt.attr('data-value')) == 'string')
            return elt.attr('data-value');
        else
            return elt.html();
    });

    editPartyForm.addDefaultData({ party_id: $(self).closest('tr').attr('data-party-id') });
    editPartyForm.showForm();
});
```

## Ajax usage
You just have to specify the parameters *ajaxUrl* (and *ajaxMethod* if the method to use is not POST).

If the return of the remote page when called is "success", then the *doneFunction* you specify will be called. The default is the reloading of the page.
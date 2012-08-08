/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.Honorific = XM.Document.extend({
    /** @scope XM.Honorific.prototype */

    recordType: 'XM.Honorific',

    documentKey: 'code',

    enforceUpperKey: false,

  });

  /**
    @class

    @extends XM.Document
  */
  XM.Contact = XM.Document.extend({
    /** @scope XM.Contact.prototype */

    recordType: 'XM.Contact',

    nameAttribute: 'getName',

    numberPolicy: XM.Document.AUTO_NUMBER,

    defaults: {
      owner: XM.currentUser,
      isActive: true
    },

    // ..........................................................
    // METHODS
    //

    // XXX This looks like it works but I'm not sure if it really works.
    save: function (key, value, options) {
      var that = this,
        K = XM.Model,
        address = this.get("address"),
        addressStatus = address.getStatus(),
        addressOptions = {};

      if (addressStatus === K.READY_NEW || addressStatus === K.READY_DIRTY) {
        // The address has changed. Save the address first, then the contact
        addressOptions.success = function (resp) {
          XM.Document.prototype.save.call(that, key, value, options);
        };
        addressOptions.error = Backbone.wrapError(null, that, options);
        address.save(null, addressOptions);

      } else {
        XM.Document.prototype.save.call(that, key, value, options);
      }
    },

    /**
    Full contact name.

    @returns String
    */
    getName: function () {
      var name = [],
        first = this.get('firstName'),
        middle = this.get('middleName'),
        last = this.get('lastName'),
        suffix = this.get('suffix');
      if (first) { name.push(first); }
      if (middle) { name.push(middle); }
      if (last) { name.push(last); }
      if (suffix) { name.push(suffix); }
      return name.join(' ');
    },

    validateSave: function (attributes, options) {
      if (!attributes.firstName && !attributes.lastName) {
        return XT.Error.clone('xt2004');
      }
    }

  });

  // Add mixin
  XM.Contact = XM.Contact.extend(XM.ContactMixin);

  /**
    @class

    @extends XM.Model
  */
  XM.ContactEmail = XM.Model.extend({
    /** @scope XM.ContactEmail.prototype */

    recordType: 'XM.ContactEmail',

    requiredAttributes: [
      "email"
    ]

  });

  /**
    @class

    @extends XM.Comment
  */
  XM.ContactComment = XM.Comment.extend({
    /** @scope XM.ContactComment.prototype */

    recordType: 'XM.ContactComment'

  });

  /**
    @class

    @extends XM.Characteristic
  */
  XM.ContactCharacteristic = XM.Characteristic.extend({
    /** @scope XM.ContactCharacteristic.prototype */

    recordType: 'XM.ContactCharacteristic'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ContactAccount = XM.Model.extend({
    /** @scope XM.ContactAccount.prototype */

    recordType: 'XM.ContactAccount',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ContactContact = XM.Model.extend({
    /** @scope XM.ContactContact.prototype */

    recordType: 'XM.ContactContact',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ContactItem = XM.Model.extend({
    /** @scope XM.ContactItem.prototype */

    recordType: 'XM.ContactItem',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ContactFile = XM.Model.extend({
    /** @scope XM.ContactFile.prototype */

    recordType: 'XM.ContactFile',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ContactImage = XM.Model.extend({
    /** @scope XM.ContactImage.prototype */

    recordType: 'XM.ContactImage',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ContactUrl = XM.Model.extend({
    /** @scope XM.ContactUrl.prototype */

    recordType: 'XM.ContactUrl',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ContactInfo = XM.Model.extend({
    /** @scope XM.ContactInfo.prototype */

    recordType: 'XM.ContactInfo',

    readOnly: true

  });

  // ..........................................................
  // METHODS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.HonorificCollection = XM.Collection.extend({
    /** @scope XM.HonorificCollection.prototype */

    model: XM.Honorific

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ContactInfoCollection = XM.Collection.extend({
    /** @scope XM.ContactInfoCollection.prototype */

    model: XM.ContactInfo

  });

}());

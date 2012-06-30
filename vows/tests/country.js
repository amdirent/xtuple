// Contributions of status related functionality borrowed from SproutCore:
// https://github.com/sproutcore/sproutcore

/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
/*global XVOWS:true, XT:true, XM:true, setTimeout:true, clearTimeout:true, vows:true, assert:true, console:true */

(function () {
  "use strict";
  
  var createHash = {
    name: 'Elbonia',
    abbreviation: 'EL',
    currencyAbbreviation: 'PIC',
    currencyName: 'Pico',
    currencySymbol: '!'
  };
  
  var updateHash = {
    abbreviation: 'EB'
  };
  
  vows.describe('XM.Country CRUD test').addBatch({
    'CREATE': {
      topic: function () {
        var that = this,
          timeoutId,
          model = new XM.Country(),
          callback = function (model, value) {
            clearTimeout(timeoutId);
            model.off('change:guid', callback);
            that.callback(null, model);
          };
        model.on('change:guid', callback);
        model.initialize(null, {isNew: true});

        // If we don't hear back, keep going
        timeoutId = setTimeout(function () {
          that.callback(null, model);
        }, 5000); // five seconds
      },
      'Status is READY_NEW': function (model) {
        assert.equal(model.getStatusString(), 'READY_NEW');
      },
      'id is valid': function (model) {
        assert.isNumber(model.id);
      },
      '-> Set values': {
        topic: function (model) {
          model.set(createHash);
          return model;
        },
        'Last Error is null': function (model) {
          assert.isNull(model.lastError);
        },
        '-> Save and READ': {
          topic: function (model) {
            var that = this,
              timeoutId,
              callback = function (model) {
                var status = model.getStatus(),
                  K = XT.Model;
                if (status === K.READY_CLEAN) {
                  clearTimeout(timeoutId);
                  model.off('statusChange', callback);
                  return that.callback(null, model);
                }
              };
            model.on('statusChange', callback);
            model.save();
            
            // If we don't hear back, keep going
            timeoutId = setTimeout(function () {
              that.callback(null, model);
            }, 5000); // five seconds
          },
          'Status is READY_CLEAN': function (model) {
            assert.equal(model.getStatusString(), 'READY_CLEAN');
          },
          'Name is `Elbonia`': function (model) {
            assert.equal(model.get('name'), 'Elbonia');
          },
          'Abbreviation is `EL`': function (model) {
            assert.equal(model.get('abbreviation'), 'EL');
          },
          'Currency Name is `Pico`': function (model) {
            assert.equal(model.get('currencyName'), 'Pico');
          },
          'Currency Abbreviation is `PIC`': function (model) {
            assert.equal(model.get('currencyAbbreviation'), 'PIC');
          },
          '-> UPDATE': {
            topic: function (model) {
              model.set(updateHash);
              return model;
            },
            'Last Error is null': function (model) {
              assert.isNull(model.lastError);
            },
            'Abbreviation is EB': function (model) {
              assert.equal(model.get('abbreviation'), 'EB');
            },
            'Status is READY_DIRTY': function (model) {
              assert.equal(model.getStatusString(), 'READY_DIRTY');
            },
            '-> Commit': {
              topic: function (model) {
                var that = this,
                  timeoutId,
                  callback = function (model) {
                    var status = model.getStatus(),
                      K = XT.Model;
                    if (status === K.READY_CLEAN) {
                      clearTimeout(timeoutId);
                      model.off('statusChange', callback);
                      return that.callback(null, model);
                    }
                  };
                model.on('statusChange', callback);
                model.save();

                // If we don't hear back, keep going
                timeoutId = setTimeout(function () {
                  that.callback(null, model);
                }, 5000); // five seconds
              },
              'Abbreviation is EB': function (model) {
                assert.equal(model.get('abbreviation'), 'EB');
              },
              'Status is READY_CLEAN': function (model) {
                assert.equal(model.getStatusString(), 'READY_CLEAN');
              },
              '-> DESTROY': {
                topic: function (model) {
                  var that = this,
                    timeoutId,
                    callback = function (model) {
                      var status = model.getStatus(),
                        K = XT.Model;
                      if (status === K.DESTROYED_CLEAN) {
                        clearTimeout(timeoutId);
                        model.off('statusChange', callback);
                        return that.callback(null, model);
                      }
                    };
                  model.on('statusChange', callback);
                  model.destroy();

                  // If we don't hear back, keep going
                  timeoutId = setTimeout(function () {
                    that.callback(null, model);
                  }, 5000); // five seconds
                },
                'Status is DESTORYED_CLEAN': function (model) {
                  assert.equal(model.getStatusString(), 'DESTROYED_CLEAN');
                },
                'FINISH XM.Country': function () {
                  XVOWS.next();
                }
              }
            }
          }
        }
      }
    }
  }).run();
}());
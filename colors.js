Color = new Meteor.Collection('colors');

if (Meteor.is_client) {
  Template.colors_list.colors = function () {
    return Color.find({}, {sort: {points: -1, name: 1}});
  };

  Template.color.events = {
    'click .color-item': function (e) {
      Session.set('selected', this._id);
    },

    'click .remove-color': function (e) {
      Session.set('selected', null);
      Color.remove(this._id);
    },

    'keypress .color-name': function (e) {
      if (e.keyCode === 13) {
        var input = $('.selected .color-name');
        var value = input[0].value;
        console.log(value);
        Color.update({_id: this._id}, {$set: {name: value}});
      }
    }
  };

  Template.color.selected = function () {
    var cond = Session.equals('selected', this._id);
    return cond ? 'selected' : '';
  };

  Template.judger.events = {
    'click #judge-em': function (e) {
      var id = Session.get('selected');
      if (id) {
        var color = Color.findOne({_id: id});
        // Collection.update(selector, modifier [,options [, callback]])
        Color.update({_id: id}, {$inc: {points: 1}});
      }
    }
  };

  Template.colors_add.events = {
    'keypress #add-color': function (e) {
      if (e.keyCode === 13) {
        var input = document.getElementById('add-color');
        var value = input.value;
        Color.insert({name: value, points: 1});
        input.value = '';
      }
    }
  };
}

if (Meteor.is_server) {
  Meteor.startup(function () {

    if (Color.find().count() === 0) {
      var colors = [
        {name: 'Red',   points: 1},
        {name: 'Green', points: 2},
        {name: 'Blue',  points: 3}
      ];

      for (var i in colors) {
        Color.insert(colors[i]);
        console.log('Color ' + colors[i].name + ' added.');
      }
    }

    Session.set('selected', null);

  });
}
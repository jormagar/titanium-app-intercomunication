/**
 * ActionManager
 * @author Jorge Macías <jormagar@gmail.com>
 * @type {Object}
 */
module.exports = {
  actions: {},
  dep: {},
  /**
   * Add dependency library
   * @method addDependency
   * @param  {string} name Dependency name
   * @param  {object} dependency Dependency library
   */
  addDependency: function (name, dependency) {
    if (name in this.dep) {
      this.removeDependency(name);
    }
    this.actions[name] = {};
    this.dep[name] = dependency;
  },
  /**
   * Remove dependency library.
   * Before remove all it's actions will be removed
   * @method removeDependency
   * @param  {string} name Dependency name
   */
  removeDependency: function (dependency) {
    if (dependency in this.dep) {
      Object(this.actions[dependency]).forEach(function (action) {
        this.actions[dependency][action] = null;
        delete this.actions[dependency][action];
      });

      this.actions[dependency] = null;
      delete this.actions[dependency];
    }
  },
  /**
   * Add a dependency action
   * @method addAction
   * @param  {string}   action Action name
   * @param  {string}   dependency Dependency name
   * @param  {string}   fnc Function name to be executed as action
   */
  addAction: function (action, dependency, fnc) {
    Ti.API.info('action: ' + action);
    if (!dependency in this.dep) {
      throw new Error('ActionManager.addAction: Dependency you provided doesn\'t exists');
    }

    if (!fnc) {
      throw new Error('ActionManager.addAction: Provide a function name is required');
    }

    this.actions[action] = this.dep[dependency][fnc];
  },
  /**
   * Remove a dependency action
   * @method removeAction
   * @param  {string} action
   * @param  {[type]} dependency
   */
  removeAction: function (action, dependency) {
    if (dependency in this.dep && action in this.actions) {
      this.actions[dependency][action] = null;
      delete this.actions[dependency][action];
    }
  },
  /**
   * Executes provided action
   * @method execute
   * @param  {string} action
   */
  execute: function (action) {
    //If arguments are provided in array format
    if (Array.isArray(arguments[1])) {
      return this.actions[action] && this.actions[action].apply(this, [].slice.call(arguments[1]));
    } else {
      //Serialized arguments
      return this.actions[action] && this.actions[action].apply(this, [].slice.call(arguments, 1));
    }
  }
};

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
    if (this.dep.hasOwnProperty(name)) {
      throw new Error('ActionManager.addDependency: Already exists a dependency with your provided name');
    }

    this.dep[name] = dependency;
  },
  /**
   * Remove dependency library.
   * Before remove all it's actions will be removed
   * @method removeDependency
   * @param  {string} name Dependency name
   */
  removeDependency: function (dependency) {
    if (this.dep.hasOwnProperty(dependency)) {
      delete this.dep[dependency];

      Object.keys(this.actions).forEach(function(action) {
        if (action.dependency === dependency) {
          delete this.actions[action];
        }
      });
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
    if (!this.dep.hasOwnProperty(dependency)) {
      throw new Error('ActionManager.addAction: Dependency you provided doesn\'t exists');
    }

    if (!action) {
      throw new Error('ActionManager.addAction: Provide a action is required');
    }

    if (!fnc) {
      throw new Error('ActionManager.addAction: Provide a function name is required');
    }

    this.actions[action] = {
      self: this.dep[dependency],
      dependency: dependency,
      fnc: this.dep[dependency][fnc]
    };
  },
  /**
   * Remove a dependency action
   * @method removeAction
   * @param  {string} action
   * @param  {[type]} dependency
   */
  removeAction: function (action, dependency) {
    if (this.dep.hasOwnProperty(dependency) && this.actions.hasOwnProperty(action)) {
      delete this.actions[action];
    }
  },
  /**
   * Executes provided action
   * @method execute
   * @param  {string} action
   */
  execute: function (action) {
    if (this.actions.hasOwnProperty(action)){
      //If arguments are provided in array format
      let params = Array.isArray(arguments[1]) ? [].slice.call(arguments[1]) : [].slice.call(arguments, 1);

      this.actions[action].fnc.apply(this.actions[action].self, params);
    }
  }
};

class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        /****************Check the structure of the input data*****************/
        if (config === undefined || config === null) {
            throw (new Error("Object constructor parameter can not be undefined!"));
        }
        if (!config.hasOwnProperty("initial") || !config.hasOwnProperty("states")) {
            throw (new Error("Incorrect structure of the input data!"));
        }

        for (var key in config.states) {
            if (!config.states[key].hasOwnProperty("transitions")) {
                throw (new Error("Incorrect structure of the input data!"));
            }
        }
        ////////////////////////////////////////////////////////////////////////

        this.initial = config.initial;      //initial state (string)
        this._state = config.initial;       //current state (string)

        this.states = config.states;        //object "states"

        this._prevState = undefined;        //previous state
        this._prevEvent = undefined;        //previous event
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this._state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.states.hasOwnProperty(state)) {
            this._prevState = this._state;
            this._state = state;
        } else {
            throw (new Error("The object does not have such state!"));
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (this.states[this._state].transitions.hasOwnProperty(event)) {
            this._prevState = this._state;
            this._state = this.states[this._state].transitions[event];
            this._prevEvent = event;
        } else {
            throw (new Error("The object does not have such event!"));
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this._state = this.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var array = [];

        if (event === undefined) {
            for (var key in this.states) {
                array.push(key);
            }
            return array;
        }

        for (var key in this.states) {
            if (this.states[key].transitions.hasOwnProperty(event)) {
                array.push(key);
            }
        }
        return array;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this._prevState !== undefined) {
            this._state = this._prevState;
            this._prevState = undefined;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.states[this._state].transitions.hasOwnProperty(this._prevEvent)) {
            this._prevState = this._state;
            this._state = this.states[this._state].transitions[this._prevEvent];
            return true;
        } else {
            return false;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._prevState = undefined;
        this._prevEvent = undefined;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/

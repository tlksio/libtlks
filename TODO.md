# tlks.io : libtlks

This is an unordered & random future ideas to discuss. Once an idea is
discussed it should be moved as a task/issue to the backlog.

Current ideas:

##### Support for Promises

*libtlks* is an asynchronous library, it means that all calls to its methods
do not return the final result.

Currently we are using callbacks to handle the results and all code is
refactored from time to time to avoid *callbackhell*. Do we need to support
Promises to avoid this?

Right now I won't do that considering that Promises is not yet released with
ES6 and it breaks one our fist laws that is to not use bloated non-stardard
libraries and keep it as much standard as posible.

##### API Documentation

Should we generate API documentation for the library? With which tool?

Evaluate:
    * Docco
    * JSDoc
    * Others?


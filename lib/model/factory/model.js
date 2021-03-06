(function () {

  var factory = hd.__private.factory;

  /***************************************************************/
  /* Final processing. */

  var submit = function submit() {
    /* In here, we can pretend that we are a client with access to hd. */
    var data = {};
    Object.keys(this).forEach(function (v) {
      var value = this[v];
      if (hd.isVariable(value)) value = value();
      /* Reject any constants or variables that are functions. */
      if (typeof value !== "function") data[v] = value;
    }, this);
    var url = location.protocol + location.hostname + location.pathname;
    return hd.fn(submitForm)(url, data);
  };

  var sink = function sink() {
    Object.keys(this).forEach(function (v) {
      if (hd.isVariable(this[v])) this[v]();
    }, this);
  };

  var maybeAddCommand = function maybeAddCommand(model) {

    /* We will add a default command if the user did not. */
    var hasCommand = false;

    /* Now we can assign the name the user wanted. */
    Object.keys(model).forEach(function (v) {
      var value = model[v];

      if (hd.isProxy(value)) {
        var vv = value.unwrap();

        if (vv.cellType === "output") {
          hasCommand = true;
        }

        vv.id = v;
        if (vv.inner) {
          var ccStay = vv.inner.stayConstraint.outer;
          ccStay.id = vv.id + "_stay";
          var mmStay = ccStay.methods[0];
          mmStay.id = vv.id + "_const";
        }
      }
    });

    /* The default output variable will access every variable so that they are
     * all relevant. It will not be visible to users. */
    if (!hasCommand) {
      hd.command(sink);
    }

  };

  factory.model = function model(Ctor) {

    /* The general case for a Model is a constructor. We support plain
     * objects as a convenience. */

    if (typeof Ctor === "function") {
      return function CtorWrapped(/*...*/) {
        var model = Object.create(Ctor.prototype);

        factory.contexts.unshift(model);
        Ctor.apply(model, arguments);
        maybeAddCommand(model);
        factory.contexts.shift();

        hd.update();
        return model;
      };

    } else {
      ASSERT(typeof Ctor === "object",
        "expected object or constructor for model");
      var model = Ctor;
      maybeAddCommand(model);
      hd.update();
      return model;
    }

  };

  hd.model = factory.model;

}());


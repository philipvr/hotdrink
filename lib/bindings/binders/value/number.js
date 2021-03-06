(function () {

  var common = hd.__private.bindings;

  var onChange = function onChangeNumber(view, listener) {
    ASSERT(view instanceof jQuery, "expected jQuery object");
    /* keyup instead of keypress, otherwise we'll read the
     * value before the user's edit. */
    view.bind("keyup", listener);
  };

  var convertNumber = function convertNumber(vv) {
    var mv = (typeof vv === "string") ? parseFloat(vv) : vv;
    return (typeof mv !== "number" || isNaN(mv))
      ? { error : "could not convert to number: " + JSON.stringify(vv) }
      : { value : mv };
  };

  var read = function readNumber(view) {
    ASSERT(view instanceof jQuery, "expected jQuery object");
    return convertNumber(view.val());
  };

  hd.binders["number"] = common.binder({ onChange: onChange, read: read });

}());


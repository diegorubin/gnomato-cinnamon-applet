const Lang = imports.lang;
const Applet = imports.ui.applet;
const GLib = imports.gi.GLib;
const Mainloop = imports.mainloop;
const Gettext = imports.gettext.domain('cinnamon-applets');
const _ = Gettext.gettext;
 
function GnomatoApplet(orientation) {
    this._init(orientation);
}
 
GnomatoApplet.prototype = {
    __proto__: Applet.TextApplet.prototype,

    _init: function(orientation) {
        Applet.TextApplet.prototype._init.call(this, orientation);
        this.value = 0;
 
        try {
            this.set_applet_label("gnomato");
            this.set_applet_tooltip(_("Gnomato Status"));

            Mainloop.timeout_add(1000, Lang.bind(this, this._timeout));
        }
        catch (e) {
            global.logError(e);
        }
     },
 
    _timeout: function(event) {
      try {
          let output = {};
          let remainer = GLib.spawn_sync(null, ["gnomato","GetRemainer"], null, GLib.SpawnFlags.SEARCH_PATH,null,null,output);
          let task = GLib.spawn_sync(null, ["gnomato","GetCurrentTask"], null, GLib.SpawnFlags.SEARCH_PATH,null,null,output);
          remainer = "" + remainer[1];
          task = "" + task[1];
          this.set_applet_label(remainer.substring(0, remainer.length - 1) + " - " + task.substring(0, task.length - 1));
          Mainloop.timeout_add(1000, Lang.bind(this, this._timeout));
      }
      catch (e) {
          global.logError(e);
      }

    }
};
 
function main(metadata, orientation) {
    let gnomato = new GnomatoApplet(orientation);
    return gnomato;
}


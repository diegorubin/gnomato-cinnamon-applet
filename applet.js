const Lang = imports.lang;
const Applet = imports.ui.applet;
const GLib = imports.gi.GLib;
const Mainloop = imports.mainloop;
const Gettext = imports.gettext.domain('cinnamon-applets');
const Gio = imports.gi.Gio;
const _ = Gettext.gettext;

const gnomato_interface = '<node> \
    <interface name="com.diegorubin.Gnomato"> \
      <method name="GetRemainer"> \
        <arg type="s" name="iso8601" direction="out"/> \
      </method> \
      <method name="GetCurrentTask"> \
        <arg type="s" name="iso8601" direction="out"/> \
      </method> \
      <method name="GetCycle"> \
        <arg type="s" name="iso8601" direction="out"/> \
      </method> \
    </interface> \
  </node> ';

const GnomatoProxy = Gio.DBusProxy.makeProxyWrapper(gnomato_interface); 

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
          let gnomato = new GnomatoProxy(Gio.DBus.session, "com.diegorubin.Gnomato", "/com/diegorubin/Gnomato");
          let remainer = gnomato.GetRemainerSync();
          let task = gnomato.GetCurrentTaskSync();
          this.set_applet_label('' + remainer + ' ' + task);
      }
      catch (e) {
      }
      Mainloop.timeout_add(1000, Lang.bind(this, this._timeout));

    }
};
 
function main(metadata, orientation) {
    let gnomato = new GnomatoApplet(orientation);
    return gnomato;
}


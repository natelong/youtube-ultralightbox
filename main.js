/*global document, YUI */
YUI.add("yulb", function(Y) {
    "use strict";

    var launchers     = Y.all(".yulb-launcher"),
        overlayTmpl   = "<div class=\"yulb-overlay\" style=\"width:{width}px; height: {height}px;\"></div>",
        containerTmpl = "<div class=\"yulb-container\" style=\"width:{width}px; height:{height}px;\"></div>",
        iframeTmpl    = "<iframe type=\"text/html\" width=\"{width}\" height=\"{height}\" src=\"http://www.youtube.com/embed/{vidid}?{params}\" frameborder=\"0\" />",
        defaults      = {
            width  : 800,
            height : 600,
            params : {
                autoplay       : 1,
                modestbranding : 1,
                showinfo       : 0,
                rel            : 0,
                autohide       : 1
            }
        };

    Y.yulb = {
        defaults  : defaults,
        launchers : launchers
    };

    if(launchers.isEmpty()) {
        return;
    }

    launchers.each(function(launcher) {
        launcher.on("click", function(e) {
            e.preventDefault();

            var popupData = {
                    vidid  : launcher.getData("vidid"),
                    width  : +launcher.getData("vidwidth") || defaults.width,
                    height : +launcher.getData("vidheight") || defaults.height,
                    params : Y.Object.keys(defaults.params).map(function(key) {
                                return key + "=" + defaults.params[key];
                             }).join("&")
                },
                overlayData = {
                    width  : Y.DOM.winWidth(),
                    height : Y.DOM.winHeight()
                },
                containerData = {
                    width  : popupData.width,
                    height : popupData.height
                },
                eventData = {
                    launcher : launcher,
                    vidid    : popupData.vidid
                },
                overlay   = Y.Node.create(Y.Lang.sub(overlayTmpl, overlayData)),
                container = Y.Node.create(Y.Lang.sub(containerTmpl, containerData)).appendTo(overlay);
            
            Y.Node.create(Y.Lang.sub(iframeTmpl, popupData)).appendTo(container);
            overlay.appendTo(document.body);

            Y.fire("yulb:open", eventData);

            overlay.on("click", function() {
                Y.fire("yulb:close", eventData);
                overlay.remove(true);
            });

            Y.on("windowresize", function() {
                overlay.setStyles({
                    "width"  : Y.DOM.winWidth(),
                    "height" : Y.DOM.winHeight()
                });
            });
        });
    });

}, "1.0.0", { requires: [ "node", "event" ] });

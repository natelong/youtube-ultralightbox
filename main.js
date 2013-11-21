/*jshint browser:true */
/*global document, YUI, YT */
YUI.add("yulb", function(Y) {
    "use strict";

    var launchers  = Y.all(".yulb-launcher"),
        embeds     = Y.all(".yulb-embed"),
        apiUrl     = "https://www.youtube.com/iframe_api",
        tmpl       = {
            overlay   : "<div class=\"yulb-overlay\" style=\"width:{width}px; height: {height}px;\"></div>",
            container : "<div class=\"yulb-container\" style=\"width:{width}px; height:{height}px;\"></div>",
            closeBtn  : "<div class=\"yulb-close\">close</div>",
            iframe    : "<iframe type=\"text/html\" id=\"{id}\" width=\"{width}\" height=\"{height}\" src=\"//www.youtube.com/embed/{vidid}?{params}\" frameborder=\"0\" />"
        },
        defaults   = {
            width  : 800,
            height : 600,
            volumeRampTime : 1000,
            params : {
                autoplay       : 0,
                modestbranding : 1,
                showinfo       : 0,
                rel            : 0,
                autohide       : 1,
                version        : 3,
                enablejsapi    : 1
            }
        };

    if(!launchers.isEmpty() || !embeds.isEmpty()) {
        Y.Get.js(apiUrl, function(err) {
            if(err) {
                Y.log("Youtube API couldn't load", "error");
            }
        });
    }

    function addApiControls(player, controller) {
        var id   = player.get("id"),
            mute = controller.getData("mute") === "true",
            startVolume,
            volumeInterval;

        function initialize(e) {
            function volumeStep() {
                var currentVolume = e.target.getVolume();

                if(currentVolume < startVolume) {
                    e.target.setVolume(currentVolume + 1);
                } else {
                    clearInterval(volumeInterval);
                }
            }

            if(mute) {
                startVolume = e.target.getVolume();
                e.target.setVolume(0);

                player.on("mouseenter", function() {
                    volumeInterval = setInterval(volumeStep, defaults.volumeRampTime / startVolume);
                });
            }
        }

        new YT.Player(id, {
            events: {
                "onReady": initialize
            }
        });
    }

    function setupLaunchers() {
        if(launchers.isEmpty()) {
            return;
        }

        launchers.each(function(launcher) {
            launcher.on("click", function(e) {
                e.preventDefault();

                var playerParams = Y.merge(defaults.params, {
                        autoplay : (launcher.getData("autoplay") === "true" ? 1 : 0)
                    }),
                    popupData = {
                        id     : Y.guid(),
                        vidid  : launcher.getData("vidid"),
                        width  : +launcher.getData("vidwidth") || defaults.width,
                        height : +launcher.getData("vidheight") || defaults.height,
                        params : Y.Array.map(Y.Object.keys(playerParams), function(key) {
                                    return key + "=" + playerParams[key];
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
                    overlay   = Y.Node.create(Y.Lang.sub(tmpl.overlay, overlayData)),
                    container = Y.Node.create(Y.Lang.sub(tmpl.container, containerData)).appendTo(overlay),
                    player    = Y.Node.create(Y.Lang.sub(tmpl.iframe, popupData)).appendTo(container);

                Y.Node.create(tmpl.closeBtn).appendTo(container);
                overlay.appendTo(document.body);
                addApiControls(player, launcher);

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
    }

    function setupEmbeds() {
        if(embeds.isEmpty()) {
            return;
        }

        embeds.each(function(embed) {
            var embedParams = Y.merge(defaults.params, {
                    autoplay : (embed.getData("autoplay") === "true" ? 1 : 0)
                }),
                embedData = {
                    id     : Y.guid(),
                    vidid  : embed.getData("vidid"),
                    width  : +embed.getData("vidwidth") || defaults.width,
                    height : +embed.getData("vidheight") || defaults.height,
                    params : Y.Object.keys(embedParams).map(function(key) {
                                return key + "=" + embedParams[key];
                             }).join("&")
                },
                player = Y.Node.create(Y.Lang.sub(tmpl.iframe, embedData)).appendTo(embed);

            addApiControls(player, embed);
        });
    }

    window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
        setupLaunchers();
        setupEmbeds();
    };

}, "1.0.0", {
    requires: [
        "node",
        "event",
        "array-extras"
    ]
});
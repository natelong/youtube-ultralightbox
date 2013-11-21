# YouTube Ultralightbox #
A simple, drop-in lightbox YouTube video player for YUI.

## Usage ##
You can add a video link to your page really simply:
```javascript
<a class="yulb-launcher" data-vidid="Sin5E5vGr78" href="http://www.youtube.com/watch?v=Sin5E5vGr78">Launch video</a>
```
- The `yulb-launcher` class signifies that this link should launch a video lightbox.
- The `data-vidid` attribute contains the YouTube ID of the video

You can also embed a video easily (instead of making it a lightbox):
```javascript
<div class="yulb-embed" data-vidid="Sin5E5vGr78">Video goes here</div>
```
- The `yulb-embed` class signifies that this video should be embedded instead of popped up

## Options ##
All options are just data attributes on the target element.

### vidid (data-vidid) - Required###
Tells YULB what video you'd like to load
```javascript
<div class="yulb-embed" data-vidid="Sin5E5vGr78">Video goes here</div>
```

### vidwidth (data-vidwidth) - Optional###
Tells YULB how wide the resulting video should be
```javascript
<div class="yulb-embed" data-vidwidth="800" data-vidid="Sin5E5vGr78">Video goes here</div>
```

### vidheight (data-vidheight) - Optional###
Tells YULB how tall the resulting video should be
```javascript
<div class="yulb-embed" data-vidheight="600" data-vidid="Sin5E5vGr78">Video goes here</div>
```

### autoplay (data-autoplay) - Optional###
Either of `true` or `false` to tell YULB whether to autoplay the video 
```javascript
<div class="yulb-embed" data-autoplay="true" data-vidid="Sin5E5vGr78">Video goes here</div>
```

### mute (data-mute) - Optional###
Either of `true` or `false` to tell YULB whether the video will start muted and will unmute when the user mouses over it. When the video unmutes, YULB will fade the audio up to the original volume (YouTube persists this value across sessions) over 1 second to keep from surprising the user.
```javascript
<div class="yulb-embed" data-mute="true" data-vidid="Sin5E5vGr78">Video goes here</div>
```
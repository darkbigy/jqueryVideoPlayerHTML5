jqueryhtml5
===========

Player HTML5 using jquery


License 
---
GNU GPL

Compatibility 
---
All major browsers compatible HMTL 5
Optimal on Firefox and Chrome

Dependency 
---
JQuery HTML5 required [JQuery library](http://jquery.com/ "JQuery") implemented before this plugin

Description 
---
JQuery Video Player HTML 5 is a project based on [Playr plugin](https://github.com/delphiki/Playr "Playr")
<br/>It fully uses JQuery implementation, improves performances and add new features
<br/>The main purpose is to easily integrate a HTML5 video player in a web site


Features 
---
* Easy integration
* Subtitles (.net) tracks support
* Customizable controller bar
* Multi version (HD, SD, 16:9, 4:3, ...) of a same video
* True fullscreen (Mozilla & WebKit)

Usage 
---

Implementation script

    <script type="text/javascript" src="http://code.jquery.com/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="./player-html5.jQuery.min.lib.js"></script>
    <script type="text/javascript">
      $(document).ready(function() { 
        $(".my_class_selector").jQueryVideoHTML5([options]);
      });
    </script>

Implementation HTML elements

    <video controls class="my_class_selector">
      <source src="http://mywebsite/myvideo/webmVerisonSD.webm" type='video/webm'/ data-version='SD'>
      <source src="http://mywebsite/myvideo/webmVerisonSD.ogv" type='video/ogg'/ data-version='SD'>
      <source src="http://mywebsite/myvideo/webmVerisonSD.mp4" type='video/mp4'/ data-version='SD'>
      <source src="http://mywebsite/myvideo/webmVerisonHD.ogv" type='video/ogg'/ data-version='HD'>
      <source src="http://mywebsite/myvideo/webmVerisonSD.webm" type='video/webm'/ data-version='HD'>
      <source src="http://mywebsite/myvideo/webmVerisonHD.mp4" type='video/mp4'/ data-version='HD'>
      <track kind="subtitles" label="English" srclang="en" src="sub.srt" />
      <track kind="subtitles" label="Francais" srclang="fr" src="sub.srt" />
    </video>

The video class name can be named as you're up to. Here we called it "my_class_selector"
<br/>
###### Source
`<source>` elements store versions of yout video. For more compatibility, please use at least two types of video.<br/>
For more information about compatibilies [click here](http://en.wikipedia.org/wiki/HTML5_video "HTMLVideo").<br/>
`Data-version` attribut is not defined, you can type what ever you want. You just need to respect the same `Data-version` for each type of each version.<br/>
The value of `Data-version` attribut is display in the controller bar.<br/>
If only one version is available or no `Data-version` attribut provided, nothing is display in version list.  

###### Tracks


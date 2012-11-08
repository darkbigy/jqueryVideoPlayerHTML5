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

Implementation script <br/>

    <script type="text/javascript" src="http://code.jquery.com/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="./player-html5.jQuery.min.lib.js"></script>
    <script type="text/javascript">
      $(document).ready(function() { 
        $("my_class_selector").jQueryVideoHTML5();
      });
    </script>
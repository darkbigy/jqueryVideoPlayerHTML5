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

`[options]` available are :

| Option Label         | Default value        | Description                                                          |
-----------------------|----------------------|----------------------------------------------------------------------|
| version              | 'SD'                 | Forced version                                                       |
| theme                | 'default-theme.html' | Name of the default theme (must be HTML file)                        |
| themePath            | './themes-player-jQ/'| Path where the theme is stored                                       |
| defaultVolume        | 0.5                  | Default volume when the player is load                               |
| fontSize             | '12pt'               | Default size of str or captions                                      |
| displayEmptyStrMenu  | false                | Do you want display the str/cc button if no tracks are found         |
| displayEmptyQualMenu | false                | Do you want display the str/cc button if no multi versions are found |

`[options]` using is :
`$(".my_class_selector").jQueryVideoHTML5({'theme' : 'my-custom-theme.html', 'displayEmptyStrMenu' : true});`

Here the plugin will be on every video elements with the class `my_class_selector`.<br/>

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
`<source>` elements store versions of your video. For more compatibilities, please use at least two types of video.<br/>
For more information about compatibilies [click here](http://en.wikipedia.org/wiki/HTML5_video "HTMLVideo").<br/>
`Data-version` attribut is not defined, you can type what ever you want. You just need to respect the same `Data-version` for each type of each version.<br/>
The value of `Data-version` attribut is display in the controller bar.<br/>
If only one version is available or no `Data-version` attribut provided, nothing is display in version list.  

###### Tracks
`<track>` elements store texts(subtitles/close captions) you want display on your video.<br/>
`<kind>` availables are :
* subtitles
* captions
* descriptions
If no track are provided, track list is not displayed.


Customize theme
---
The controller bar can be customized but it has to respect some rules.<br/>
First of all this code has to be at the begining of your theme :

    <div class="jqVideo5_captions_wrapper">
       <div class="jqVideo5_video_container"></div>
       <div class="jqVideo5_captions" ></div>
    </div>
     
Then you can move, add or delete some part based on default-theme.html.



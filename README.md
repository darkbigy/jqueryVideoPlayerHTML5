jqueryhtml5
===========

Player HTML5 using jquery


EDIT: Mutli-themes are comming soon

DEMO
---
Zip file provided or on my [webSite](http://adrianzambaux.free.fr/playerHTML5)

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
<br/>It fully uses JQuery implementation, improves performances and add new features.
<br/>The main purpose is to easily integrate a HTML5 video player in a web site.
<br/>Because I'm a really bad graphic designer, please be clement. That's why this plugin is fully graphically editable :)


Features 
---
* Easy integration
* Subtitles (.net) tracks support
* Customizable controller bar
* Customizable contextual menu
* Multi version (HD, SD, 16:9, 4:3, ...) of a same video
* True fullscreen (Mozilla & WebKit)
* Keyboard keys

Usage 
---

##### Implementation script

    <script type="text/javascript" src="http://code.jquery.com/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="./player-html5.jQuery.min.lib.js"></script>
    <script type="text/javascript">
      $(document).ready(function() { 
        $([my_selector]).jQueryVideoHTML5([options]);
      });
    </script>

`[options]` available are :

| Option Label         | Default value        | Description                                                            |
-----------------------|----------------------|------------------------------------------------------------------------|
| version              | 'SD'                 | Forced version                                                         |
| theme                | 'default-theme.html' | Name of the default theme (must be HTML file)                          |
| themePath            | './themes-player-jQ/'| Path where the theme is stored                                         |
| defaultVolume        | 0.5                  | Default volume when the player is load                                 |
| fontSize             | '12pt'               | Default size of str or captions                                        |
| displayEmptyStrMenu  | false                | Do you want display the str/cc button if no tracks are found           |
| displayEmptyQualMenu | false                | Do you want display the str/cc button if no multi versions are found   |
| skipStep             | 5					  | Time rewinded/forwaded when keyboard key pressed (keyboard keys bellow)|
| volumeStep		   | 0.1				  | Volume up/down when keyboard key pressed (keyboard keys below)         |
| activeKeyboard	   | true			      | Activate/Desactivate keyboard keys									   |
| isFullScreenOnPlay   | false                | `true` value : Force fullscreen when video is playing / stop when not in fullscreen|
| displayControllerOnlyFullScreen | false | `true` value : Display controller only in fullScreen State. Click to play available|
| activateContextualDefaultMenu | true | Activate/Desactivate contextual menu on the video|
| activateContextualCustomMenu  | false| Activate/Desactivate custom contextual menu on the video only if 'activateContextualDefaultMenu' option is false (see below custom contextual menu)|
|	autoPlay | false | Play automatically video when loaded if equal true|
| dbClickDelay | 270 | Set delay to detect double click and simple|

`[options]` using is :
`$(".my_class_selector").jQueryVideoHTML5({'theme' : 'my-custom-theme.html', 'displayEmptyStrMenu' : true});`

Here the plugin will be on every video elements with the class `my_class_selector`.<br/>

##### Implementation HTML elements

    <video controls class="my_class_selector">
      <source src="http://mywebsite/myvideo/webmVerisonSD.webm" type='video/webm' data-version='SD'/>
      <source src="http://mywebsite/myvideo/webmVerisonSD.ogv" type='video/ogg' data-version='SD'/>
      <source src="http://mywebsite/myvideo/webmVerisonSD.mp4" type='video/mp4' data-version='SD'/>
      <source src="http://mywebsite/myvideo/webmVerisonHD.ogv" type='video/ogg' data-version='HD'/>
      <source src="http://mywebsite/myvideo/webmVerisonSD.webm" type='video/webm' data-version='HD'/>
      <source src="http://mywebsite/myvideo/webmVerisonHD.mp4" type='video/mp4' data-version='HD'/>
      <track kind="subtitles" label="English" srclang="en" src="sub_en.srt" />
      <track kind="subtitles" label="Francais" srclang="fr" src="sub_fr.srt" />
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

##### Using public function

| function name        | parameters     	  | Using	                       | Description                                           |
-----------------------|----------------------|--------------------------------|-------------------------------------------------------|
| parseTimeCode        | time in sec (int)    | myVideo.parseTimeCode(42);     | Get a time in seconds and return a time formated mm:ss|
| activateKeyboard	   | activate (boolean)	  | myVideo.activateKeyboard(true);| Activate/desactivate keyboard key					   |

##### Keyboard Keys

| key       | action	 |
------------|------------|
| <button>↑</button> | Volume up  |
| <button>↓</button> | Volume down|
| <button>←</button>| Rewind     |
| <button>→</button>| Forward     |
| <button>Space</button>| Play/Pause |
|<button>Double click</button>| FullScreen|
 

Customize theme
---
The controller bar can be customized but it has to respect some rules.<br/>
First of all this code has to be at the begining of your theme :

    <div class="jqVideo5_captions_wrapper">
       <div class="jqVideo5_video_container"></div>
       <div class="jqVideo5_captions" ></div>
       <div class="jqVideo5_loading_activity"></div>
       <div class="jqVideo5_info_play_icon"></div>
       <div class="jqVideo5_info_pause_icon"></div>
    </div>
    <ul class="jqVideo5_controls" role="menubar">
      // Your controller here
    </ul>
     
Then you can move, add or delete some part based on default-theme.html.

###### Play controller :

    <li>
     <button class="jqVideo5_play_btn"  tabindex="0"></button>
    </li>

###### Time Bar controller :    
    
    <li>
     <div class="jqVideo5_timebar" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="0" aria-valuenow="0">
       <div class="jqVideo5_timebar_buffer" ></div>
       <div class="jqVideo5_timebar_inner">
        <div class="jqVideo5_timebar_pos"></div>
       </div>
     </div>
     <span class="jqVideo5_timebar_notice">00:00</span>
    </li>

##### Time tracker :  
    <li>
     <span class="jqVideo5_video_curpos" role="timer">00:00</span> / <span class="jqVideo5_video_duration">00:00</span>
    </li>

##### Sound controller :
  
    <li>
     <button class="jqVideo5_sound_btn"  tabindex="0"></button>
     <div class="jqVideo5_volume_ctrl" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="1" tabindex="0">
       <div class="jqVideo5_volumebar">
         <div class="jqVideo5_volumebar_inner">
           <div class="jqVideo5_volumebar_pos">
           </div>
         </div>
       </div>
		 </div>                                               
    </li>

##### Subtitles / captions menu :

    <li class="jqVideo5_sub">
     <button class="jqVideo5_captions_btn" tabindex="0">str</button>
     <ul class="jqVideo5_cc_tracks" >
      <li class="jqVideo5_menu_title">Str</li>
      <li class="jqVideo5_subtitles_item" >
        <label>
          <input type="radio" value="-1" name="jqVideo5_current_cc_"/>
          none
        </label>
      </li>                   
     </ul>
    </li>
    
##### Version Menu:

    <li class="jqVideo5_version_list">
     <button class="jqVideo5_version_btn"  tabindex="0" >Quality</button>
     <ul class="jqVideo5_version" >
       <li class="jqVideo5_menu_title">Qualité</li>
       <li class="jqVideo5_version_item active_track" >
        <label>
          <input type="radio"  name="jqVideo5_current_version_"/>
            Normal
        </label>
      </li>                   
     </ul>
    </li>
 
##### Fullscreen controller:
   
    <li>
      <button class="jqVideo5_fullscreen_btn" tabindex="0"></button>
    </li>

Customize contextual menu
---
To implement a custom contextual menu add wherever you want in `jqVideo5_captions_wrapper` (direct son) `<div>`:

     <div class="jqVideo5_context_menu">
     </div>

Then to add a button just add an `<div>` whith based class `button_contex`.
<br/> For example:

   <div class="jqVideo5_context_menu">
    <div class="button_contex play"></div>
    <div class="button_contex fullscreen"></div>
    <div class="button_contex sound"></div>
   </div>
 
You can add an unlimited number of buttons but don't forget to manage the size of your context menu and your buttons.
<br/><br/>
By Default 3 actions are available:
* Play/pause
* Mute/unmute
* Fullscreen
If you want to use them just add the following classes to `button_contex` class:
*play
*sound
*fullscreen
For example : `<div class="button_contex play"></div>`.
<br/>
In order to add an action to your own button add a class to `button_contex` class then add an event listener on it:

    <script type="text/javascript">
      $(document).ready(function() { 
        $('.button_contex.custom_1').click(function(){ //Do something};    
      });
    </script>
    
For this button `<div class="button_contex custom_1"></div>`
         

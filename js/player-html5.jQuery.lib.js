/**
 * Plugin Video HTML 5 Jquery
 *
 * @author Adrian 'didi' Zambaux <adrianzambaux@gmail.com>
 * @description This plugin load tools useful for HTML5 video elements.
 * Inspired by Playr plugin (Julien 'delphiki' Villetorte <gdelphiki@gmail.com>)
 * @copyright GNU GPLs
 * @version 1.0 07/11/2012
 */

 (function ($) {

  $.fn.jQueryVideoHTML5 = function(options) {
     // set Default settings, could add / or overwrite element by passing in parameters
     // in $(".jquery-player-HTML5").jQueryVideoHTML5({'arg1' : 'value1', ...});
     // They are common with all same video elements called
     var settings = $.extend(
    {
      'version'            : 'SD',     
      'theme'              : 'default-theme.html',
      'themePath'          : './themes-player-jQ/',
      'defaultVolume'      : 0.5,
      'fontSize'           : '12pt',
      'displayEmptyStrMenu'  :  false,
      'displayEmptyQualMenu' :  false,
      'skipStep'			 : 5,
      'volumeStep'			 : 0.1,
      'activeKeyboard'		 : true	
    }, options);
    
    var nb_video = 0;
    var plugin = this; 

	   /**
       *  @description Parse Timecode in sec and minute   
       */
      this.parseTimeCode = function(nb_sec)
      {
        nb_sec = Math.floor(nb_sec);
        var nb_min = 0;
        while(nb_sec - 60  > 0)
        {
          nb_sec = nb_sec - 60;
          nb_min++;
        }
        var sec = nb_sec.toString();
        if(sec.length==1)
        {
          sec = '0'+sec;
        }
        var min = nb_min.toString();
        if(min.length==1)
        {
          min = '0'+min;
        }	
        return min+':'+sec;
      };
      
      this.activateKeyboard = function(activate)
      {
       	settings.activeKeyboard = activate;
      };
      
    // Content of the plugin 
    return this.each(function(){   

      // unique video plugin parameters
      var params = ({
      'isHoldingTime'       : false,
      'isHoldingVolume'     : false,
      'isFullscreen'        : false,
      'isTrueFullscreen'    : false,
      'fsStyle'             : null,
      'fsVideoStyle'        : null,
      'video'               : $(this),
      'parent_container'    : null,
      'id_video'            : ++nb_video,
      'current_track'       : -1,
      'subs'                : []  
      });
          
       /**
       *  @description First methode called. Init video controller from a 
       *  template file set in settings.theme and settings.themePath           
       */
       var init = function()
      {
        $.ajax({
            url: settings.themePath + settings.theme,
            dataType: 'html',
            success: function(data) 
            {
             // Move video element inside jqVideo5 wrapper
             params.video.removeAttr('controls')           
               		 .before($('<div></div>')
               		 .attr('class', 'jqVideo5_wrapper')
               		 .attr('data-tabindex', '0')
               		 .html(data));
              params.video.appendTo($('.jqVideo5_video_container', params.video.prev()));
              params.parent_container = params.video.parents('.jqVideo5_wrapper')
              initEventsListeners();
              loadTrackTags();
              loadVersionTags();
              params.video[0].volume = settings.defaultVolume;
              setVolume(false, null);
              timeCode();
            },
            error: function (data) {
              alert(data);
            } 
        });
      };
      
      /**
       *  @description Init controllers events  
       */
      var initEventsListeners = function ()
      { 
        // video events
        params.video.on('click', function(){play();});
        params.video.on('timeupdate', function(){timeCode();displayCaptions();});
        params.video.on('ended', function(){eventEnded();});
        params.video.on('play', function(){playEvent();});
        params.video.on('pause', function(){playEvent();});
        params.video.on('volumechange', function(){volumeChangeEvent();});
        params.video.on('progress', function(){progressEvent();});
        params.video.on('loadstart', function(){timeCode();});
        
        // play event
        $('.jqVideo5_play_btn', params.parent_container).on('click', function(){play()});
        
        // timebar events
        $('.jqVideo5_timebar', params.parent_container).on('mousedown', function(){params.isHoldingTime = true;});
        $('.jqVideo5_timebar', params.parent_container).on('mouseup', function(event){params.isHoldingTime = false; setPositionTimeBar(event, true);});
        ($('.jqVideo5_timebar', params.parent_container).parent()).on('mousemove', function(event){noticeTimecode(event); if (params.isHoldingTime){setPositionTimeBar(event, false);}});
        
        // fullscreen click
        $('.jqVideo5_fullscreen_btn', params.parent_container).on('click', function(){fullScreen();});
        
        // true fullscreen
        $(document).on('mozfullscreenchange', function(){if(!$(document)[0].mozFullScreen && params.isTrueFullscreen){fullScreen();}});
        $(document).on('webkitfullscreenchange', function(){if(!$(document)[0].webkitIsFullScreen && params.isTrueFullscreen){fullScreen();}});
        
        // volume control events
        $('.jqVideo5_volumebar', params.parent_container).on('mousedown', function(){params.isHoldingVolume = true;});
        $('.jqVideo5_volumebar', params.parent_container).on('mouseup', function(event){params.isHoldingVolume = false; setVolume(true, event);});
        $('.jqVideo5_volumebar', params.parent_container).on('mousemove', function(event){if(params.isHoldingVolume){setVolume(true, event)}});
        $('.jqVideo5_sound_btn', params.parent_container).on('click', function(){toggleMute();});      
        
        //mouse event
        $('.jqVideo5_wrapper').hover(function(){mouseHoverPlayer(true);}, function(){mouseHoverPlayer(false);});
        
        //Key Event
        $(document).on('keydown', function(event){keyPressed(event)});
      };
      
      var keyPressed = function(event)
      {
      	console.log(settings);
      	if (settings.activeKeyboard)
      	{
      		switch(event.keyCode)
      		{
      		case 32: // space bar
      			play();
      		break;
      		case 37: // arrow left
      			if (params.video[0].currentTime - settings.skipStep < 0)
      			{
      				params.video[0].currentTime = 0;
      			}
      			else
      			{
      				params.video[0].currentTime -= settings.skipStep;
      			}
      		break;
      		case 38: // arrow up
      			if (params.video[0].volume + settings.volumeStep > 1)
      			{
      				params.video[0].volume = 1;
      			}
      			else
      			{
      				params.video[0].volume += settings.volumeStep;
      			}
      			setVolume(false, null);
      		break;
      		case 39: // arrow right
      			if (params.video[0].currentTime + settings.skipStep > params.video[0].duration)
      			{
      				params.video[0].currentTime = params.video[0].duration;
      			}
      			else
      			{
      				params.video[0].currentTime += settings.skipStep;
      			}
      		break;
      		case 40: // arrow down
      			if (params.video[0].volume - settings.volumeStep < 0)
      			{
      				params.video[0].volume = 0;
      			}
      			else
      			{
      				params.video[0].volume -= settings.volumeStep;
      			}
      			setVolume(false, null);
      		break;
      		}
      	event.preventDefault();	
      	}
      };

      /**
       *  @description If available, load multi version of a same video element 
       *  and store it in a list element   
       */
      var loadVersionTags = function()
      {
        var version_array = [];
        // Browses source elements of a video element
        $.each($('source', params.video), function()
          {
            var doesExist = false;
            for (i = 0; i < version_array.length && !doesExist; ++i)
            {
              if (version_array[i] == $(this).attr('data-version'))
              {
                doesExist = true;
              }
            }
            if (!doesExist)
            {
              version_array.push($(this).attr('data-version'));
            }
          });
        
        // create a list if more than 1 source version exists
        if (version_array.length > 1 && version_array[0] != 'undefined')
        {
           $('.jqVideo5_version', params.parent_container).html($('.jqVideo5_menu_title', $('.jqVideo5_version', params.parent_container)));                                             
           for (i = 0; i < version_array.length; ++i)
           {
               $('.jqVideo5_version', params.parent_container).append('<li class="jqVideo5_version_item"><label>'
                                                                 		+'<input type="radio" value="'+version_array[i]+'" name="jqVideo5_current_version_'+params.id_video+'"/> '
                                                                  	+ version_array[i]
                                                                  	+'</label></li>');
           }
           var version_inputs = $('input', $('.jqVideo5_version', params.parent_container));
           for (i = 0; i < version_inputs.length; ++i)
           {
              if (($(version_inputs[i]).val() == settings.version)
                    || ($(version_inputs[i]).val() == $('source[src="'+params.video[0].currentSrc+'"]', params.video).attr('data-version')))
              {
                $(version_inputs[i]).prop('checked', true);
                break;
              }
           }
           setActiveVersion();
           for (i = 0; i < version_inputs.length; ++i)
           {
              $(version_inputs[i]).on('change', function(){setActiveVersion()});
           }
        }
        // hide default menu version (default == false)
        else if (!settings.displayEmptyQualMenu)
        {
            $('.jqVideo5_version_list', params.parent_container).css('display', 'none');
        }
      };

      /**
       *  @description Select the active (selected) video version    
       */
      var setActiveVersion = function()
      {
        var version_li = $('li.jqVideo5_version_item', params.parent_container);
        var version_inputs = $('input', $('.jqVideo5_version', params.parent_container));
        for(i = 0; i < version_inputs.length; ++i)
        {
          if($(version_inputs[i]).prop('checked'))
          {
            $(version_li[i]).attr('class', 'jqVideo5_version_item active_track');
            changeActiveVideo($(version_inputs[i]).val());
          }
          else
          {
            $(version_li[i]).attr('class', 'jqVideo5_version_item');
          }
        }
      };
      
      /**
       *  @description  When user selects an other version than the current one,
       *  load it and change the video element's source        
       */
      var changeActiveVideo = function(version)
      {
           var source_list = $('source' ,params.video);
           var tmp_source_list = [];
           for (i = 0; i < source_list.length; ++i)
           {
              if ($(source_list[i]).attr('data-version') == version)
              {
                tmp_source_list.push(source_list[i]);
              }
           }
           var isLoaded = false;
           for (i = 0; i < tmp_source_list.length && !isLoaded; ++i)
           {
               if(params.video[0].canPlayType($(tmp_source_list[i]).attr('type')))
               {
                  var willPlay = params.video[0].paused;
                  var video_currentTime = params.video[0].currentTime;
                  params.video[0].pause();
                  params.video[0].src = $(tmp_source_list[i]).attr('src');
                  params.video[0].load();
                  if (!willPlay)
                  {
                    play();
                  }
                  params.video.on('loadeddata', function(){params.video[0].currentTime = video_currentTime;});
                  isLoaded = true;
               }
           }
      };
      
      /**
       *  @description Load track elements   
       */
      var loadTrackTags = function()
      {
        var track_tags =  $('track', params.video);
        var i = 0;
    		if(track_tags.length > 0)
        {
          loadTrackContent(0, track_tags);
        }
        else
        {
           $('.jqVideo5_sub', params.parent_container).css('display', 'none');
        }
      };

      /**
       *  @description Load tracks content and store it in a list element   
       */
      var loadTrackContent = function(track, track_tags)
      {
        var curTrack = $(track_tags.get(track));
        $.ajax({
          url: curTrack.attr('src'),
          dataType: 'html',
          success: function(data){
            if (data != '')
            {
              var kind = curTrack.attr('kind');
              if (kind == null || kind == '')
              {
                kind = 'subtitles';
              }
              parseTrack(data, kind);
              if (kind == 'subtitles' || kind == 'captions' || kind == 'descriptions')
              {
                var label = curTrack.attr('label');
                var lang = curTrack.attr('srclang');
                if (label != null)
                {
                  track_label = label;
                }
                else if(lang != null) 
                {
                  track_label = lang;
                }
                else 
                {
                  track_label = 'Track '+ (track + 1);
                }
                $('.jqVideo5_cc_tracks', params.parent_container).append('<li class="jqVideo5_subtitles_item"><label>'
                                                                 			 +'<input type="radio" value="'+track+'" name="jqVideo5_current_cc_'+params.id_video+'"/> '
                                                                  		 + track_label
                                                                  	   +'</label></li>');
              }
              ++track;
              if (track < track_tags.length)
              {
                loadTrackContent(track, track_tags);
              }
              else
              {
                setDefaultTrack(track_tags);
              }
            }

          },
         error: function (data) {
            alert(data);
         } 
        });
      };

      /**
       *  @description Load in Div the default track content  
       */
      var setDefaultTrack = function(track_tags)
      {
        var track_list = $('input', $('.jqVideo5_cc_tracks', params.parent_container));
        var to_check = 0;
        $(track_list[0]).attr('value', -1).attr('name', $(track_list[0]).attr('name')+params.id_video);
        $(track_list[0]).on('change', function(){setActiveTrack();});
        for(i = 0; i < track_tags.length; ++i)
        {
        	if($(track_tags[i]).attr('kind') == 'subtitles')
         {
          if($(track_tags[i]).attr('srclang') == 'lang' && to_check == 0)
          {
            to_check = i+1;
          }
          if($(track_tags[i]).is('default'))
          {
            to_check = i+1;
          }
          $(track_list[i+1]).on('change', function(){setActiveTrack();});
         }
        }
        
        if($(track_list[to_check]))
        {
          $(track_list[to_check]).prop('checked', true);
        }
        else
        {
          $(track_list[0]).prop('checked', true);
        }
        setActiveTrack();
      };

      /**
       *  @description Set the active track in a div  
       */
      var setActiveTrack = function()
      {
        var track_li = $('li.jqVideo5_subtitles_item', params.parent_container);
        var track_inputs = $('input', $('.jqVideo5_cc_tracks', params.parent_container));
        for(i = 0; i < track_inputs.length; ++i)
        {
          if($(track_inputs[i]).prop('checked'))
          {
            $(track_li[i]).attr('class', 'jqVideo5_subtitles_item active_track');
          }
          else
          {
            $(track_li[i]).attr('class', 'jqVideo5_subtitles_item');
          }
        }
      };

      /**
       *  @description Parse .srt File and separate time code from content  
       */
      var parseTrack = function(track_content, track_kind)
      {
        if(track_kind == 'subtitles' || track_kind == 'captions' || track_kind == 'descriptions')
        { 
        	var pattern_identifier = /^([0-9]+)$/; 
        }
  		  var pattern_timecode = /^([0-9]{2}:[0-9]{2}:[0-9]{2}[,.]{1}[0-9]{3}) --\> ([0-9]{2}:[0-9]{2}:[0-9]{2}[,.]{1}[0-9]{3})(.*)$/;
  		  var lines = track_content.split(/\r?\n/);
        var entries = [];
        for(i = 0; i<lines.length; i++) 
        {
          if(identifier = pattern_identifier.exec(lines[i]))
          {
            i++;
          	var timecode = pattern_timecode.exec(lines[i])
          	if(timecode && i< lines.length)
            {
          	 i++;
             var text = lines[i++];
             while(lines[i] != '' && i <lines.length)
             {
              text = text + '\n' + lines[i];
              i++;
             }
             entries.push({
              'identifier': identifier[0],
              'start': tc2sec(timecode[1]),
              'stop': tc2sec(timecode[2]),
              'start_tc': timecode[1],
              'stop_tc': timecode[2],
              'text': text,
              'settings': timecode[3]
             });
  					}
  	    	}
          params.subs.push(entries);
       }
     };

     /**
       *  @description Parse timecode and convert it in seconds
       *  @return table of time parsed in seconds          
       */
     var tc2sec = function(timecode)
     {
        var tab = timecode.split(':');
        return tab[0]*60*60 + tab[1]*60 + parseFloat(tab[2].replace(',','.'));
     };

     /**
       *  @description Display active track in main wrapper
       *             
       */
     var displayCaptions = function()
     {
      	var captions_div = $('.jqVideo5_captions', params.parent_container);
        var jqVideo5_cc_choices = $('input', $('.jqVideo5_cc_tracks', params.parent_container));
      	for (var i=0; i < jqVideo5_cc_choices.length; i++)
      	{
			   if($(jqVideo5_cc_choices[i]).prop('checked'))
			   {
				  current_track = $(jqVideo5_cc_choices[i]).val();
			   }
		    }
     	  if (current_track >= 0)
        {
          for(i = 0; i < params.subs[current_track].length; i++)
          {
            if(params.video[0].currentTime >= params.subs[current_track][i].start 
            					&& params.video[0].currentTime <= params.subs[current_track][i].stop)
            {
              var text = params.subs[current_track][i].text;
              var captions_wrapper = params.video.parents('.jqVideo5_captions_wrapper');
              var wrapper_classes = ['jqVideo5_captions_wrapper'];
              var captions_container_classes = ['jqVideo5_captions'];
              var captions_container_styles = $('<span></span>').css('text-align', 'center');
              var paragraph_caption = $('<p></p>');
              var captions_lines_styles = $('<span></span>');
              var captions_letters_styles = $('<span></span>');
              
						  // voice declaration tags
              var voice_declarations = /<v ([^>]+)>/i;
              while(test_vd = voice_declarations.exec(text))
              {
                text = text.replace(test_vd[0], '<span class="'+test_vd[1].replace(' ', '_')+'">');
              }
              
              // classes tags
              var classes = /<c\.([a-z0-9-_.]+)>/i;
              while(test_classes = classes.exec(text))
              {
                var classes_str = test_classes[1].replace('.', ' ');
                text = text.replace(test_classes[0], '<span class="'+classes_str+'">');
              }
              text = text.replace(/(<\/v>|<\/c>)/ig, '</span>');
              
						  // karaoke (timestamps)
              var timestamps = /<([0-9]{2}:[0-9]{2}:[0-9]{2}[,.]{1}[0-9]{3})>/;
              var prefix = false;
              while(test_timestamps = timestamps.exec(text))
              {
                if(this.tc2sec(test_timestamps[1]) < this.params.video.currentTime)
                {
                  text = text.replace(test_timestamps[0], '</span><span class="jqVideo5_cue_past">');
                }
                else
                {
                  text = text.replace(test_timestamps[0], '</span><span class="jqVideo5_cue_future">');
                }
                prefix = true;
              }
              if(prefix)
              {
                text = '<span class="jqVideo5_cue_past">' + text;
              }
              
						  // if cue settings
              if(params.subs[current_track][i].settings != '')
              {
                var text_align = /(A|align):(start|middle|end)/i;
                var text_size = /(S|size):([0-9]{0,3})%/i;
                var text_position = /(T|position):([0-9]{0,3})%/i;
                var vertical_text = /(D|vertical):(vertical-lr|vertical|lr|rl)/i;
                var line_position = /(L|line):(-?[0-9]{0,3})(%?)/i;
                
							  var test_ta = text_align.exec(params.subs[current_track][i].settings);
                var test_ts = text_size.exec(params.subs[current_track][i].settings);
                var test_tp = text_position.exec(params.subs[current_track][i].settings);
                var test_vt = vertical_text.exec(params.subs[current_track][i].settings);
                var test_lpp = line_position.exec(params.subs[current_track][i].settings);
                
							  // if text align specified
                if(test_ta)
                {
                  if(test_ta[2] == 'start')
                  { 
                    paragraph_caption.css('text-align', 'left');
                  }
                  else if(test_ta[2] == 'middle')
                  { 
                    paragraph_caption.css('text-align', 'center'); 
                  }
                  else if(test_ta[2] == 'end')
                  { 
                    paragraph_caption.css('text-align', 'right');
                  }
                }

							// if text position specified
              if(test_tp && test_tp[2] >= 0 && test_tp[2] < 50)
              {
              	captions_container_styles.css('text-align', 'left');
                paragraph_caption.css('margin-left', test_tp[1]+'%');
              }
              else if(test_tp && test_tp[2] > 50 && test_tp[2] <= 100)
              {
                captions_container_styles.css('text-align', 'right');
                paragraph_caption.css('margin-left', (100-test_tp[2])+'%');
              }
              
							// if text size specified
              if(test_ts)
              { 
                var new_font_size = (test_ts[2]/100) * parseInt(this.config.fontSize);
                paragraph_caption.css('font-size', new_font_size+'pt');
              }
              
							// if vertical text specified
              if(test_vt)
              {
                captions_letters_styles.css('display', 'block');
                captions_letters_styles.css('min-height','5px');
                captions_letters_styles.css('min-width', '1px');
                text = '<span style="'+captions_letters_styles.attr('style')+'">'
                  		+text.split('').join('</span><span style="'+captions_letters_styles.attr('style')+'">')
                  		+'</span>';
                text = text.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1</span><br /><span>$2');
                captions_lines_styles.css('display', 'block').css('padding', '5px').css('text-align', 'center');
                if(test_vt[2] == 'vertical-lr' || test_vt[2] == 'lr')
                {
                  captions_lines_styles.css('float', 'left');
                  paragraph_caption.css('float', 'left');
                }
                else
                {
                  captions_lines_styles.css('float', 'right');
                  paragraph_caption.css('float', 'right');
                }
                
                captions_lines_styles.css('background-color', 'rgba(0,0,0,0.75)');
                paragraph_caption.css('background', 'none');
								captions_container_styles.css('top', '0');
								text = text.replace(/<br \/>/, '</span><span style="'+captions_lines_styles.attr('style')+'">');
								text = text.replace(/<span>(\r\n|\n\r|\r|\n)<\/span>/g, '');
							}

							// if line position specified
							if(test_lpp && test_lpp[2] >= -100 && test_lpp[2] <= 100)
							{
								if(test_lpp[3] == '%')
								{
									var side = (test_lpp[2] < 0) ? 'bottom':'top';
									var value = Math.abs(test_lpp[2]);
									captions_container_styles.css(side, value+'%');
								}
							}
						}

						if(params.isFullscreen)
						{
							var factor = Math.round((window.innerHeight - 30) / params.fsVideoStyle.height * 100) / 100; 							paragraph_caption.css('font-size', Math.round(parseInt(settings.fontSize)*factor) + 'pt');
						}
  					captions_wrapper.attr('class', wrapper_classes.join(' '));
						captions_div.attr('class', captions_container_classes.join(' '))
									      .attr('style', captions_container_styles.attr('style'))
									      .css('visibility', 'visible')
									      .css('bottom', $('.jqVideo5_controls', params.parent_container).css('height'));
						if(!test_vt)
						{	
							text = text.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1</span><br /><span style="'+captions_lines_styles.attr('style')+'">$2');
						}
						captions_div.html(paragraph_caption.append(captions_lines_styles.append(text)));
				}
			}
		}
  };
      /**
       *  @description Method called when fullscreen button is clicked    
       */
      var fullScreen = function()
      {
      	var vids = $('.jqVideo5_wrapper');
      	var wrapper = params.parent_container;
  		  var captions = $('.jqVideo5_captions', wrapper);
        if(!params.isFullscreen)
        {
  			   for(i = 0; i < vids.length; ++i)
           {
              vids.css('visibility', 'hidden');
           }
  			   wrapper.css('visibility', 'visible');
           params.fsStyle = ({'height' : wrapper.css('height'), 'width' : wrapper.css('width')});
           params.fsVideoStyle = ({'height' : params.video.height(), 'width' : params.video.width()});
           if (($('html')[0]).requestFullscreen)
  			   {
              params.isTrueFullscreen = true;
              ($('html')[0]).requestFullscreen();
  			   }
  			   else if (($('html')[0]).mozRequestFullScreen)
  			   {
  				    params.isTrueFullscreen = true;
  				    ($('html')[0]).mozRequestFullScreen();
  			   }
  			   else if(($('html')[0]).webkitRequestFullScreen)
  			   {
  				    params.isTrueFullscreen = true;
              ($('html')[0]).webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
           }

           if (params.isTrueFullscreen)
           {
  				    wrapper.css('position', 'fixed').css('top', 0).css('left', 0).css('height', '100%').css('width', '100%').css('backgroundColor', '#000000');
              params.video.css('width', '100%').css('height', (screen.height-30)+'px');
              $('body').css('overflow', 'hidden');
  			   }
           else
           {
  				    wrapper.css('position', 'fixed').css('top', 0).css('left', '50%').css('height', screen.height+'px').css('width', screen.width+'px').css('background-color', '#000000').css('margin-left', '-'+Math.round(wrapper.width() / 2)+'px');
  				    params.video.css('width', $(window).innerWidth()+'px').css('height', ($(window).innerHeight()-30)+'px');
      				$('body').css('overflow', 'hidden');
  			   }
  			   params.isFullscreen = true;
  			   wrapper.attr('class', wrapper.attr('class') + (wrapper.attr('class') ? ' ' : '')+'jqVideo5_is_fullscreen');
           var factor = Math.round((window.innerHeight - 30) / params.fsVideoStyle.height * 100) / 100;
					 $('p', $('.jqVideo5_captions', params.parent_container)).css('font-size', Math.round(parseInt(settings.fontSize)*factor) + 'pt');
  		  }
  		  else
  		  {
  			   if ($(document)[0].cancelFullscreen)
  			   {
  			     $(document)[0].cancelFullscreen();
           }
  			   else if ($(document)[0].exitFullscreen)
           {
              $(document)[0].exitFullscreen();
           }
  			   else if ($(document)[0].mozCancelFullScreen)
           {
              $(document)[0].mozCancelFullScreen();
           }
           else if ($(document)[0].webkitCancelFullScreen)
           {
              $(document)[0].webkitCancelFullScreen();
           }
           for(i = 0; i < vids.length; ++i)
           {
              vids.css('visibility', 'visible');
           }
           wrapper.css('position', 'inherit').css('left', 0).css('height', params.fsStyle.height).css('width', params.fsStyle.width).css('background-color', 'transparent').css('margin-left', 0);
           params.video.css('height', params.fsVideoStyle.height+'px').css('width', params.fsVideoStyle.width+'px');
           $('body').css('overflow', 'auto');
           params.isFullscreen = false;
           params.isTrueFullscreen = false;
           wrapper.attr('class', wrapper.attr('class').replace(new RegExp('(\\s|^)jqVideo5_is_fullscreen(\\s|$)'),' ').replace(/^\s+|\s+$/g, ''));
           $('p', $('.jqVideo5_captions', params.parent_container)).css('font-size', '');
        }                                                                                                                                               
        $('.jqVideo5_video_container', wrapper).css('height', params.video.height()+'px');
      };
  
       /**
       *  @description Action when the mouse is hover the video Player or not            
       */
      var mouseHoverPlayer = function(isHover)
      {
        if (!params.video[0].paused)
        {
          if (isHover)
          {
            $('.jqVideo5_controls', params.parent_container).css('opacity', 1);	
          }
          else
          {
            $('.jqVideo5_controls', params.parent_container).css('opacity', 0);
          }
        }	
      };      

      /**
       *  @description Set the volume when user move the slider or volume is
       *  changed by the player           
       */
      var setVolume = function(hasEvent, event)
      {
        var curVol = 0;
        if (hasEvent)
        {
          var volumebar = $('.jqVideo5_volumebar', params.parent_container);
          var pos = findPos(volumebar[0]);
          var diffy = event.pageY - pos.y;
          curVol = 100 - Math.round(diffy * 100 / volumebar.height());
          if (curVol > 0)
          {
            params.video[0].muted = false;
          }
        }
        else
        {
          curVol = params.video[0].volume *  100;
        }
        if(curVol <= 100)
        {
          if (curVol < 0)
          {
            curVol = 0;
            params.video[0].muted = true;
          }
          $('.jqVideo5_volumebar_inner', params.parent_container).css('height', curVol.toString()+'%');
          params.video[0].volume = curVol / 100;
          $('.jqVideo5_volume_ctrl', params.parent_container).attr('aria-valuenow', curVol / 100);
        }
      };      

      /**
       *  @description Change the value of video's mute   
       */
      var toggleMute = function()
      {
        if(!params.video[0].muted)
        {
          params.video[0].muted = true;
        }
        else
        {
          params.video[0].muted = false;
        }
        if(params.video[0].volume == 0)
        {
           params.video[0].volume = settings.defaultVolume;
           setVolume(false, null);
        }
      };      

      /**
       *  @description Look for the position of the element
       *  @return An object of position x and y           
       */
      var findPos = function(el)
      {
        var x = y = 0;
        if(el.offsetParent)
        {
          do 
          {
          x += el.offsetLeft;
  				y += el.offsetTop;          
  				}
          while(el = el.offsetParent);					
  			}
  			return {x:x,y:y};
  		};
  
       /**
       *  @description Set the TimeBar slider's position   
       */
      var setPositionTimeBar = function(event, update)
      {
        var timebar = $('.jqVideo5_timebar', params.parent_container);
        var pos = findPos(timebar[0]);
        var diffx = event.clientX - pos.x;
        var curTime = Math.round(diffx * 100 / timebar[0].offsetWidth);
        $('.jqVideo5_timebar_inner', params.parent_container).css('width', curTime.toString()+'%');
        if(update)
        {
          params.video[0].currentTime = Math.round(curTime * params.video[0].duration / 100);
        }
      };

      /**
       *  @description Event received when the time code change    
       */
      var noticeTimecode = function(event)
      {
        var timebar = $('.jqVideo5_timebar', params.parent_container);
        var notice = $('.jqVideo5_timebar_notice', params.parent_container);
        var pos = findPos(timebar[0]);
        var diffx = event.clientX - pos.x;
        var curTime = Math.round(diffx * 100 / timebar[0].offsetWidth);
        if(curTime < 0)
        {
          curTime = 0;
        }
        notice.html(plugin.parseTimeCode(Math.round(curTime * params.video[0].duration / 100)));
        notice.css('marginLeft', (diffx + 3 - notice[0].offsetWidth / 2)+'px');
      };
      
      /**
       *  @description Event called when the video is called   
       */
      var progressEvent = function()
      {
        if (params.video[0].buffered.length == 0)
        {
          return;
        }
        var buff_end = params.video[0].buffered.end(0);         
        if(buff_end	 == params.video[0].duration)
        {
          $('.jqVideo5_timebar_buffer', params.parent_container).css('width', ($('.jqVideo5_timebar', params.parent_container).css('offsetWidth') - 2)+'px');
        }
        else
        {
          var bar_width = $('.jqVideo5_timebar', params.parent_container).css('offsetWidth');
          var cur_width = Math.round((buff_end * bar_width) / params.video[0].duration);
          $('.jqVideo5_timebar_buffer', params.parent_container).css('width', cur_width+'px');
        }
      };
  
       /**
       *  @description Event called when the volume is changed   
       */
      var volumeChangeEvent = function()
      {
        if(params.video[0].volume == 0 || params.video[0].muted)                
        {
           $('.jqVideo5_sound_btn').addClass('mute');
        }
        else if($('.jqVideo5_sound_btn').hasClass('mute'))
        {
          $('.jqVideo5_sound_btn').removeClass('mute');
        }
      };
      
      /**
       *  @description Event called when the video starts playing  
       */
      var playEvent = function()
      { 
        $('.jqVideo5_play_btn').toggleClass('pause');     
      };
  
      /**
       *  @description Event called when the video is over   
       */
      var eventEnded = function()
      { 
        params.video[0].currentTime = 0;
        params.video[0].pause();
        $('.jqVideo5_play_btn').toggleClass('pause');
        $('.jqVideo5_controls', params.parent_container).css('opacity', 1);
      };

      /**
       *  @description Update time labels (duration and curent timecode)   
       */
      var timeCode = function()
      {                                 
        $('.jqVideo5_timebar', params.parent_container).attr('aria-valuemax', Math.round(params.video[0].duration * 100) / 100);
        $('.jqVideo5_timebar', params.parent_container).attr('aria-valuenow', params.video[0].currentTime); 
        $('.jqVideo5_video_curpos', params.parent_container).html(plugin.parseTimeCode(params.video[0].currentTime));
        if ($('.jqVideo5_video_duration', params.parent_container).html() == '00:00' || plugin.parseTimeCode(params.video[0].duration != $('.jqVideo5_video_duration', params.parent_container).html()))
        {
          $('.jqVideo5_video_duration', params.parent_container).html(plugin.parseTimeCode(params.video[0].duration));
        }        
  			if(!params.isHoldingTime)
        {
          $('.jqVideo5_timebar_inner', params.parent_container).css('width', params.video[0].currentTime * 100 / params.video[0].duration + '%');
        }
      };
  
       /**
       *  @description  Play or pause the video  
       */
      var play = function()
      {
        if (params.video[0].paused)
        {
          params.video[0].play();
        }
        else
        {
          params.video[0].pause();
        }
      };
      
     // constructor  
     init();
     return $(this);
  }); 
  
}})(jQuery);

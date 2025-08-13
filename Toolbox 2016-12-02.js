/* iPRSM Toolbox - v1.0.0 - 2016-05-31
** https://www.costestimatorpro.com/content/rstools/js/iprsm-toolbox.min.js
** Copyright 2016 Provenance Consulting, LLC */

// get the current URL
var currentURL = window.location.href;

// initialize variables to house main tag elements 
var HTML = document.getElementsByTagName('html')[0];
var Body = document.getElementsByTagName('body')[0];
var Head = document.getElementsByTagName('head')[0];

// trusted external library locations
var jsJquery = 'https://www.costestimatorpro.com/content/rstools/js/jquery.min.js';
var jsJqueryUI = 'https://www.costestimatorpro.com/content/rstools/js/jquery-ui.min.js';

// stylesheet locations
//var toolboxCSS = 'https://rawgit.com/dvargas46/provenance/master/iPRSM%20Toolbox.css';
var toolboxCSS = 'https://cdn.jsdelivr.net/gh/sh48846/Tools@8ccd74b/Toolbox.min.css';

// image locations
var provLogo = 'https://cdn.jsdelivr.net/gh/sh48846/Tools@main/Transparent%20Logo%20-%204K%20Remaster%20202508131254pm.min.png';

// URL locations
var prov = 'https://www.provenanceconsulting.com';
var StreamAutomator = 'https://www.costestimatorpro.com/content/rstools/excel/iPRSM%20Stream%20Automator.xlsm';
var RSCart = 'https://www.costestimatorpro.com/content/rstools/excel/RS%20Calculation%20and%20Resource%20Toolbox.xlsm';
var MassReportTool = 'https://www.costestimatorpro.com/content/rstools/excel/iPRSM%20Mass%20Report%20Extraction%20Tool.xlsm';
var PPMTool = 'https://www.costestimatorpro.com/content/rstools/excel/PPM%20to%20iPRSM%20Transfer%20Tool.xlsm';
//var ProvManual = 'https://www.costestimatorpro.com/content/rstools/excel/Provenance%20Toolbox%20Manual.pdf';

// Global variables
var retData =''; // testing for pipe entry mode -- return html data from post
var deleteErr = 0; // counter for errors when delete mode is active
var serializedArray = []; // storing bin for serialized data during queue system
var queueN = 0; // counter for queue
var t2 = 0;
var pipeFitting = {};
var errCounter = 0;
var errRefresh = 0;
var ActionArgTracker = [];
var errTrackerDB = [];
var cssLoaded = false;

// ----------------------------------------------------------------------------------
// --------------------------- IMPORTANT HEADER FUNCTIONS ---------------------------
// ----------------------------------------------------------------------------------

// initialize function to import useful js libraries throughout the code when needed
function ImportScript(jsURL, id) {
    //console.log('importing script header: ' + id);
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = jsURL;
    script.id = id;
    Head.appendChild(script);
}

// initialize function to import useful css stylesheets throughout the code when needed
function ImportStylesheet(cssURL, id) {
    //console.log('adding stylesheet id: ' + id);
    var stylesheet = document.createElement('link');
    stylesheet.type = 'text/css';
    stylesheet.rel = 'stylesheet';
    stylesheet.href = cssURL;
    stylesheet.id = id;
    stylesheet.onload = function(){ cssLoaded = true; };
    Head.appendChild(stylesheet);
}

// initialize function to remove js libraries after its purpose is no longer required
function RemoveHeader(id) {
    //console.log('removing script header: ' + id);
    Head.removeChild(document.getElementById(id));
}

// Import necessary JS script headers - jQuery and jQueryUI for now
if (typeof jQuery == 'undefined') { ImportScript(jsJquery, 'jquery'); }

var forceImport = window.setInterval(function() {
    if (typeof jQuery == 'function') {
        ImportScript(jsJqueryUI, 'jqueryUI');
        window.clearInterval(forceImport);
    }
}, 200);

// Import necessary CSS stylesheet headers - none for now
ImportStylesheet(toolboxCSS, 'tbCSS');

// ---------------------------------------------------------------------------------
// -------------------------- MAIN FUNCTION TO SHOW PANEL --------------------------
// ---------------------------------------------------------------------------------

var mode = 'default'; // used for different dynamic modes

function showSidePanel() {

    // Check if sidepanel is already open
    if (document.getElementById("sidepanel") !== null) {
        $('#sidepanel').slideDown('fast');
        return;
    }

    // Create sidepanel once css is loaded
    if (cssLoaded === false) {
        return;
    }

    // Create sidepanel element
    //console.log('creating toolbox elements...');

    var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    var el = document.createElement('div');
    el.id = 'sidepanel';
    el.style.visibility = 'hidden';

    if (document.documentMode <= "8") {  // assign different CSS class if IE version is 8 or below
        el.className = 'toolbox ie8down toolbox--hover'; el.style.top = scrollTop + 90 + 'px';
        alert('Your browser currently does not support this feature. Please upgrade to Microsoft Internet Explorer 9 or above.');
    } else { // else assign default CSS class
        el.className = 'toolbox'; 
    }

    // Main menu panel ---------------------------------------------------
    var content = "<div class='toolbox__menu'>"; // Menu

    // Provenance logo - always visible
    content += "<div id='image_logo' class='toolbox__menu__logo'><img src='" + provLogo + "'></div>";
    content += "<div class='toolbox__menu__title'>Provenance Toolbox</div>";
    
    content += "<hr><br>";
    content += "&nbsp;&nbsp;FUNCTIONS<br>";
    content += "<a href='javascript:expandingNotes();' class='toolbox__menu__link'><div class='toolbox__menu__item'>";
        content += "&nbsp;&nbsp;Expand Notes&nbsp;&nbsp;</div></a>"; // Item
    content += "<a href='javascript:enablePipeSchEdit();' class='toolbox__menu__link'><div class='toolbox__menu__item'>";
        content += "&nbsp;&nbsp;Edit Pipe Schedules&nbsp;&nbsp;</div></a>"; // Item
    content += "<a href='javascript:changeFrictionFactors();' class='toolbox__menu__link'><div class='toolbox__menu__item'>";
        content += "&nbsp;&nbsp;Change &fnof; to Calculate from &epsilon;&nbsp;&nbsp;</div></a>"; // Item
    content += "<a href='javascript:changeRoughness();' class='toolbox__menu__link'><div class='toolbox__menu__item'>";
        content += "&nbsp;&nbsp;Change &epsilon; to Used Steel Pipe&nbsp;&nbsp;</div></a>"; // Item
    content += "<a href='javascript:manageMode(\"piping_short\");' class='toolbox__menu__link'><div class='toolbox__menu__item'>";
        content += "&nbsp;&nbsp;Pipe Input Mode&nbsp;&nbsp;</div></a>"; // Item
    content += "<a href='javascript:manageMode(\"delete_pipe\");' class='toolbox__menu__link'><div class='toolbox__menu__item'>";
        content += "&nbsp;&nbsp;Delete Pipe Fittings&nbsp;&nbsp;</div></a>"; // Item
    content += "<a href='javascript:manageMode(\"delete_stream\");' class='toolbox__menu__link'><div class='toolbox__menu__item'>";
        content += "&nbsp;&nbsp;Delete Streams&nbsp;&nbsp;</div></a>"; // Item
    content += "<a href='javascript:manageMode(\"delete_scenario\");' class='toolbox__menu__link'><div class='toolbox__menu__item'>";
        content += "&nbsp;&nbsp;Delete Scenarios&nbsp;&nbsp;</div></a>"; // Item

    content += "<br>";
    content += "&nbsp;&nbsp;DOWNLOADS<br>";
    content += "<a target='_blank' href=" + StreamAutomator + " class='toolbox__menu__link'><div class='toolbox__menu__item'>";
        content += "&nbsp;&nbsp;Stream Automator&nbsp;&nbsp;</div></a>"; // Item
    content += "<a target='_blank' href=" + RSCart + " class='toolbox__menu__link'><div class='toolbox__menu__item'>";
        content += "&nbsp;&nbsp;Relief Systems C.A.R.T.&nbsp;&nbsp;</div></a>"; // Item
    content += "<a target='_blank' href=" + MassReportTool + " class='toolbox__menu__link'><div class='toolbox__menu__item'>";
        content += "&nbsp;&nbsp;Mass Report Tool&nbsp;&nbsp;</div></a>"; // Item
    content += "<a target='_blank' href=" + PPMTool + " class='toolbox__menu__link'><div class='toolbox__menu__item'>";
        content += "&nbsp;&nbsp;PPM Transfer Tool&nbsp;&nbsp;</div></a><br>"; // Item
    //content += "<a target='_blank' href=" + ProvManual + " class='toolbox__menu__link'><div class='toolbox__menu__item'>";
    //    content += "&nbsp;&nbsp;Toolbox Manual&nbsp;&nbsp;</div></a><br>"; // Item
        
    content += "<hr size='1'><p class='toolbox__menu__support'>&nbsp;&nbsp;Copyright 2025<br>";
    content += "&nbsp;&nbsp;<a href=" + prov + " target='_blank' style='COLOR: white; TEXT-DECORATION: none;'>Provenance Consulting</a><br>";
    content += "&nbsp;&nbsp;For support please contact support at<br>";
    content += "&nbsp;&nbsp;<a href='mailto:helpdesk@trinityconsultants.com?Subject=Provenance%20Relief%20System%20Toolbox%20Support'>helpdesk@trinityconsultants.com</a></p>";
    
    content += "</div>";
    // -------------------------------------------------------------------

    // Attach toolbox content to element and append to HTML doc
    el.innerHTML = content;
    Body.appendChild(el);
    //console.log('toolbox created!');

    // Functions associated with toolbox
    var interval = window.setInterval(function() {
        if (typeof jQuery == 'function') {
            $('#sidepanel').css('visibility', 'visible');

            $('.toolbox__menu__logo').click(function () { 
                $('.toolbox').toggleClass("toolbox--hover", 100);
                $('.toolbox__menu__logo').toggleClass("toolbox__menu__logo--show", 100);
                $('.toolbox__menu--show').scrollTop(0);
                $('.toolbox__menu').toggleClass("toolbox__menu--show");
            });

            $('.toolbox__menu__item').click(function () { 
                $('.toolbox').toggleClass("toolbox--hover", 100);
                $('.toolbox__menu__logo').toggleClass("toolbox__menu__logo--show", 100);
                $('.toolbox__menu--show').scrollTop(0);
                $('.toolbox__menu').toggleClass("toolbox__menu--show");
            });

            $('.toolbox__menu__item').hover(function () { 
                $(this).toggleClass("toolbox__menu__item--hover");
            });

            $('.toolbox__menu__item_nohide').hover(function () { 
                $(this).toggleClass("toolbox__menu__item--hover");
            });
            
            $(document).mouseup(function (e) {
                var container = $('#sidepanel');
            
                if (!container.is(e.target) // if the target of the click isn't the container...
                    && container.has(e.target).length === 0) // ... nor a descendant of the container
                {
                    $('.toolbox').removeClass("toolbox--hover", 100);
                    $('.toolbox__menu__logo').removeClass("toolbox__menu__logo--show", 100);
                    $('.toolbox__menu--show').scrollTop(0);
                    $('.toolbox__menu').removeClass("toolbox__menu--show");
                }
            });
            
            window.clearInterval(interval);
        }
    }, 200);
} 

//showSidePanel();

// --------------------------------------------------------------------------------
// ---------------------------- EXPERIMENTAL FUNCTIONS ----------------------------
// --------------------------------------------------------------------------------

function manageMode(mMode) {
    
    // change mode if no other modes are enabled
    if (mode == 'default') {
        switch(mMode) {
            case 'piping_short':
                if (currentURL.match("pipefit\/batchedit") === null) {
                    alert('Pipe entry mode only works on "Edit Outlet/Inlet Piping & Fittings" page.');
                    return;
                }
                
                // create and show mode info
                DropStatus('pipe');
                ProgressBar();
                
                // hide/disable other parameters
                $('input').prop('readonly', true);
                $('input[type="Checkbox"]').attr('hidden', 'true');
                $('input').css('background-color', 'rgb(246, 246, 246)');
                $('select').not('[name*="UIM_Widget_1_Type"]').attr('hidden','true');
                $('form a').click(function(e) { e.preventDefault();});
                $('form a').css("color","gray");
                $('area').click(function(e) { e.preventDefault();});
                
                // get current pipe fitting values
                getFittings();
                
                // change mode and functions
                mode = 'piping_short';
                changeMode();
                
                break;
                
            case 'piping_long':
                if (currentURL.match("pipefit\/batchedit") === null) {
                    alert('Pipe entry mode only works on "Edit Outlet/Inlet Piping & Fittings" page.');
                    return;
                }
                
                // create and show mode info
                DropStatus('pipe_long');
                ProgressBar();
                
                // hide/disable other parameters
                $('input').prop('readonly', true);
                $('input[type="Checkbox"]').attr('hidden', 'true');
                $('input').css('background-color', 'rgb(246, 246, 246)');
                $('select').not('[name*="UIM_Widget_1_Type"]').attr('hidden','true');
                $('form a').click(function(e) { e.preventDefault();});
                $('form a').css("color","gray");
                $('area').click(function(e) { e.preventDefault();});
                
                // get current pipe fitting values
                getDBValues();
                
                // change mode and functions
                mode = 'piping_long';
                changeMode();
                
                break;
                
            case 'delete_pipe':
                if (currentURL.match("equip\/piping") === null) {
                    alert('Delete mode only works on "Piping & Fittings" page.');
                    return;
                }
                
                mode = 'delete_pipe';
                DropStatus('delete_pipe');
                ProgressBar();
                changeMode();
    
                deleteAlgorithm('sub');
                
                break;
                
            case 'delete_stream':
                if (currentURL.match("relief\/view") === null) {
                    alert('This function only works in the "Protected System" page.');
                    return;
                }
                
                mode = 'stream';
                DropStatus('delete_stream');
                ProgressBar();
                changeMode();
            
                break;
				            
			case 'delete_scenario':
                if (currentURL.match("relief\/view") === null) {
                    alert('This function only works in the "Protected System" page.');
                    return;
                }
                
                mode = 'scenario';
                DropStatus('delete_scenario');
                ProgressBar();
                changeMode();
				
                break;
        }
    // cannot change mode while in another mode
    } else {
        //console.log('Please refresh the page to change/disable the current mode.');
        alert('Please refresh the page to change/disable the current mode.');
    }
}

function deleteAlgorithm(status) {
    if (status == 'sub') {
        $("input[type*='Hidden'][name*='Equip__Delta']").each( function(){
            this.value = parseInt(this.value) - 1;
            ////console.log(this.name + ' ' + this.value);
        });
    }

    if (status == 'add') {
        $("input[type*='Hidden'][name*='Equip__Delta']").each( function(){
            this.value = parseInt(this.value) + 1;
            ////console.log(this.name + ' ' + this.value);
        });
    }
}

function getDBValues() {
    
    pipeFitting.ID_Delta = [];
    pipeFitting.dbName = [];
    pipeFitting.dbValue = [];
    
    // get list of 'select' elements
    var selectElement = document.getElementsByTagName('select');
    
    // loop through each element and push data that matches pipe fitting elements
    for (var i=0; i<selectElement.length; i++) {
        if (selectElement[i].name.match('UIM_Widget_1_Type')) {
            
            // get pipe fitting database ID
            pipeFitting.ID_Delta.push(selectElement[i].name.replace('UIM_Widget_1_Type',''));
            
            // get database delta value for each fitting
            pipeFitting.dbName.push('Form.UIM_Widget_PipeFit' + pipeFitting.ID_Delta[pipeFitting.ID_Delta.length - 1] + '__Delta');
            pipeFitting.dbValue.push(eval(pipeFitting.dbName[pipeFitting.dbName.length - 1]).value);
            
        }
    }
    
}

// Step 1 of Pipe Input Mode ----------------
function getFittings() {
    
    var fitting_count =  0;
    pipeFitting.ID_Delta = [];
    pipeFitting.name = [];
    pipeFitting.fittingID = [];
    pipeFitting.seqNo = [];
    pipeFitting.isBlank = [];
    pipeFitting.isContraction = [];
    pipeFitting.isMissingInfo = [];
    pipeFitting.isPerturbed = [];
    pipeFitting.dbName = [];
    pipeFitting.dbValue = [];
    pipeFitting.isAnomaly = [];
    
    // get list of 'select' elements
    var selectElement = document.getElementsByTagName('select');
    
    // loop through each element and push data that matches pipe fitting elements
    for (var i=0; i<selectElement.length; i++) {
        if (selectElement[i].name.match('UIM_Widget_1_Type')) {
            fitting_count ++;
            pipeFitting.name.push(selectElement[i].name);
            pipeFitting.ID_Delta.push(selectElement[i].name.replace('UIM_Widget_1_Type',''));
            pipeFitting.fittingID.push(selectElement[i].value);
            pipeFitting.seqNo.push(fitting_count);
            
            // get isBlank value for each fitting
            if (selectElement[i].value === '') { pipeFitting.isBlank.push(true); } else { pipeFitting.isBlank.push(false); }
            
            // get isContraction value for each fitting
            if (selectElement[i].value == '005039293' ||
                selectElement[i].value == '005106256' ||
                selectElement[i].value == '005039294' ||
                selectElement[i].value == '005106258') { pipeFitting.isContraction.push(true); } else { pipeFitting.isContraction.push(false); }
                
            // predefine isMissingInfo and isPerturbed value for each fitting
            pipeFitting.isMissingInfo.push(false);
            pipeFitting.isPerturbed.push(false);
            pipeFitting.isAnomaly.push(false);
            
            // get database delta value for each fitting
            pipeFitting.dbName.push('Form.UIM_Widget_PipeFit' + pipeFitting.ID_Delta[pipeFitting.ID_Delta.length - 1] + '__Delta');
            pipeFitting.dbValue.push(eval(pipeFitting.dbName[pipeFitting.dbName.length - 1]).value);
            
        }
    }
    
    
    // get fitting sequence # that has missing information
    $('tbody:contains("Pipe Fitting information or calculation is not complete")')
        .closest('tr')
        .prevUntil('input')
        .has('select[name*="UIM_Widget_1_Type"]')
        .children('td:first-child')
        .each(function(i) {
            var seqNo = parseInt($(this).html());
            pipeFitting.isMissingInfo[seqNo - 1] = true;
            ////console.log('missing info for fitting: ' + seqNo);
        }
    );
}
// -----------------------

function dbPrediction(pMode) {
    switch (pMode) {
        case 'piping_short':
            
            // debugging log before
            ////console.log('BEFORE:');
            for (var i=0; i<pipeFitting.dbValue.length; i++) {
                var ii = i + 1;
                //console.log('Fitting ' + ii + ' - ' + pipeFitting.dbName[i] + ': ' + pipeFitting.dbValue[i]);
            }
            
            // Step 2 of Pipe Input Mode -----------------------------
            
            // get ID delta from action argument in serialized data
            actionArgID = Form.UIM_Widget_0_ActionArg.value.substring(0, Form.UIM_Widget_0_ActionArg.value.indexOf(":"));
            
            // get what fitting is being changed and from what
            var changingFittingSeqNo;
            var changeFrom;
            for (i=0; i<pipeFitting.ID_Delta.length; i++) {
                if ( pipeFitting.ID_Delta[i] == actionArgID ) {
                    changingFittingSeqNo = i + 1;
                    changeFrom = pipeFitting.fittingID[i];
                }
            }
            
            // get what fitting is being changed to
            var changeTo = Form.UIM_Widget_0_ActionArg.value.substring(Form.UIM_Widget_0_ActionArg.value.indexOf(":") + 1);
            pipeFitting.fittingID[changingFittingSeqNo - 1] = changeTo;
    
            // determine if isPerturbed needs to get updated for fittings below the changed fitting
            var checkPerturbed = false;
            if (changeTo == '005039293' ||
                changeTo == '005106256' ||
                changeTo == '005039294' ||
                changeTo == '005106258' ||
                changeFrom == '005039293' ||
                changeFrom == '005106256' ||
                changeFrom == '005039294' ||
                changeFrom == '005106258') { checkPerturbed = true;
                //console.log('found change to/from contraction... search enabled');
                }
            
            // change isPerturbed value for each fitting if check enabled
            if (checkPerturbed) {
                for (i=0; i<pipeFitting.isPerturbed.length; i++) {
                    if (pipeFitting.seqNo[i] > changingFittingSeqNo) { pipeFitting.isPerturbed[i] = true; }
                }
            }
            
            // check if there was an anomaly after an error occurred
            if ( errCounter > errRefresh ) {
                errRefresh = errCounter;
                for (i=0; i<pipeFitting.dbValue.length; i++) {
                    if (parseInt(pipeFitting.dbValue[i]) == parseInt(errTrackerDB[i]) + 1) {
                        pipeFitting.isAnomaly[i] = true;
                    } else if (parseInt(pipeFitting.dbValue[i]) == parseInt(errTrackerDB[i]) - 1 && pipeFitting.isAnomaly[i] === true) {
                        pipeFitting.isAnomaly[i] = false;
                    }
                }
            }
            // -----------------
            
            // Step 3 of Pipe Input Mode -- make prediction based on results above ----------------
            for (i=0; i<pipeFitting.seqNo.length; i++) {
                if (pipeFitting.isBlank[i] === true ||
                    pipeFitting.seqNo[i] == changingFittingSeqNo ||
                    pipeFitting.isMissingInfo[i] === true ||
                    pipeFitting.isPerturbed[i] === true ||
                    pipeFitting.isAnomaly[i] === true) {
                        var delta = eval(pipeFitting.dbName[i]);
                        delta.value = parseInt(delta.value) + 1;
                        pipeFitting.dbValue[i] = delta.value;
                    }
                //console.log(i + ': ' + pipeFitting.fittingID[i] + ' - B:' + pipeFitting.isBlank[i] + ', C:' + changingFittingSeqNo + ', M:' + pipeFitting.isMissingInfo[i] + ', P:' + pipeFitting.isPerturbed[i]);
            }
            
            // reset isPerturbed values
            for (i=0; i<pipeFitting.isPerturbed.length; i++) {
                pipeFitting.isPerturbed[i] = false;
            }
            // -------------------
            
            // debugging log end
            //console.log('AFTER:');
            for (i=0; i<pipeFitting.dbValue.length; i++) {
                var ii = i + 1;
                //console.log('Fitting ' + ii + ' - ' + pipeFitting.dbName[i] + ': ' + pipeFitting.dbValue[i]);
            }
            
            // Step 4 of Pipe Input Mode -- update values for remaining pipe fittings ----------------
            // Stage 1 - Fitting is changed from value to blank
            if (changeFrom != '' && changeTo == '') {
                pipeFitting.isBlank[changingFittingSeqNo - 1] = true;
                pipeFitting.isMissingInfo[changingFittingSeqNo - 1] = false;
            }
            
            // Stage 2 - Fitting is changed from value to value
            if (changeFrom != '' && changeTo != '') {
                //console.log(changeFrom + " to " + changeTo);
                // Update if previously had missing info
                if (pipeFitting.isMissingInfo[changingFittingSeqNo - 1] == true) {
                    if (eval('Form.UIM_Widget_PipeFit' + pipeFitting.ID_Delta[changingFittingSeqNo - 1] + '_ScheduleI').value == 'Given') {
                        if (eval('Form.UIM_Widget_1_DiIn' + pipeFitting.ID_Delta[changingFittingSeqNo - 1] + '_D_i_in_E').value == '') {
                            pipeFitting.isMissingInfo[changingFittingSeqNo - 1] = true;
                        } else {
                            pipeFitting.isMissingInfo[changingFittingSeqNo - 1] = false;
                        }
                    } else {
                        pipeFitting.isMissingInfo[changingFittingSeqNo - 1] = false;
                    }
                }
                
                // Update if changing to hot value
                if (changeTo == '005054876' ||
                    changeTo == '005106260' ||
                    changeTo == '005039239') {
                    pipeFitting.isMissingInfo[changingFittingSeqNo - 1] = true;
                }
                
                // Update if changing to contraction fitting
                if (((changeFrom == '005039293' ||
                    changeFrom == '005106256') &&
                    (changeTo == '005039294' ||
                    changeTo == '005106258')) ||
                    ((changeTo == '005039293' ||
                    changeTo == '005106256') &&
                    (changeFrom == '005039294' ||
                    changeFrom == '005106258'))) {
                    pipeFitting.isMissingInfo[changingFittingSeqNo - 1] = true;
                }
            }
            
            // Stage 3 - Fitting is changed from blank to value
            if (changeFrom == '' && changeTo != '') {
                pipeFitting.isBlank[changingFittingSeqNo - 1] = false;
                
                // check if previous fitting had missing information
                if (changingFittingSeqNo - 1 != 0) {
                    if (pipeFitting.isMissingInfo[changingFittingSeqNo - 2] == true) {
                        if (eval('Form.UIM_Widget_PipeFit' + pipeFitting.ID_Delta[changingFittingSeqNo - 2] + '_ScheduleI') == null) {
                            pipeFitting.isMissingInfo[changingFittingSeqNo - 1] = true;
                        } else if (eval('Form.UIM_Widget_PipeFit' + pipeFitting.ID_Delta[changingFittingSeqNo - 2] + '_ScheduleI').value == 'Given') {
                            if (eval('Form.UIM_Widget_1_DiIn' + pipeFitting.ID_Delta[changingFittingSeqNo - 2] + '_D_i_in_E').value == '') {
                                pipeFitting.isMissingInfo[changingFittingSeqNo - 1] = true;
                            } else {
                                pipeFitting.isMissingInfo[changingFittingSeqNo - 1] = false;
                            }
                        } else {
                        pipeFitting.isMissingInfo[changingFittingSeqNo - 1] = false;
                        }
                    }
                }
                
                // check if all fittings are blank
                var allBlank = true;
                for (var i=0; i<pipeFitting.isBlank.length; i++) {
                    if (pipeFitting.isBlank[i] == false) {allBlank = false;}
                }
                
                if (allBlank) { pipeFitting.isMissingInfo[changingFittingSeqNo - 1] = true; }
                
                // check if this is the first fitting or has no changes
                if (changingFittingSeqNo - 1 == 0 ||
                    parseInt(pipeFitting.dbValue[changingFittingSeqNo - 1]) <= 2) {
                    pipeFitting.isMissingInfo[changingFittingSeqNo - 1] = true;
                }
                
                // check if changing to hot value or contraction fitting
                if (changeTo == '005054876' ||
                    changeTo == '005106260' ||
                    changeTo == '005039293' ||
                    changeTo == '005106256' ||
                    changeTo == '005039294' ||
                    changeTo == '005106258') {
                    pipeFitting.isMissingInfo[changingFittingSeqNo - 1] = true;
                }

            }
            
            break;
    }
}

function changeMode() {
    
    // Redefine UIM_Post function for most modes except default
    UIM_Post = function(action, arg, ask, opts) {
        UIM_OnPost1();
        if (action === null || typeof action === 'undefined') {action = '';}
        if (arg === null || typeof arg === 'undefined') {arg = '';}
        if (ask === null || typeof ask === 'undefined') {ask = '';}
        if (opts === null || typeof opts === 'undefined') {opts = '';}

        Form.UIM_Widget_0_Action.value = action;
        Form.UIM_Widget_0_ActionArg.value = arg;
        Form.UIM_Widget_0_ActionOpts.value = opts;
        Form.UIM_Widget_0_ScrollX.value = window.pageXOffset;
        Form.UIM_Widget_0_ScrollY.value = window.pageYOffset;
        Form.UIM_Widget_0_TZ.value = (new Date()).getTimezoneOffset();

        $('form').submit();  // Call new form submit function to queue AJAX request
    };
    
    switch (mode) {

//////////////////////////////////////
        // PIPING MODE FUNCTION
        case 'piping_short':

            
            // Redefine FittingType Function
            FittingType = function(id, seq, old) {
                var n = 'UIM_Widget_1_Type' + id;
                var m = eval('Form.' + n);
                var fittingId = m[m.selectedIndex].value;
                UIM_Post('SetFittingType', id + ':' + fittingId);
            };
            
            // Create new form submit function to: call to database prediction function, serialize form data, queue AJAX requests, create loading bar for queued requests, error tracking
            $('form').submit(function(ev) {
                
                // before sending data to queue
                serializedArray.push($('form').serialize());
                dbPrediction(mode);

                // send form data to queue
                $('.post__Go').queue(function( next ) {
                    
                    // post start time
                    var t0 = performance.now();
                    
                    // show loading bar when running items in queue
                    $('.post__Go').addClass('post__Stop');
                    $('#postSignal').html('LOADING...');
                    
                    // ajax setup
                    $.ajax({
                        type: $('form').attr('method'),
                        url: $('form').attr('action'),
                        data: serializedArray[queueN],
                        success: function(data) {
                            
                            if (data.toString().match("Inbound")) {
                                
                                for (i=0; i<pipeFitting.dbName.length; i++) {
                                    var curSerial = seralizedArray[queueN];
                                    var curDBValPos1 = curSerial.indexOf(pipeFitting.dbName[i]) + 33;
                                    var curDBValPos2 = curSerial.indexOf("&", curDBValPos1);
                                    var curDBVal = curSerial.substring(curDBValPos1, curDBValPos2);
                                    errTrackerDB[i] = curDBVal;
                                }
                                
                                $('.post__Go').clearQueue();
                                queueN = 0;
                                serializedArray = [];
                                //errTrackerDB = pipeFitting.dbValue;
                                pipeFitting = {};
                                
                                showLoadingScreen();
                                $('input[type="text"], input[type="checkbox"], select').prop("disabled", true);
                                $('form').fadeTo("slow", 0.5);
                                
                                $.get(window.location.href, function(rdata) {
                                    retData = rdata;
                                    
                                    $('body').fadeOut('fast', function() {
                                        $('body').html(rdata.substring(rdata.indexOf("<NOSCRIPT>"), rdata.indexOf("</BODY>\n"))).fadeTo('slow', 1, function() {
                                            mode = 'default';
                                            if (errCounter < 3) {
                                                manageMode('piping_short');
                                            } else {
                                                if (confirm('Would you like to enter Pipe Input (Safe Mode)? In Safe Mode you are almost likely to have error free posting, but requires at least double the time to complete.')) {
                                                    manageMode('piping_long');
                                                } else {
                                                    manageMode('piping_short');
                                                }
                                            }
                                        });
                                        
                                        showSidePanel();
                                    });
                                });
                                
                                errCounter = errCounter + 1;
                                return;
                                //alert("An error occurred in iPRSM (i.e. trouble message). Please refresh the page and rerun Pipe Entry mode to continue.");
                            }
                        
                            // complete, go to next queue
                            $('.post__Go').removeClass('post__Stop');
                            $('#postSignal').html('READY');
                            queueN = queueN + 1;
                            
                            //post end time and display
                            var t1 = performance.now();
                            t2 = t2 + ((t1 - t0) / 1000);
                            console.log('Execution time: ' + ((t1 - t0) / 1000).toFixed(2) + ' seconds');
                            
                            // go to next queue item
                            next();
                        }
                    });
                    ev.preventDefault();
                });
            });
            break;

        // PIPING MODE LONG FUNCTION
        case 'piping_long':

            
            // Redefine FittingType Function
            FittingType = function(id, seq, old) {
                var n = 'UIM_Widget_1_Type' + id;
                var m = eval('Form.' + n);
                var fittingId = m[m.selectedIndex].value;
                UIM_Post('SetFittingType', id + ':' + fittingId);
            };
            
            // Create new form submit function to: serialize form data, queue AJAX requests, create loading bar for queued requests, error tracking
            $('form').submit(function(ev) {
                
                ActionArgTracker.push(Form.UIM_Widget_0_ActionArg.value);

                // send form data to queue
                $('.post__Go').queue(function( next ) {
                    Form.UIM_Widget_0_ActionArg.value = ActionArgTracker[queueN];
                    serializedArray.push($('form').serialize());
                
                    // post start time
                    var t0 = performance.now();
                    
                    // show loading bar when running items in queue
                    $('.post__Go').addClass('post__Stop');
                    $('#postSignal').html('LOADING...');
                    
                    // ajax setup
                    $.ajax({
                        type: $('form').attr('method'),
                        url: $('form').attr('action'),
                        data: serializedArray[queueN],
                        dataType: "text",
                        success: function(data) {
                            
                            if (data.toString().match("Inbound")) {
                                $('.post__Go').clearQueue();
                                alert("An error occurred in iPRSM (i.e. trouble message). Please refresh the page and rerun Pipe Entry mode to continue.");
                            }
                            
                            // get reloaded page request
                            $.get(window.location.href, function(rdata) {
                                retData = rdata;
                                
                                var a=0;
                                var b=0;
                                var c=true;
                                
                                // find JavaScript code
                                do {
                                        b = rdata.indexOf("<SCRIPT LANGUAGE", a);
                                        
                                        if (b < a) {
                                            c = false;
                                        } else {
                                            a = b + 1;
                                        }
                                } while (c);
                                a = a - 1;
                                b = rdata.indexOf("</SCRIPT>", a);
                                
                                // execute JavaScript
                                eval(rdata.substring(a+59,b));
                                
                                // complete, go to next queue
                                $('.post__Go').removeClass('post__Stop');
                                $('#postSignal').html('READY');
                                queueN = queueN + 1;
                                
                                //post end time and display
                                var t1 = performance.now();
                                t2 = t2 + ((t1 - t0) / 1000);
                                console.log('Execution time: ' + ((t1 - t0) / 1000).toFixed(2) + ' seconds');
                                
                                // go to next queue item
                                next();
                            });
                            
                        }
                    });
                    
                    // prevent default event
                    ev.preventDefault();
                });
            });
            break;

        // PIPE FITTING DELETE MODE FUNCTION
        case 'delete_pipe':
            
            $('form').submit(function(ev) {
                if (Form.UIM_Widget_0_Action.value == 'Delete') {
                    var PipeFitId = Form.UIM_Widget_0_ActionArg.value;
                    $("a[href*='Delete'][href*=" + PipeFitId + "]").parent().parent().remove();
                    //console.log('queued: ' + PipeFitId);
                }

                // before sending data to queue
                deleteAlgorithm('add');
                serializedArray.push($('form').serialize());

                // send data to queue
                $('.post__Go').queue(function( next ) {
                    
                    // post start time
                    var t0 = performance.now();
                    
                    $('.post__Go').addClass('post__Stop');
                    $('#postSignal').html('LOADING...');
                    //console.log('deleting: ' + serializedArray[queueN].substr(serializedArray[queueN].indexOf('ActionArg') + 10, 9));
                    $.ajax({
                        type: $('form').attr('method'),
                        url: $('form').attr('action'),
                        data: serializedArray[queueN],
                        success: function(data) {
                            if (data.toString().match("Inbound")) {
                                //alert('An error occurred in iPRSM (i.e. trouble message). Please refresh the page and rerun Pipe Entry mode to continue.');
                                //console.log(deleteErr + 1 + ': Failed');
                                if (deleteErr == 3) {
                                    $('.post__Go').clearQueue();
                                    queueN = 0;
                                    serializedArray = [];
                                    
                                    showLoadingScreen();
                                    $('input[type="text"], input[type="checkbox"], select').prop("disabled", true);
                                    $('form').fadeTo("slow", 0.5);
                                    
                                    $.get(window.location.href, function(rdata) {
                                        retData = rdata;
                                        
                                        $('body').fadeOut('fast', function() {
                                            $('body').html(rdata.substring(rdata.indexOf("<NOSCRIPT>"), rdata.indexOf("</BODY>\n"))).fadeTo('slow', 1, function() {
                                                mode = 'default';
                                                manageMode('delete_pipe');
                                            });
                                            
                                            showSidePanel();
                                        });
                                    });
                                    return;
                                    //alert("An error occurred in iPRSM (i.e. trouble message). Please refresh the page and rerun Pipe Entry mode to continue.");
                                } else {
                                    deleteErr = deleteErr + 1;
                                    deleteAlgorithm('sub');
                                    $('form').submit();
                                }
                            }
                            
                            // complete, go to next queue
                            $('.post__Go').removeClass('post__Stop');
                            $('#postSignal').html('READY');
                            queueN = queueN + 1;
                            
                            //post end time and display
                            var t1 = performance.now();
                            console.log('Execution time: ' + ((t1 - t0) / 1000).toFixed(2) + ' seconds');
                            
                            // go to next queue item
                            next();
                        }
                    });
                    ev.preventDefault();
                    // next();
                });
            });
            break;

        // DELETE STREAM MODE FUNCTION
        case 'stream':

            $('form').submit(function(ev) {
                if (Form.UIM_Widget_0_Action.value == 'DeleteStream') {
                    var StreamId = Form.UIM_Widget_0_ActionArg.value;
                    $("a[href*='DeleteStream'][href*=" + StreamId + "]").parent().parent().remove();
                    //console.log('deleted: ' + StreamId);
                }
                
                $.ajax({
                        type: $('form').attr('method'),
                        url: $('form').attr('action'),
                        data: $('form').serialize(),
                        success: function(data) {
                            if (data.toString().match("Inbound")) {
                                alert("You clicked too fast! Stream Id " + StreamID + " could not be deleted. Continue with the rest and refresh the page to delete the failed attempts.");
                            }
                        }
                    });
                ev.preventDefault();
            });
            break;
			
		// DELETE SCENARIO MODE FUNCTION
        case 'scenario':
			
			// Create new form submit function to: serialize form data, queue AJAX requests, create loading bar for queued requests, error tracking
            $('form').submit(function(ev) {
                if (Form.UIM_Widget_0_Action.value == 'DeleteScenario') {
                    var ScenarioID = Form.UIM_Widget_0_ActionArg.value;
                    $("a[href*='DeleteScenario'][href*=" + ScenarioID + "]").parent().parent().remove();
                }
				
                ActionArgTracker.push(Form.UIM_Widget_0_ActionArg.value);

                // send form data to queue
                $('.post__Go').queue(function( next ) {
                    Form.UIM_Widget_0_ActionArg.value = ActionArgTracker[queueN];
                    serializedArray.push($('form').serialize());
                
                    // post start time
                    var t0 = performance.now();
                    
                    // show loading bar when running items in queue
                    $('.post__Go').addClass('post__Stop');
                    $('#postSignal').html('LOADING...');
                    
                    // ajax setup
                    $.ajax({
                        type: $('form').attr('method'),
                        url: $('form').attr('action'),
                        data: serializedArray[queueN],
                        dataType: "text",
                        success: function(data) {
                            
                            if (data.toString().match("Inbound")) {
                                $('.post__Go').clearQueue();
                                alert("An error occurred in iPRSM (i.e. trouble message). Please refresh the page and rerun Pipe Entry mode to continue.");
                            }
                            
                            // get reloaded page request
                            $.get(window.location.href, function(rdata) {
                                retData = rdata;
                                
                                var a=0;
                                var b=0;
                                var c=true;
                                
                                // find JavaScript code
                                do {
                                        b = rdata.indexOf("<SCRIPT LANGUAGE", a);
                                        
                                        if (b < a) {
                                            c = false;
                                        } else {
                                            a = b + 1;
                                        }
                                } while (c);
                                a = a - 1;
                                b = rdata.indexOf("</SCRIPT>", a);
                                
                                // execute JavaScript
                                eval(rdata.substring(a+59,b));
                                
                                // complete, go to next queue
                                $('.post__Go').removeClass('post__Stop');
                                $('#postSignal').html('READY');
                                queueN = queueN + 1;
                                
                                //post end time and display
                                var t1 = performance.now();
                                t2 = t2 + ((t1 - t0) / 1000);
                                console.log('Execution time: ' + ((t1 - t0) / 1000).toFixed(2) + ' seconds');
                                
                                // go to next queue item
                                next();
                            });
                            
                        }
                    });
                    
                    // prevent default event
                    ev.preventDefault();
                });
            });
            break;

            // Default (original) form submit
        default:
        
            UIM_Post = function(action, arg, ask, opts) {
                UIM_OnPost1();
                if (action === null || typeof action === 'undefined') {
                    action = '';
                }
                if (arg === null || typeof arg === 'undefined') {
                    arg = '';
                }
                if (ask === null || typeof ask === 'undefined') {
                    ask = '';
                }
                if (opts === null || typeof opts === 'undefined') {
                    opts = '';
                }

                Form.UIM_Widget_0_Action.value = action;
                Form.UIM_Widget_0_ActionArg.value = arg;
                Form.UIM_Widget_0_ActionOpts.value = opts;
                Form.UIM_Widget_0_ScrollX.value = window.pageXOffset;
                Form.UIM_Widget_0_ScrollY.value = window.pageYOffset;
                Form.UIM_Widget_0_TZ.value = (new Date()).getTimezoneOffset();

                var w = window.open('', 'POST_14240519975698_267_1424098222', 'width=132,height=110,resizable,scrollbars,screenX=' + window.screenX + ',screenY=' + window.screenY);
                if (w === null) {
                    alert('You must enable pop-up windows.');
                    return;
                }
                w.document.writeln('<HTML><HEAD><TITLE>iPRSM / Phillips 66</TITLE></HEAD><BODY BGCOLOR=F6F6F6><IMG SRC=/iprsm/phillips/image/site/logo/logo-small.gif  BORDER=0 WIDTH=48 HEIGHT=25><BR><CENTER><FONT SIZE=4><FONT FACE="Sans-Serif">Posting...<SUP>&nbsp;</SUP></FONT></FONT><BR><FONT SIZE=2><I>Please&nbsp;Stand<FONT SIZE=+1><S</supbsp;</SUP></FONT>By</I></FONT></CENTER></BODY></HTML>');
                w.document.close();
                Form.target = 'POST_14240519975698_267_1424098222';
                Form.submit();
            };
    }
}

function showLoadingScreen() {
    var htmlContent = Body.innerHTML;
    var newHTML = '<div style="POSITION: fixed; Z-INDEX: 1003; TOP: 0; LEFT: 0; HEIGHT: 100%; WIDTH: 100%; BACKGROUND: rgba(255, 255, 255, 0.8); TEXT-ALIGN: center; FONT-SIZE: 1.3em; FONT-FAMILY: Arial, sans-serif;"><span style="BACKGROUND-COLOR: white;">An error occurred in iPRSM! This error could have occurred due to various reasons. Please wait while the page refreshes.<br>You may continue where you left off once the page refreshes.</span></div>';
    $('body').html(newHTML + htmlContent);
}

// --------------------------------------------------------------------------
// ------------------------ WORKING FUNCTIONS -------------------------------
// --------------------------------------------------------------------------

function closeSidePanel() {
    $('#sidepanel').slideUp('fast', function() {
        $(this).remove();
    });
}

function enablePipeSchEdit() {
    if (mode == 'piping_short') {
        alert('This function cannot be used while in Pipe Input Mode.');
        return;
    }
    
    if (currentURL.match("pipefit\/batchedit") === null) {
        alert('Pipe entry mode only works on "Edit Outlet/Inlet Piping & Fittings" page.');
        return;
    }
    
    var Inputs = Form.getElementsByTagName('input');
    for (i = 0; i < Inputs.length; i++) {
        Inputs[i].readOnly = false;
        Inputs[i].style.backgroundColor = 'white';
    }
}

function changeFrictionFactors() {
    if (currentURL.match("pipefit\/batchedit") === null) {
        alert('Pipe entry mode only works on "Edit Outlet/Inlet Piping & Fittings" page.');
        return;
    }
    
    var Inputs = document.getElementsByTagName("SELECT");
    for(i=0; i<Inputs.length; i++) {
        if(Inputs[i].name.match("UIM_Widget_1_fSelect")) {
            Inputs[i].selectedIndex =0;
        }
    }
}

function changeRoughness() {
    if (currentURL.match("pipefit\/batchedit") === null) {
        alert('Pipe entry mode only works on "Edit Outlet/Inlet Piping & Fittings" page.');
        return;
    }
    
    var Inputs=document.getElementsByTagName("SELECT");
    for(i=0; i<Inputs.length; i++) {
        if(Inputs[i].name.match("UIM_Widget_1_EpsilonSelect")) {
            Inputs[i].selectedIndex =3;
        }
    }
}

function expandingNotes(cols) {
    var nCols = cols || 125;
    var NOTES = Form.getElementsByTagName("TEXTAREA");
    for (i = 0; i < NOTES.length; i++) {
        nl = 0;
        text = NOTES[i].value;
        for (j = 0; j < text.length; j++) {
            if (text.substr(j, 1) == "\n") {
                nl++;

            }

        }
        lines = text.split(/\r\n|\r|\n/);
        for (k = 0; k < lines.length; k++) {
            if (lines[k].length / (nCols) >= 1) {
                nl = nl + Math.floor(lines[k].length / (nCols));
            }
        }
        NOTES[i].rows = nl + 3;
        NOTES[i].cols = nCols;
    }
}

function DropStatus(status) {
    // Check if status dropdown box is already open
    if (document.getElementById("dropStatus") !== null) {
        $('.dropStatus--hidden').toggleClass('dropStatus--show',100);
    } else {
        var el = document.createElement('div');
        el.id = 'dropStatus';
        el.className = 'dropStatus--hidden';
        
        Body.appendChild(el);
        //console.log('status box created!');
        $('.dropStatus--hidden').toggleClass('dropStatus--show',100);
    }
    
    switch (status) {
        case 'pipe':
            $('#dropStatus').html('Pipe Entry');
            break;
            
        case 'pipe_long':
            $('#dropStatus').html('Pipe Entry (Safe Mode)');
            break;
            
        case 'delete_pipe':
            $('#dropStatus').html('Delete Pipe Fittings');
            break;
            
        case 'delete_stream':
            $('#dropStatus').html('Delete Fluid Streams');
            break; 
			
        case 'delete_scenario':
            $('#dropStatus').html('Delete Scenarios');
            break;
            
        case 'default':
            $('#dropStatus').html('');
    }
}

function ProgressBar() {
    
    // Check if progress bar is already open
    if (document.getElementById("postSignal") !== null) {
        $('.post__Go').toggleClass('post__Go--show',100);
    } else {
        var el = document.createElement('div');
        el.id = 'postSignal';
        el.className = 'post__Go';
        
        Body.appendChild(el);
        //console.log('progress bar created!');
        $('.post__Go').html('READY');
        $('.post__Go').toggleClass('post__Go--show',100);
    }
}











































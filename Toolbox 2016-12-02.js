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
var toolboxCSS = 'https://cdn.jsdelivr.net/gh/sh48846/Tools@579bc82/Toolbox.min.css';

// image locations
// Array of images with their weights (probabilities)
const logos = [
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Photo_of_a_kitten.jpg/1024px-Photo_of_a_kitten.jpg", weight: 10 },
    { src: "https://provpsm.com/wp-content/uploads/2020/12/Trinity_Provenance_Logo_RGB.png", weight: 100 },
    { src: "data:image/jpeg;base64,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", weight: 0 }
];
// Function to pick a random image src based on weight
function pickWeightedLogo() {
    const totalWeight = logos.reduce((sum, logo) => sum + logo.weight, 0);
    let random = Math.random() * totalWeight;
    for (let i = 0; i < logos.length; i++) {
        if (random < logos[i].weight) {
            return logos[i].src; // return the image src
        }
        random -= logos[i].weight;
    }
    // Fallback
    return logos[0].src;
}
// Set provLogo to a random image src
var provLogo = pickWeightedLogo();
var cursor = 'https://github.com/sh48846/Tools/blob/main/johnpork.png?raw=true';

//var provLogo = 'https://cdn.jsdelivr.net/gh/sh48846/Tools@main/Transparent%20Logo%20-%204K%20Remaster%20202508131254pm.png';
//var provLogo = 'data:image/jpeg;base64,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';


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
var reloadCSS = function() {
  $('#css').replaceWith('<link id="css" rel="stylesheet" href="tbcss/main.css?t=' + Date.now() + '"></link>');
};

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
    
 	content += "<hr size='1'><p class='toolbox__menu__support' style='color:white;'>&nbsp;&nbsp;Copyright 2025<br>";
    content += "&nbsp;&nbsp;<a href=" + prov + " target='_blank' style='COLOR: lightblue; TEXT-DECORATION: none;'>Provenance Consulting</a><br>";
	content += "&nbsp;&nbsp;<span style='color:white;'>For support, please contact IT at</span><br>";
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
			
			$('.toolbox__menu__logo img').css('cursor', 'url(' + cursor + '), auto');
		
            $('.toolbox__menu__logo').click(function () { 
				$('.toolbox__menu__logo img').attr('src', pickWeightedLogo());
				
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
                                b = rdata.indexOf("</script>", a);
                                
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
                                b = rdata.indexOf("</script>", a);
                                
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


























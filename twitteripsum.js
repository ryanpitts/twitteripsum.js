/* 
 * Twitter Ipsum generates lorem ipsum placeholder text
 * based on any Twitter user's latest tweets.
 *
 * It requires jQuery. It also updates and mangles some
 * pieces from Fredrik Bridell's Lorem Ipsum Generator
 * (http://bridell.com/loremipsum/)
 *
 * It expects that somewhere in your markup, you'll provide
 * a <div id="ipsum"> or <textarea id="ipsum"> to dump text into
 *
 * If you provide a container with id="tweet-it", it will
 * also dump in a Twitter button with a random quote as text
*/ 

// SET US UP THE CONFIG
// the Twitter username for your ipsum
var twitterUser = "andymboyle"
// how far back in the timeline to go
var tweetCount = 75
// seedWords are the terms you want to be SURE are available in the ipsum
var seedWords = "mom|Southie|Boston|whining|movies|Gen Y|Springsteen|Get Up Kids|cat|not practicing python"
// a seedWeight greater than 1 gives seedWords a higher chance of appearing
var seedWeight = 8;
// groupers will stay attached to the term that follows them
var groupers = "a|an|the|of|and|or|of|in"
// choose the number of paragraphs, and the words in each, for your ipsum
var grafs = "65|30|50"
// if you want, append a credit to the Twitter button's text
var twitterButtonVia = "/via @boyleipsum"

$(document).ready(function(){
    var loremLang = null;
    var loremIpsumText = '';
    var seedList = new Array(seedWeight).join(seedWords+'|');
    var url='https://api.twitter.com/1/statuses/user_timeline.json?screen_name='+twitterUser+'&count='+tweetCount.toString()+'&callback=?';

    $.getJSON(url, function(data) {
        var words = '';
        $.each(data, function(i, tweets) {
           words += tweets.text.toLowerCase() + ' ';
        })
        words = words.replace(/[^a-zA-Z 0-9 '@]+/g,'');
        words = words.replace(/(\bhttp)\w+/g,'');
        words = words.replace(/  /g,' ');
        bits = groupers.split('|');
        for (var i=0;i<bits.length;i++) {
            var newBit = ' '+bits[i]+'~';
            words = words.replace(new RegExp('\\s'+bits[i]+'\\s','gi'),newBit);
        }
        words = words.replace(/ /g,'|');
        words = words.replace(/\|i\|/g,'\|I\|');
        words = words.replace(/~/g,' ');
        words = uniquesOnly(words);
        words += seedList

        loremLang = words.split('|');
        grafSet = grafs.split('|');

        var isTextArea = $("#ipsum").is("textarea")
        for (var i=0;i<grafSet.length;i++) {
            if (isTextArea) {
                loremIpsumText += "<p>"+loremIpsumParagraph(grafSet[i])+"</p>"
            } else {
                loremIpsumText += "<p><span style='font-size: 0;'>&lt;p&gt;</span>"+loremIpsumParagraph(grafSet[i])+"<span style='font-size: 0;'>&lt;/p&gt;</span></p>"
            }
        }
        if (isTextArea) {
            $("#ipsum").val(loremIpsumText);
        } else {
            $("#ipsum").append(loremIpsumText);
        }
        
        var newTweet = '';
        while (newTweet.length == 0 || newTweet.length > 100) {
            var newTweet = loremIpsumParagraph(14);
        }
        var twitterVia = ''
        if (twitterButtonVia != null && twitterButtonVia != undefined) {
            twitterVia = ' '+twitterButtonVia;
        }
        
        var button = '<a href="http://twitter.com/share" class="twitter-share-button" data-url="'+window.location.href+'" data-text="'+trim(newTweet)+twitterVia+'" data-count="none"></a>'
        var buttonscript = document.createElement('script');
        buttonscript.type = 'text/javascript';
        buttonscript.src = ('http://platform.twitter.com/widgets.js');
        var target=document.getElementById("deferredjs");
        target.parentNode.insertBefore(buttonscript,target);
        
        $("span#tweet-it").html(button);
        
        $('#ipsum').click(function() {
            SelectText('ipsum');
            CopyToClipboard();
        });
    });

    // loreming and ipsuming - original versions at http://bridell.com/loremipsum/
    var endings = "................................??!";

    function chance(percentage){
        return (Math.floor(Math.random() * 100) < percentage);
    }

    function capitalize(aString){
        return aString.substring(0,1).toUpperCase() + aString.substring(1, aString.length);
    }

    function getLoremWord(){
        return loremLang[Math.floor(Math.random()*loremLang.length)];
    }

    function getLoremEnding(){
        var i = Math.floor(Math.random()*endings.length);
        return endings.substring(i, i+1);
    }

    function loremIpsum(numWords) {
        var words = "";
        for(var i=0; i<numWords-1; i++){
            words += getLoremWord() + " ";
        }
        return words;
    }

    function loremIpsumSentenceNoPunc(numWords) {
        var words = "";
        words += capitalize(getLoremWord()) + " ";
        words += loremIpsum(numWords-1);
        words += getLoremEnding() + " ";
        return words;
    }

    function loremIpsumSentence(numWords) {
        var words = "";
        words += capitalize(getLoremWord()) + " ";
        var part1 = 0;
        if(chance(33)){
            // insert a comma within the sentence
            part1 = Math.floor(Math.random() * numWords-2);
            words += loremIpsum(part1);
            words = trim(words) + ", ";
        } else {
            words += " ";
        }
        words += loremIpsum(numWords - part1 - 1);
        words = trim(words) + getLoremEnding() + " ";
        return words;
    }

    function loremIpsumParagraph(numWords){
        var thisNum = numWords;
        var words = "";
        while(thisNum > 0){
            if(thisNum > 10){
                w = Math.floor(Math.random() * 8) + 2;
                words += loremIpsumSentence(w);
                thisNum = thisNum - w;
            } else {
                words += loremIpsumSentence(thisNum);
                thisNum = 0;
            }
        }
        return trim(words.replace(/  /g,' '));
    }
});

// some extra helpers
function uniquesOnly(str) {
    arr = str.split('|');
    temp = new Array();
    for (i=0;i<arr.length;i++) {
        if (temp.indexOf(arr[i]) == -1) {
            temp.push(arr[i]);
        }
    }
    return temp.join('|');
}

function trim(strText) { 
    while (strText.substring(0,1) == ' ') 
        strText = strText.substring(1, strText.length);
    while (strText.substring(strText.length-1,strText.length) == ' ')
        strText = strText.substring(0, strText.length-1);
   return strText;
}

function SelectText(element) {
    var text = document.getElementById(element);
    if ($.browser.msie) {
        var range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if ($.browser.mozilla || $.browser.opera) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    } else if ($.browser.safari) {
        var selection = window.getSelection();
        selection.selectAllChildren(text);
    }
}
